# EcoSentinel Bangalore 🛰️🐛
### Urban Waste Management & Bio-Remediation System (Ward 111 - Shanthi Nagar / K.H. Double Road)

EcoSentinel Bangalore is a full-stack, production-ready prototype that solves urban plastic accumulation along the high-density Shanthi Nagar / Double Road (K.H. Road) corridor in Bengaluru.

Instead of dumping non-recyclable urban polymers into distant, overflowing landfills (such as Mandur or Mittaganahalli), EcoSentinel integrates **automated remote sensing computer vision** with **localized biological plastic degradation depots** powered by mealworms (*Tenebrio molitor*) and waxworms (*Galleria mellonella*).

---

## 🏛️ System Architecture

```
ecosentinel-bangalore/
├── backend/
│   ├── app.py                     # Flask REST API & Webhook Dispatcher
│   ├── requirements.txt           # Python dependencies (Flask, OpenCV, NumPy, Pillow)
│   ├── models/
│   │   ├── __init__.py
│   │   └── detector.py            # OpenCV HSV Color Masking, Contour & Tonnage Analysis
│   ├── data/
│   │   ├── __init__.py
│   │   └── bangalore_regions.py   # Shanthi Nagar / Double Road GIS nodes & species kinetics
│   └── utils/
│       ├── __init__.py
│       └── bbmp_dispatcher.py     # BBMP Ward 111 SWM grievance ticket & webhook engine
│
├── frontend/
│   ├── package.json               # React 18, Vite, Tailwind CSS, Lucide-React
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                # Main application state & notification manager
│       ├── index.css              # Custom Tailwind HUD styling & animations
│       ├── services/
│       │   └── api.js             # API connector to backend endpoints
│       └── components/
│           ├── Navbar.jsx         # Telemetry badges & scan trigger
│           ├── Dashboard.jsx      # Command HUD container with live counters
│           ├── SatelliteView.jsx  # Interactive Double Road grid map & CV layer toggles
│           ├── WormTracker.jsx    # Bio-remediation larvae kinetics & pod deployment modal
│           ├── BBMPAlertFeed.jsx  # Live municipal grievance log & webhook status
│           └── MetricCard.jsx     # High-contrast analytical stat cards
│
└── README.md
```

---

## 🔬 Core Innovations

### 1. Multi-Spectral Computer Vision Detection (`backend/models/detector.py`)
- Simulates high-resolution aerial satellite feeds (Ground Sampling Distance = 0.25m/px) over the Double Road corridor.
- Converts feed from BGR to HSV color space to segment characteristic spectral signatures of unauthorized dumps:
  - **Blue Tarpaulin Mask**: Isolates polyethylene/tarpaulin sheeting ($H \in [90, 135]$, $S \in [60, 255]$, $V \in [60, 255]$).
  - **Reflective Polythene Mask**: Isolates high-reflectance discarded thin-film plastics ($H \in [0, 180]$, $S \in [0, 45]$, $V \in [205, 255]$).
- Morphological opening and closing filters eliminate sensor noise and consolidate contiguous clusters.
- Contour analysis calculates bounding boxes, centroid geographic coordinates, surface area in $m^2$, estimated plastic tonnage, and severity classification (`LOW`, `MODERATE`, `SEVERE`, `CRITICAL`).

### 2. Microbiome Bio-Remediation Kinetics (`backend/data/bangalore_regions.py`)
- **Galleria mellonella (Greater Waxworm)**:
  - Consumes HDPE and PE plastics at ~2.0 mg/larva/day via gut symbionts (*Enterobacter asburiae*).
  - Standard Deployment Unit (50,000 larvae pod) digests ~100 kg/day.
- **Tenebrio molitor (Yellow Mealworm)**:
  - Degrades expanded polystyrene (EPS / Styrofoam) and packaging film at ~0.25 mg/larva/day.
  - Standard Deployment Unit digests ~12.5 kg/day.
- Produces organic nitrogen-rich bio-frass suitable for municipal landscaping in neighboring Lalbagh Botanical Garden.

### 3. Automated BBMP SWM Escalation Engine (`backend/utils/bbmp_dispatcher.py`)
- Autonomous grievance dispatching for Ward 111 (Shanthi Nagar Sub-division).
- Formulates grievance tickets (`BBMP-SWM-2026-XXXXX`) assigned to the Assistant Executive Engineer (AEE) or Junior Health Inspector (JHI).
- Dispatches simulated HTTP 202 Webhook notifications.

---

## 🚀 Quickstart Guide

### Prerequisites
- Python 3.10+
- Node.js v18+ & npm

### 1. Launch Backend API
```bash
cd backend
# Create & activate virtual environment (if not already created)
python -m venv venv
.\venv\Scripts\activate   # On Windows
# source venv/bin/activate # On Linux/macOS

# Install dependencies
pip install -r requirements.txt

# Start Flask server (runs on http://127.0.0.1:5000)
python app.py
```

### 2. Launch Frontend Command Dashboard
```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server (runs on http://localhost:5173)
npm run dev
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/status` | Complete localized landfill records, colony metrics, and BBMP alerts |
| `POST` | `/api/scan` | Triggers a live computer vision satellite scan over Shanthi Nagar |
| `POST` | `/api/deploy-worms` | Adds bio-remediation worm pods to a landfill and recalculates digestion speed |
| `GET` | `/api/satellite-feed`| Returns base64 encoded raw, HSV mask, and annotated CV images |
| `POST` | `/api/resolve-alert`| Acknowledges/resolves a BBMP municipal alert ticket |
| `GET` | `/api/health` | Health check endpoint |
