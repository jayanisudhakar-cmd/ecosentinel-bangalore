import React, { useState } from 'react';
import { 
  Bug, 
  Thermometer, 
  Droplets, 
  Activity, 
  Zap, 
  Clock, 
  PlusCircle, 
  ArrowUpRight, 
  Dna,
  ShieldCheck
} from 'lucide-react';

export default function WormTracker({ 
  landfills = [], 
  speciesProfiles = {}, 
  onDeployWorms, 
  isDeploying, 
  deployModalLandfill, 
  setDeployModalLandfill 
}) {
  const [selectedSpecies, setSelectedSpecies] = useState('Galleria mellonella');
  const [unitsToAdd, setUnitsToAdd] = useState(2);

  const currentSpeciesData = speciesProfiles[selectedSpecies] || {
    common_name: 'Greater Waxworm',
    nominal_unit_capacity_kg_day: 100.0,
    ideal_temp_celsius: 29.0,
    ideal_humidity_percent: 60.0,
    byproduct: 'Ethylene glycol & organic frass',
  };

  const handleDeploySubmit = (e) => {
    e.preventDefault();
    if (!deployModalLandfill) return;
    onDeployWorms(deployModalLandfill.id, unitsToAdd, selectedSpecies);
  };

  return (
    <div className="bg-[#111822] rounded-xl border border-slate-800 p-5 shadow-xl flex flex-col h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-semibold text-slate-100 tracking-wide">
              Bio-Remediation Larvae Telemetry
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Microbiome-catalyzed plastic degradation (T. molitor & G. mellonella)
          </p>
        </div>

        <button
          onClick={() => setDeployModalLandfill(landfills[0] || null)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Deploy Depot Pod</span>
        </button>
      </div>

      {/* Scientific Profile Cards (Mealworm vs Waxworm) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        
        {/* Galleria mellonella Card */}
        <div 
          onClick={() => setSelectedSpecies('Galleria mellonella')}
          className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
            selectedSpecies === 'Galleria mellonella'
              ? 'bg-emerald-950/40 border-emerald-500/70 shadow-md shadow-emerald-950/40'
              : 'bg-[#0a0e14] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400 font-bold">Galleria mellonella</span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              High Velocity
            </span>
          </div>
          <p className="text-xs text-slate-200 font-semibold mt-1">Greater Waxworm</p>
          <div className="mt-2 text-[11px] text-slate-400 space-y-1 font-mono">
            <p className="flex justify-between">
              <span>Target:</span>
              <span className="text-slate-200">HDPE & PE Film</span>
            </p>
            <p className="flex justify-between">
              <span>Digestion Rate:</span>
              <span className="text-emerald-400 font-semibold">~100 kg/day per unit</span>
            </p>
          </div>
        </div>

        {/* Tenebrio molitor Card */}
        <div 
          onClick={() => setSelectedSpecies('Tenebrio molitor')}
          className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
            selectedSpecies === 'Tenebrio molitor'
              ? 'bg-cyan-950/40 border-cyan-500/70 shadow-md shadow-cyan-950/40'
              : 'bg-[#0a0e14] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-400 font-bold">Tenebrio molitor</span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
              Polystyrene Target
            </span>
          </div>
          <p className="text-xs text-slate-200 font-semibold mt-1">Yellow Mealworm</p>
          <div className="mt-2 text-[11px] text-slate-400 space-y-1 font-mono">
            <p className="flex justify-between">
              <span>Target:</span>
              <span className="text-slate-200">Polystyrene & Styrofoam</span>
            </p>
            <p className="flex justify-between">
              <span>Digestion Rate:</span>
              <span className="text-cyan-400 font-semibold">~12.5 kg/day per unit</span>
            </p>
          </div>
        </div>

      </div>

      {/* Active Bio-Depot Site Registry & Digestion Kinetics */}
      <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1 max-h-[380px]">
        {landfills.map((lf) => {
          const initialKg = (lf.initial_tonnage || lf.plastic_tonnage) * 1000;
          const currentKg = lf.plastic_tonnage * 1000;
          const digestedKg = Math.max(0, initialKg - currentKg);
          const progressPercent = initialKg > 0 ? Math.min(100, Math.round((digestedKg / initialKg) * 100)) : 0;

          return (
            <div
              key={lf.id}
              className="p-3.5 rounded-lg bg-[#0a0e14] border border-slate-800 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">{lf.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">({lf.id})</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Target: {lf.primary_plastic_type}
                  </p>
                </div>

                <button
                  onClick={() => setDeployModalLandfill(lf)}
                  title="Deploy more larvae"
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-mono flex items-center gap-1 transition-colors"
                >
                  <PlusCircle className="w-3 h-3 text-emerald-400" />
                  <span>+Depot</span>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-2.5">
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Biodegradation Progress</span>
                  <span className="text-emerald-400 font-semibold">{progressPercent}% Digested</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500 rounded-full"
                    style={{ width: `${Math.max(6, progressPercent)}%` }}
                  ></div>
                </div>
              </div>

              {/* Micro-climate & Kinetic Telemetry */}
              <div className="grid grid-cols-4 gap-2 mt-3 pt-2.5 border-t border-slate-800/60 text-[11px] font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">PODS</span>
                  <span className="text-slate-200 font-semibold">{lf.active_worm_units} Units</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">SPEED</span>
                  <span className="text-emerald-400 font-semibold">{lf.digestion_rate_kg_day} kg/d</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">REMAINING</span>
                  <span className="text-cyan-300 font-semibold">{lf.days_to_neutralize}d</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">TEMP/RH</span>
                  <span className="text-slate-300">
                    {lf.bioreactor_temp || 27}°C / {lf.bioreactor_humidity || 63}%
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Deploy Reinforcement Modal */}
      {deployModalLandfill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#111822] border border-slate-700 rounded-2xl p-6 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bug className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-slate-100">Deploy Bio-Depot Reinforcement</h3>
              </div>
              <button
                onClick={() => setDeployModalLandfill(null)}
                className="text-slate-400 hover:text-slate-200 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDeploySubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Target Landfill Zone</label>
                <div className="p-2.5 rounded-lg bg-[#0a0e14] border border-slate-800 text-sm font-semibold text-white">
                  {deployModalLandfill.name} ({deployModalLandfill.id})
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Select Bio-Remediation Species</label>
                <select
                  value={selectedSpecies}
                  onChange={(e) => setSelectedSpecies(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#0a0e14] border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Galleria mellonella">
                    Galleria mellonella (Greater Waxworm - 100 kg/day per unit)
                  </option>
                  <option value="Tenebrio molitor">
                    Tenebrio molitor (Yellow Mealworm - 12.5 kg/day per unit)
                  </option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-mono text-slate-400">Number of Pod Units (1 Unit = 50,000 Larvae)</label>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    +{unitsToAdd * 50000} Larvae
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={unitsToAdd}
                    onChange={(e) => setUnitsToAdd(parseInt(e.target.value, 10))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <span className="font-mono text-sm font-bold bg-[#0a0e14] px-3 py-1 rounded border border-slate-700 text-white">
                    {unitsToAdd}
                  </span>
                </div>
              </div>

              {/* Real-time Impact Preview */}
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-xs font-mono space-y-1">
                <div className="text-emerald-300 font-semibold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Deployment Kinetic Impact</span>
                </div>
                <div className="text-slate-300 flex justify-between">
                  <span>Additional Daily Digestion:</span>
                  <span className="text-emerald-400 font-bold">
                    +{(unitsToAdd * currentSpeciesData.nominal_unit_capacity_kg_day).toFixed(1)} kg/day
                  </span>
                </div>
                <div className="text-slate-300 flex justify-between">
                  <span>Projected Clearance Speedup:</span>
                  <span className="text-cyan-400 font-bold">
                    ~{Math.max(1, Math.round((deployModalLandfill.plastic_tonnage * 1000) / ((deployModalLandfill.active_worm_units + unitsToAdd) * currentSpeciesData.nominal_unit_capacity_kg_day)))} days
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeployModalLandfill(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDeploying}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-900/40 transition-all flex items-center gap-2"
                >
                  {isDeploying ? (
                    <span>Deploying Pods...</span>
                  ) : (
                    <>
                      <Bug className="w-4 h-4" />
                      <span>Confirm & Dispatch Pods</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
