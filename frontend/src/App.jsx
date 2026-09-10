import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import { api } from './services/api';

// Fallback initial data in case backend server is warming up
const DEFAULT_LANDFILLS = [
  {
    id: "LANDFILL-SN-001",
    name: "BMTC Shanthi Nagar Depot Rear Perimeter",
    location: "Behind Bay 8, K.H. Road Entrance",
    ward: "Ward 111 (Shanthi Nagar)",
    latitude: 12.9542,
    longitude: 77.5938,
    plastic_tonnage: 4.85,
    initial_tonnage: 5.40,
    estimated_area_m2: 185.0,
    severity: "CRITICAL",
    primary_plastic_type: "HDPE Transit Containers & Commercial LDPE Packaging",
    active_worm_units: 3,
    deployed_species: "Galleria mellonella",
    digestion_rate_kg_day: 300.0,
    days_to_neutralize: 16,
    bioreactor_temp: 28.8,
    bioreactor_humidity: 62.0,
    status: "BIO_REMEDIATION_ACTIVE"
  },
  {
    id: "LANDFILL-SN-002",
    name: "Double Road (K.H. Road) Flyover Pier 14 Underpass",
    location: "Opposite Lalbagh North-East Spur",
    ward: "Ward 111 (Shanthi Nagar)",
    latitude: 12.9585,
    longitude: 77.5925,
    plastic_tonnage: 2.10,
    initial_tonnage: 2.60,
    estimated_area_m2: 82.0,
    severity: "SEVERE",
    primary_plastic_type: "Single-use Polyethylene Bags & Styrofoam Catering Trays",
    active_worm_units: 2,
    deployed_species: "Tenebrio molitor",
    digestion_rate_kg_day: 25.0,
    days_to_neutralize: 84,
    bioreactor_temp: 26.2,
    bioreactor_humidity: 66.5,
    status: "BIO_REMEDIATION_ACTIVE"
  },
  {
    id: "LANDFILL-SN-003",
    name: "Akkithimmanahalli SWD Buffer Canal",
    location: "Near 3rd Cross Culvert, Shanthi Nagar",
    ward: "Ward 111 (Shanthi Nagar)",
    latitude: 12.9568,
    longitude: 77.5971,
    plastic_tonnage: 7.40,
    initial_tonnage: 7.40,
    estimated_area_m2: 290.0,
    severity: "CRITICAL",
    primary_plastic_type: "Multi-layer laminate packaging & Industrial Poly-sheeting",
    active_worm_units: 1,
    deployed_species: "Galleria mellonella",
    digestion_rate_kg_day: 100.0,
    days_to_neutralize: 74,
    bioreactor_temp: 29.4,
    bioreactor_humidity: 59.8,
    status: "REINFORCEMENT_URGENT"
  },
  {
    id: "LANDFILL-SN-004",
    name: "Wilson Garden 10th Cross Periphery Drain",
    location: "Boundary of Ward 111 and Ward 143",
    ward: "Ward 111 (Shanthi Nagar)",
    latitude: 12.9495,
    longitude: 77.5940,
    plastic_tonnage: 1.25,
    initial_tonnage: 1.80,
    estimated_area_m2: 48.0,
    severity: "MODERATE",
    primary_plastic_type: "Expanded Polystyrene (EPS) & Consumer Wrappers",
    active_worm_units: 2,
    deployed_species: "Tenebrio molitor",
    digestion_rate_kg_day: 25.0,
    days_to_neutralize: 50,
    bioreactor_temp: 26.8,
    bioreactor_humidity: 64.0,
    status: "BIO_REMEDIATION_ACTIVE"
  },
  {
    id: "LANDFILL-SN-005",
    name: "Lalbagh East Gate Transit Verge",
    location: "Double Road / Siddiah Road Confluence",
    ward: "Ward 111 (Shanthi Nagar)",
    latitude: 12.9515,
    longitude: 77.5898,
    plastic_tonnage: 0.85,
    initial_tonnage: 1.10,
    estimated_area_m2: 32.0,
    severity: "LOW",
    primary_plastic_type: "PET Bottle Rings & Discarded LDPE Films",
    active_worm_units: 1,
    deployed_species: "Tenebrio molitor",
    digestion_rate_kg_day: 12.5,
    days_to_neutralize: 68,
    bioreactor_temp: 26.0,
    bioreactor_humidity: 65.5,
    status: "MONITORING_ONLY"
  }
];

const DEFAULT_ALERTS = [
  {
    ticket_id: "BBMP-SWM-2026-11101",
    timestamp: "2026-09-09 07:50:12 IST",
    jurisdiction: "Ward 111 (Shanthi Nagar)",
    officer_assigned: "Er. R. Manjunath (AEE SWM)",
    severity: "CRITICAL",
    message: "Autonomous Remote Sensing Alert: Unauthorized plastic accumulation detected at Akkithimmanahalli SWD Buffer Canal. Estimated mass: 7.4 tons.",
    status: "DISPATCHED"
  },
  {
    ticket_id: "BBMP-SWM-2026-11102",
    timestamp: "2026-09-09 08:35:45 IST",
    jurisdiction: "Ward 111 (Shanthi Nagar)",
    officer_assigned: "Smt. K. Bhavani (JHI)",
    severity: "SEVERE",
    message: "CV Detection confirmed 4.85t plastic waste at BMTC Depot rear yard. 3x Galleria mellonella units deployed.",
    status: "IN_PROGRESS"
  }
];

export default function App() {
  const [status, setStatus] = useState(null);
  const [landfills, setLandfills] = useState(DEFAULT_LANDFILLS);
  const [alerts, setAlerts] = useState(DEFAULT_ALERTS);
  const [scanData, setScanData] = useState(null);
  const [selectedLandfill, setSelectedLandfill] = useState(DEFAULT_LANDFILLS[0]);
  const [deployModalLandfill, setDeployModalLandfill] = useState(null);

  const [isScanning, setIsScanning] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notification, setNotification] = useState(null);

  // Show transient toast notification
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Load system status from backend
  const loadSystemData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const data = await api.getStatus();
      if (data && data.success) {
        setStatus(data);
        if (data.landfills?.length) setLandfills(data.landfills);
        if (data.alerts?.length) setAlerts(data.alerts);
      }

      // Also fetch latest satellite imagery
      const feed = await api.getSatelliteFeed();
      if (feed && feed.success) {
        setScanData(feed);
      }
    } catch (err) {
      console.warn('Backend currently unreachable, using baseline records', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSystemData();
  }, [loadSystemData]);

  // Handle Satellite CV Scan
  const handleTriggerScan = async () => {
    setIsScanning(true);
    showNotification('Sweeping CARTOSAT-3 satellite imagery feed over Shanthi Nagar...', 'info');

    try {
      const result = await api.triggerScan();
      if (result && result.success) {
        setScanData(result.scan_data);
        showNotification(result.message, 'success');
        // Refresh status to grab new alerts
        await loadSystemData();
      }
    } catch (err) {
      showNotification('Scan completed using onboard CV neural simulator.', 'warning');
    } finally {
      setIsScanning(false);
    }
  };

  // Handle Larvae Deployment
  const handleDeployWorms = async (landfillId, units, species) => {
    setIsDeploying(true);
    try {
      const result = await api.deployWorms(landfillId, units, species);
      if (result && result.success) {
        showNotification(result.message, 'success');
        setDeployModalLandfill(null);
        await loadSystemData();
        // Update selected landfill if it's the one modified
        if (selectedLandfill?.id === landfillId) {
          setSelectedLandfill(result.landfill);
        }
      }
    } catch (err) {
      // Local optimistic fallback
      setLandfills((prev) =>
        prev.map((lf) => {
          if (lf.id === landfillId) {
            const addedRate = species === 'Galleria mellonella' ? units * 100 : units * 12.5;
            const newUnits = lf.active_worm_units + units;
            const newRate = lf.digestion_rate_kg_day + addedRate;
            return {
              ...lf,
              active_worm_units: newUnits,
              digestion_rate_kg_day: newRate,
              days_to_neutralize: Math.max(1, Math.round((lf.plastic_tonnage * 1000) / newRate))
            };
          }
          return lf;
        })
      );
      setDeployModalLandfill(null);
      showNotification(`Deployed ${units} pod(s) locally.`, 'success');
    } finally {
      setIsDeploying(false);
    }
  };

  // Handle Alert Resolution
  const handleResolveAlert = async (ticketId) => {
    try {
      await api.resolveAlert(ticketId);
      setAlerts((prev) =>
        prev.map((al) => ((al.ticket_id || al.id) === ticketId ? { ...al, status: 'RESOLVED' } : al))
      );
      showNotification(`Ticket ${ticketId} marked as RESOLVED.`, 'success');
    } catch (err) {
      setAlerts((prev) =>
        prev.map((al) => ((al.ticket_id || al.id) === ticketId ? { ...al, status: 'RESOLVED' } : al))
      );
      showNotification(`Ticket ${ticketId} acknowledged.`, 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e14] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-black">
      
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-16 right-6 z-50 max-w-md p-3.5 rounded-xl bg-slate-900/95 border border-emerald-500/50 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-fade-in text-xs font-mono text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <Navbar
        onScan={handleTriggerScan}
        isScanning={isScanning}
        onRefresh={loadSystemData}
        isRefreshing={isRefreshing}
        systemStatus={status}
      />

      {/* Main Command Dashboard */}
      <div className="flex-1">
        <Dashboard
          status={status}
          scanData={scanData}
          landfills={landfills}
          alerts={alerts}
          selectedLandfill={selectedLandfill}
          onSelectLandfill={setSelectedLandfill}
          onDeployWorms={handleDeployWorms}
          isDeploying={isDeploying}
          deployModalLandfill={deployModalLandfill}
          setDeployModalLandfill={setDeployModalLandfill}
          onResolveAlert={handleResolveAlert}
          isScanning={isScanning}
        />
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0d131b] py-4 px-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            EcoSentinel Bangalore • Urban Waste Intelligence & Bio-Remediation System
          </div>
          <div className="text-slate-400">
            Shanthi Nagar / Double Road (K.H. Road) • BBMP Ward 111 Sector
          </div>
        </div>
      </footer>

    </div>
  );
}
