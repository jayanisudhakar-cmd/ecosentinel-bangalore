import React from 'react';
import { 
  Trash2, 
  Bug, 
  Zap, 
  Flame, 
  ShieldAlert, 
  Leaf, 
  Activity, 
  TrendingDown, 
  MapPin,
  CheckCircle2
} from 'lucide-react';
import MetricCard from './MetricCard';
import SatelliteView from './SatelliteView';
import WormTracker from './WormTracker';
import BBMPAlertFeed from './BBMPAlertFeed';

export default function Dashboard({
  status,
  scanData,
  landfills,
  alerts,
  selectedLandfill,
  onSelectLandfill,
  onDeployWorms,
  isDeploying,
  deployModalLandfill,
  setDeployModalLandfill,
  onResolveAlert,
  isScanning
}) {
  const totals = status?.totals || {
    total_tonnage: 16.45,
    total_area_m2: 637.0,
    total_worm_units: 9,
    total_larvae_count: 450000,
    total_digestion_kg_day: 462.5,
    daily_co2_offset_kg: 1295.0,
    active_critical_sites: 2,
    active_sites_count: 5,
  };

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      
      {/* 1. Analytical Summary Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <MetricCard
          title="Monitored Plastic Mass"
          value={totals.total_tonnage}
          unit="Tons"
          icon={Trash2}
          color="rose"
          subtext={`Ward 111 Surface: ${totals.total_area_m2} m²`}
          change={`${totals.active_critical_sites} Critical Zones`}
        />

        <MetricCard
          title="Active Bio-Remediation"
          value={totals.total_worm_units}
          unit="Pod Units"
          icon={Bug}
          color="emerald"
          subtext={`${(totals.total_larvae_count / 1000).toFixed(0)}k Larvae Colony`}
          change="T. molitor + G. mellonella"
        />

        <MetricCard
          title="24h Digestion Velocity"
          value={totals.total_digestion_kg_day}
          unit="kg/day"
          icon={Zap}
          color="cyan"
          subtext="Biodegrading non-recyclables"
          change="+45 kg/day this week"
        />

        <MetricCard
          title="Municipal Carbon Offset"
          value={totals.daily_co2_offset_kg}
          unit="kg CO2e/d"
          icon={Leaf}
          color="amber"
          subtext="Eliminating open burning"
          change="Circular Eco-Credit"
        />

      </div>

      {/* 2. Primary Operations Grid: Satellite CV View & Bio-Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left / Center: Geospatial Grid & Computer Vision Satellite Feed */}
        <div className="lg:col-span-7 h-full">
          <SatelliteView
            scanData={scanData}
            landfills={landfills}
            selectedLandfill={selectedLandfill}
            onSelectLandfill={onSelectLandfill}
            onOpenDeployModal={(lf) => setDeployModalLandfill(lf)}
            isScanning={isScanning}
          />
        </div>

        {/* Right: Bio-Remediation Worm Tracker */}
        <div className="lg:col-span-5 h-full">
          <WormTracker
            landfills={landfills}
            speciesProfiles={status?.species_profiles}
            onDeployWorms={onDeployWorms}
            isDeploying={isDeploying}
            deployModalLandfill={deployModalLandfill}
            setDeployModalLandfill={setDeployModalLandfill}
          />
        </div>

      </div>

      {/* 3. Secondary Row: BBMP Alert Feed & Scientific Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* BBMP Ward 111 SWM Grievance Stream */}
        <div className="lg:col-span-7">
          <BBMPAlertFeed
            alerts={alerts}
            onResolveAlert={onResolveAlert}
          />
        </div>

        {/* Bio-Degradation Innovation Briefing */}
        <div className="lg:col-span-5 bg-[#111822] rounded-xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-semibold text-slate-100">
                Biological Plastic Breakdown Architecture
              </h3>
            </div>

            <div className="mt-4 space-y-3.5 text-xs leading-relaxed text-slate-300">
              <p>
                <strong className="text-emerald-400">Targeted Biodegradation:</strong> Rather than hauling non-recyclable urban plastic waste to overburdened landfills like Mandur or Mittaganahalli, EcoSentinel establishes localized micro-bioreactors.
              </p>

              <div className="p-3 rounded-lg bg-[#0a0e14] border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-mono font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enzymatic Depolymerization</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Gut microbiota (<em className="text-slate-300">Enterobacter asburiae</em> in waxworms) break high-density polyethylene polymer chains into biodegradable organic frass within 48 to 72 hours.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#0a0e14] border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-mono font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Zero-Emission Closed Loop</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Digested byproducts produce certified nitrogenous soil amendment for BBMP horticulture parks (such as neighboring Lalbagh Botanical Garden).
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>BBMP SWM Innovation Cell</span>
            <span className="text-emerald-400 font-medium">Bengaluru Urban 2026</span>
          </div>

        </div>

      </div>

    </main>
  );
}
