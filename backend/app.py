"""
EcoSentinel Bangalore - Flask Backend Server
Urban waste management & bio-remediation platform for Bengaluru Ward 111 (Shanthi Nagar / Double Road)
"""

import copy
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS

from models.detector import SatelliteLandfillDetector
from data.bangalore_regions import INITIAL_LANDFILLS, INITIAL_ALERTS, SPECIES_PROFILES
from utils.bbmp_dispatcher import BBMPDispatcher

app = Flask(__name__)
# Enable CORS for frontend Vite development & production origins
CORS(app, resources={r"/api/*": {"origins": "*"}})

# State Singletons
detector = SatelliteLandfillDetector(gsd_meters_per_pixel=0.25)
dispatcher = BBMPDispatcher()

# In-memory working state
landfill_registry = copy.deepcopy(INITIAL_LANDFILLS)
alert_history = copy.deepcopy(INITIAL_ALERTS)
latest_scan_result = None

# Initialize first scan run on server boot
latest_scan_result = detector.process_frame()


def recalculate_totals():
    total_tonnage = sum(lf["plastic_tonnage"] for lf in landfill_registry)
    total_area = sum(lf["estimated_area_m2"] for lf in landfill_registry)
    total_units = sum(lf["active_worm_units"] for lf in landfill_registry)
    total_digestion_kg_day = sum(lf["digestion_rate_kg_day"] for lf in landfill_registry)
    
    # Calculate CO2 offset: ~2.8 kg CO2 emitted per kg of virgin plastic incinerated or unmanaged open burned
    daily_co2_offset_kg = round(total_digestion_kg_day * 2.8, 1)

    return {
        "total_tonnage": round(total_tonnage, 2),
        "total_area_m2": round(total_area, 1),
        "total_worm_units": total_units,
        "total_larvae_count": total_units * 50000,
        "total_digestion_kg_day": round(total_digestion_kg_day, 1),
        "daily_co2_offset_kg": daily_co2_offset_kg,
        "active_critical_sites": sum(1 for lf in landfill_registry if lf["severity"] == "CRITICAL"),
        "active_sites_count": len(landfill_registry),
    }


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "HEALTHY",
        "service": "EcoSentinel-Bangalore-Backend",
        "jurisdiction": "Bengaluru Ward 111 (Shanthi Nagar / K.H. Double Road)",
        "timestamp": datetime.now().isoformat()
    })


@app.route("/api/status", methods=["GET"])
def get_status():
    """
    Returns the comprehensive state of all localized landfill records,
    bio-remediation worm colonies, aggregate metrics, species biology profiles,
    and BBMP alert logs.
    """
    totals = recalculate_totals()
    return jsonify({
        "success": True,
        "ward": "Ward 111 (Shanthi Nagar)",
        "corridor": "K.H. Double Road / Akkithimmanahalli / Lalbagh East",
        "totals": totals,
        "landfills": landfill_registry,
        "species_profiles": SPECIES_PROFILES,
        "alerts": alert_history,
        "has_recent_scan": latest_scan_result is not None
    })


@app.route("/api/scan", methods=["POST"])
def trigger_satellite_scan():
    """
    Triggers a live computer vision satellite scan sweep over Shanthi Nagar / Double Road.
    Runs HSV color segmentation & contour analysis, assigns severity, and dispatches
    automated BBMP alerts for any severe/critical clusters.
    """
    global latest_scan_result, alert_history

    # Execute OpenCV detector pipeline
    scan_output = detector.process_frame()
    latest_scan_result = scan_output

    # Update or associate scan detections with existing registry
    new_alerts_created = 0
    for det in scan_output["detections"]:
        # If severe or critical, formulate and log an automated BBMP alert
        if det["severity"] in ["CRITICAL", "SEVERE"]:
            alert_payload = dispatcher.dispatch_alert(
                landfill_data={
                    "id": det["id"],
                    "name": f"{det['name']} [{det['id']}]",
                    "latitude": det["latitude"],
                    "longitude": det["longitude"],
                    "plastic_tonnage": det["estimated_tonnage"],
                    "severity": det["severity"]
                },
                custom_msg=(
                    f"Remote Sensing Trigger: {det['severity']} anomaly identified at {det['name']}. "
                    f"Covering {det['ground_area_m2']} m² with ~{det['estimated_tonnage']}t plastic. "
                    f"Automated bio-barrier protocol logged to BBMP SWM Ward 111."
                )
            )
            # Insert into alert history
            alert_history.insert(0, alert_payload)
            new_alerts_created += 1

    return jsonify({
        "success": True,
        "message": f"Satellite sweep complete. {scan_output['total_detections']} clusters detected. {new_alerts_created} automated BBMP alerts dispatched.",
        "scan_data": {
            "timestamp": scan_output["timestamp"],
            "region": scan_output["region"],
            "total_detections": scan_output["total_detections"],
            "total_plastic_area_m2": scan_output["total_plastic_area_m2"],
            "total_plastic_tonnage": scan_output["total_plastic_tonnage"],
            "detections": scan_output["detections"],
            "images": scan_output["images"]
        }
    })


@app.route("/api/satellite-feed", methods=["GET"])
def get_satellite_feed():
    """
    Returns the latest satellite imagery package:
    - Raw aerial imagery
    - Clean HSV binary segmentation mask
    - Annotated image with contours, bounding boxes, and HUD overlays
    """
    global latest_scan_result
    if latest_scan_result is None:
        latest_scan_result = detector.process_frame()

    return jsonify({
        "success": True,
        "region": latest_scan_result["region"],
        "detections_count": latest_scan_result["total_detections"],
        "images": latest_scan_result["images"]
    })


@app.route("/api/deploy-worms", methods=["POST"])
def deploy_worms():
    """
    Increments active bio-remediation worm deployment units for a specific landfill.
    Accepts: { "landfill_id": str, "units": int, "species": str }
    Recalculates digestion kinetics and estimated time to neutralize plastic tonnage.
    """
    data = request.get_json() or {}
    landfill_id = data.get("landfill_id")
    units_to_add = int(data.get("units", 1))
    species = data.get("species", "Galleria mellonella")

    if not landfill_id:
        return jsonify({"success": False, "error": "Missing 'landfill_id'"}), 400

    if species not in SPECIES_PROFILES:
        return jsonify({"success": False, "error": f"Invalid species. Must be one of {list(SPECIES_PROFILES.keys())}"}), 400

    target_landfill = None
    for lf in landfill_registry:
        if lf["id"] == landfill_id:
            target_landfill = lf
            break

    if not target_landfill:
        return jsonify({"success": False, "error": f"Landfill ID '{landfill_id}' not found."}), 404

    # Update colony units & kinetics
    target_landfill["active_worm_units"] += units_to_add
    target_landfill["deployed_species"] = species

    nominal_rate_per_unit = SPECIES_PROFILES[species]["nominal_unit_capacity_kg_day"]
    new_digestion_rate = round(target_landfill["active_worm_units"] * nominal_rate_per_unit, 1)
    target_landfill["digestion_rate_kg_day"] = new_digestion_rate

    # Recalculate days to complete neutralization
    remaining_kg = target_landfill["plastic_tonnage"] * 1000.0
    if new_digestion_rate > 0:
        target_landfill["days_to_neutralize"] = max(1, int(round(remaining_kg / new_digestion_rate)))
    else:
        target_landfill["days_to_neutralize"] = 999

    target_landfill["status"] = "BIO_REMEDIATION_ACTIVE"
    target_landfill["last_inspected"] = datetime.now().strftime("%Y-%m-%dT%H:%M:%S+05:30")

    # Dispatch confirmation alert to BBMP ledger
    dispatch_msg = (
        f"Bio-Remediation Reinforcement: Deployed +{units_to_add} units ({units_to_add * 50000:,} larvae) of "
        f"{species} to {target_landfill['name']}. "
        f"New daily digestion capacity: {new_digestion_rate} kg/day. "
        f"Projected remediation: {target_landfill['days_to_neutralize']} days."
    )
    alert = dispatcher.dispatch_alert(target_landfill, custom_msg=dispatch_msg)
    alert_history.insert(0, alert)

    return jsonify({
        "success": True,
        "message": f"Successfully deployed {units_to_add} unit(s) to {target_landfill['name']}",
        "landfill": target_landfill,
        "totals": recalculate_totals(),
        "dispatched_alert": alert
    })


@app.route("/api/resolve-alert", methods=["POST"])
def resolve_alert():
    """Marks an alert or BBMP ticket as RESOLVED or ACKNOWLEDGED."""
    data = request.get_json() or {}
    ticket_id = data.get("ticket_id")

    for al in alert_history:
        if al.get("ticket_id") == ticket_id or al.get("id") == ticket_id:
            al["status"] = "RESOLVED"
            al["resolved_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
            return jsonify({"success": True, "alert": al})

    return jsonify({"success": False, "error": "Alert ticket not found"}), 404


if __name__ == "__main__":
    print("[EcoSentinel Bangalore] Booting Flask server on http://127.0.0.1:5000")
    app.run(host="0.0.0.0", port=5000, debug=False)
