"""
Geospatial and bio-remediation dataset for Bengaluru Ward 111 (Shanthi Nagar / Double Road).
Includes initial registered micro-landfills, species biology parameters, and degradation kinetics.
"""

# Species Degradation Science Models
SPECIES_PROFILES = {
    "Tenebrio molitor": {
        "common_name": "Yellow Mealworm",
        "primary_plastic_target": "Polystyrene (PS, Styrofoam) & Low-Density Polyethylene (LDPE)",
        "consumption_mg_per_larva_day": 0.25,
        "standard_unit_larvae_count": 50000,
        "nominal_unit_capacity_kg_day": 12.5,  # 50,000 * 0.00025 kg
        "ideal_temp_celsius": 26.5,
        "ideal_humidity_percent": 65.0,
        "byproduct": "Nitrogen-rich bio-frass (certified soil amendment)",
        "gut_microbiome": ["Citrobacter sp.", "Kosakonia sp."],
    },
    "Galleria mellonella": {
        "common_name": "Greater Waxworm",
        "primary_plastic_target": "High-Density Polyethylene (HDPE) & Polypropylene (PP)",
        "consumption_mg_per_larva_day": 2.0,
        "standard_unit_larvae_count": 50000,
        "nominal_unit_capacity_kg_day": 100.0,  # 50,000 * 0.0020 kg
        "ideal_temp_celsius": 29.0,
        "ideal_humidity_percent": 60.0,
        "byproduct": "Ethylene glycol intermediate & organic compost residue",
        "gut_microbiome": ["Enterobacter asburiae", "Bacillus sp. YP1"],
    }
}

# Initial Landfill Registrations in Shanthi Nagar / Double Road (K.H. Road)
INITIAL_LANDFILLS = [
    {
        "id": "LANDFILL-SN-001",
        "name": "BMTC Shanthi Nagar Depot Rear Perimeter",
        "location": "Behind Bay 8, K.H. Road Entrance",
        "ward": "Ward 111 (Shanthi Nagar)",
        "latitude": 12.9542,
        "longitude": 77.5938,
        "plastic_tonnage": 4.85,
        "initial_tonnage": 5.40,
        "estimated_area_m2": 185.0,
        "severity": "CRITICAL",
        "primary_plastic_type": "HDPE Transit Containers & Commercial LDPE Packaging",
        "active_worm_units": 3,
        "deployed_species": "Galleria mellonella",
        "digestion_rate_kg_day": 300.0,
        "days_to_neutralize": 16,
        "bioreactor_temp": 28.8,
        "bioreactor_humidity": 62.0,
        "status": "BIO_REMEDIATION_ACTIVE",
        "last_inspected": "2026-09-09T08:30:00+05:30"
    },
    {
        "id": "LANDFILL-SN-002",
        "name": "Double Road (K.H. Road) Flyover Pier 14 Underpass",
        "location": "Opposite Lalbagh North-East Spur",
        "ward": "Ward 111 (Shanthi Nagar)",
        "latitude": 12.9585,
        "longitude": 77.5925,
        "plastic_tonnage": 2.10,
        "initial_tonnage": 2.60,
        "estimated_area_m2": 82.0,
        "severity": "SEVERE",
        "primary_plastic_type": "Single-use Polyethylene Bags & Styrofoam Catering Trays",
        "active_worm_units": 2,
        "deployed_species": "Tenebrio molitor",
        "digestion_rate_kg_day": 25.0,
        "days_to_neutralize": 84,
        "bioreactor_temp": 26.2,
        "bioreactor_humidity": 66.5,
        "status": "BIO_REMEDIATION_ACTIVE",
        "last_inspected": "2026-09-09T09:15:00+05:30"
    },
    {
        "id": "LANDFILL-SN-003",
        "name": "Akkithimmanahalli SWD Buffer Canal",
        "location": "Near 3rd Cross Culvert, Shanthi Nagar",
        "ward": "Ward 111 (Shanthi Nagar)",
        "latitude": 12.9568,
        "longitude": 77.5971,
        "plastic_tonnage": 7.40,
        "initial_tonnage": 7.40,
        "estimated_area_m2": 290.0,
        "severity": "CRITICAL",
        "primary_plastic_type": "Multi-layer laminate packaging & Industrial Poly-sheeting",
        "active_worm_units": 1,
        "deployed_species": "Galleria mellonella",
        "digestion_rate_kg_day": 100.0,
        "days_to_neutralize": 74,
        "bioreactor_temp": 29.4,
        "bioreactor_humidity": 59.8,
        "status": "REINFORCEMENT_URGENT",
        "last_inspected": "2026-09-09T07:45:00+05:30"
    },
    {
        "id": "LANDFILL-SN-004",
        "name": "Wilson Garden 10th Cross Periphery Drain",
        "location": "Boundary of Ward 111 and Ward 143",
        "ward": "Ward 111 (Shanthi Nagar)",
        "latitude": 12.9495,
        "longitude": 77.5940,
        "plastic_tonnage": 1.25,
        "initial_tonnage": 1.80,
        "estimated_area_m2": 48.0,
        "severity": "MODERATE",
        "primary_plastic_type": "Expanded Polystyrene (EPS) & Consumer Wrappers",
        "active_worm_units": 2,
        "deployed_species": "Tenebrio molitor",
        "digestion_rate_kg_day": 25.0,
        "days_to_neutralize": 50,
        "bioreactor_temp": 26.8,
        "bioreactor_humidity": 64.0,
        "status": "BIO_REMEDIATION_ACTIVE",
        "last_inspected": "2026-09-08T17:10:00+05:30"
    },
    {
        "id": "LANDFILL-SN-005",
        "name": "Lalbagh East Gate Transit Verge",
        "location": "Double Road / Siddiah Road Confluence",
        "ward": "Ward 111 (Shanthi Nagar)",
        "latitude": 12.9515,
        "longitude": 77.5898,
        "plastic_tonnage": 0.85,
        "initial_tonnage": 1.10,
        "estimated_area_m2": 32.0,
        "severity": "LOW",
        "primary_plastic_type": "PET Bottle Rings & Discarded LDPE Films",
        "active_worm_units": 1,
        "deployed_species": "Tenebrio molitor",
        "digestion_rate_kg_day": 12.5,
        "days_to_neutralize": 68,
        "bioreactor_temp": 26.0,
        "bioreactor_humidity": 65.5,
        "status": "MONITORING_ONLY",
        "last_inspected": "2026-09-08T14:20:00+05:30"
    }
]

# Baseline automated alert logs
INITIAL_ALERTS = [
    {
        "id": "BBMP-SWM-2026-11101",
        "timestamp": "2026-09-09T07:50:12+05:30",
        "landfill_id": "LANDFILL-SN-003",
        "landfill_name": "Akkithimmanahalli SWD Buffer Canal",
        "severity": "CRITICAL",
        "ward": "Ward 111 (Shanthi Nagar)",
        "officer_in_charge": "Assistant Executive Engineer (AEE), SWM Shanthi Nagar",
        "message": "Satellite spectral anomaly exceeds 250m². High plastic density adjacent to major storm drain. Escalated for emergency bio-remediation barrier.",
        "webhook_dispatched": True,
        "webhook_target": "https://swm.bbmp.gov.in/api/v2/grievance/ward111/dispatch",
        "status": "DISPATCHED"
    },
    {
        "id": "BBMP-SWM-2026-11102",
        "timestamp": "2026-09-09T08:35:45+05:30",
        "landfill_id": "LANDFILL-SN-001",
        "landfill_name": "BMTC Shanthi Nagar Depot Rear Perimeter",
        "severity": "SEVERE",
        "ward": "Ward 111 (Shanthi Nagar)",
        "officer_in_charge": "Junior Health Inspector (JHI), Shanthi Nagar Zone",
        "message": "CV Detection confirmed 4.85t plastic waste accumulation. 3x Galleria mellonella units deployed on site. Bio-digestion active.",
        "webhook_dispatched": True,
        "webhook_target": "https://swm.bbmp.gov.in/api/v2/grievance/ward111/dispatch",
        "status": "IN_PROGRESS"
    }
]
