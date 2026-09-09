"""
BBMP (Bruhat Bengaluru Mahanagara Palike) Webhook Dispatcher Simulator
Dispatches automated solid waste management (SWM) alerts, grievance tickets,
and bio-remediation task orders to the BBMP zonal administration.
"""

import time
import random
from datetime import datetime
from typing import Dict, Any, List


class BBMPDispatcher:
    def __init__(self):
        self.ward_name = "Ward 111 (Shanthi Nagar)"
        self.webhook_endpoint = "https://swm.bbmp.gov.in/api/v2/grievance/ward111/dispatch"
        self.officers = {
            "AEE": "Er. R. Manjunath (Assistant Executive Engineer, SWM Shanthi Nagar)",
            "JHI": "Smt. K. Bhavani (Junior Health Inspector, Double Road Sector)",
            "EE": "Sri. S. Prabhakar (Executive Engineer, East Zone BBMP)"
        }
        self.dispatch_log: List[Dict[str, Any]] = []

    def dispatch_alert(self, landfill_data: Dict[str, Any], custom_msg: str = None) -> Dict[str, Any]:
        """
        Formulates an official BBMP grievance ticket and simulates webhook dispatch.
        """
        ticket_id = f"BBMP-SWM-2026-{random.randint(11100, 99999)}"
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
        severity = landfill_data.get("severity", "SEVERE")

        officer = self.officers["AEE"] if severity == "CRITICAL" else self.officers["JHI"]

        message = custom_msg or (
            f"Autonomous Remote Sensing Alert: Unauthorized plastic accumulation detected at "
            f"{landfill_data.get('name', 'Shanthi Nagar site')}. "
            f"Estimated mass: {landfill_data.get('plastic_tonnage', landfill_data.get('estimated_tonnage', 1.5))} tons. "
            f"Active bio-remediation protocol initiated."
        )

        payload = {
            "ticket_id": ticket_id,
            "timestamp": timestamp,
            "jurisdiction": self.ward_name,
            "officer_assigned": officer,
            "landfill_id": landfill_data.get("id"),
            "landfill_name": landfill_data.get("name"),
            "coordinates": {
                "latitude": landfill_data.get("latitude"),
                "longitude": landfill_data.get("longitude")
            },
            "estimated_plastic_tons": landfill_data.get("plastic_tonnage", landfill_data.get("estimated_tonnage", 1.5)),
            "severity": severity,
            "recommended_action": "Deploy bio-remediation larva pods / initiate municipal physical barrier",
            "message": message,
            "webhook_target": self.webhook_endpoint,
            "http_status": 202,
            "delivery_ack": "ACCEPTED_BY_BBMP_SWM_GATEWAY",
            "status": "DISPATCHED"
        }

        self.dispatch_log.insert(0, payload)
        return payload

    def get_logs(self, limit: int = 15) -> List[Dict[str, Any]]:
        return self.dispatch_log[:limit]
