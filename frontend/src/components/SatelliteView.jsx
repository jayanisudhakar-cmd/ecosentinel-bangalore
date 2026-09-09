import React, { useState } from 'react';
import { 
  Eye, 
  Layers, 
  MapPin, 
  Scan, 
  AlertCircle, 
  CheckCircle2, 
  Maximize2, 
  Compass, 
  Crosshair,
  ShieldAlert,
  Flame,
  Bug
} from 'lucide-react';

export default function SatelliteView({ 
  scanData, 
  landfills = [], 
  onSelectLandfill, 
  selectedLandfill, 
  onOpenDeployModal,
  isScanning 
}) {
  const [viewMode, setViewMode] = useState('annotated'); // 'annotated' | 'hsv_mask' | 'raw_aerial'
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Available images from backend CV detector
  const images = scanData?.images || {};
  const currentImageSrc = images[viewMode] || images.annotated;

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'SEVERE':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'MODERATE':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="bg-[#111822] rounded-xl border border-slate-800 p-5 shadow-xl flex flex-col h-full">
      
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Scan className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-semibold text-slate-100 tracking-wide">
              Double Road Satellite Geospatial Grid
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time HSV Anomaly Detection • Ground Sampling Distance: 0.25m/px
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-[#0a0e14] p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setViewMode('annotated')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              viewMode === 'annotated'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Annotated CV</span>
          </button>

          <button
            onClick={() => setViewMode('hsv_mask')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              viewMode === 'hsv_mask'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>HSV Mask</span>
          </button>

          <button
            onClick={() => setViewMode('raw_aerial')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              viewMode === 'raw_aerial'
                ? 'bg-slate-800 text-slate-200 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Raw Aerial</span>
          </button>
        </div>
      </div>

      {/* Main Map / Canvas Frame */}
      <div className="relative mt-4 flex-1 min-h-[380px] lg:min-h-[440px] bg-[#090d13] rounded-lg border border-slate-800/90 overflow-hidden flex items-center justify-center group">
        
        {/* Radar Sweep Animation (Active when scanning) */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full radar-sweep-line animate-radar-sweep"></div>
            <div className="absolute inset-0 bg-cyan-500/5 animate-pulse"></div>
            <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-500/50 text-cyan-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>SYNCHRONIZING SPECTRAL SENSORS (HSV)...</span>
            </div>
          </div>
        )}

        {/* Satellite Imagery Frame */}
        {currentImageSrc ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={currentImageSrc}
              alt="Satellite Feed Double Road"
              className="w-full h-full object-cover max-h-[500px]"
            />

            {/* Interactive Overlay Hotspots on Map for Landfills */}
            <div className="absolute inset-0 pointer-events-auto">
              {landfills.map((lf) => {
                // Approximate positions based on geographic anchor offsets
                // Normalized to 800x800 coordinate scale
                const isSelected = selectedLandfill?.id === lf.id;
                const coords = {
                  'LANDFILL-SN-001': { left: '52%', top: '56%' }, // BMTC Depot
                  'LANDFILL-SN-002': { left: '40%', top: '31%' }, // Double Road Flyover
                  'LANDFILL-SN-003': { left: '81%', top: '40%' }, // Akkithimmanahalli SWD
                  'LANDFILL-SN-004': { left: '54%', top: '87%' }, // Wilson Garden
                  'LANDFILL-SN-005': { left: '19%', top: '72%' }, // Lalbagh Verge
                }[lf.id] || { left: '50%', top: '50%' };

                return (
                  <div
                    key={lf.id}
                    style={{ left: coords.left, top: coords.top }}
                    onClick={() => onSelectLandfill(lf)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-transform hover:scale-125"
                  >
                    <div className="relative flex items-center justify-center">
                      {/* Pulse Ring */}
                      <span className={`absolute inline-flex h-8 w-8 rounded-full opacity-60 animate-ping ${
                        lf.severity === 'CRITICAL' ? 'bg-red-500' : lf.severity === 'SEVERE' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}></span>

                      {/* Hotspot Target Pin */}
                      <div className={`relative flex items-center justify-center w-7 h-7 rounded-full border-2 shadow-lg backdrop-blur-sm transition-all ${
                        isSelected 
                          ? 'bg-cyan-500 border-white ring-4 ring-cyan-500/40 scale-110' 
                          : lf.severity === 'CRITICAL'
                            ? 'bg-red-600/90 border-red-300'
                            : lf.severity === 'SEVERE'
                              ? 'bg-amber-600/90 border-amber-300'
                              : 'bg-emerald-600/90 border-emerald-300'
                      }`}>
                        <Crosshair className="w-4 h-4 text-white" />
                      </div>

                      {/* Floating Tooltip / Label */}
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 text-[11px] font-mono px-2 py-0.5 rounded border border-slate-700 text-slate-200 pointer-events-none shadow-md hidden sm:block">
                        {lf.plastic_tonnage}t • {lf.name.split(' ')[0]}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center p-8">
            <Scan className="w-10 h-10 text-slate-600 mx-auto animate-pulse" />
            <p className="text-slate-400 text-sm mt-3 font-mono">
              Awaiting satellite telemetry link...
            </p>
          </div>
        )}

        {/* GIS HUD Overlays: Grid Coordinate Reference */}
        <div className="absolute bottom-2 left-2 bg-[#0d131b]/90 backdrop-blur-md px-3 py-1.5 rounded border border-slate-800 text-[11px] font-mono text-slate-400 pointer-events-none flex items-center gap-3">
          <span className="flex items-center gap-1 text-cyan-400">
            <Crosshair className="w-3.5 h-3.5" />
            <span>GEO-REF: 12.9550°N, 77.5930°E</span>
          </span>
          <span className="text-slate-600">|</span>
          <span>ELEV: 914m ASL</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400">GSD: 0.25m/px</span>
        </div>

        {/* Legend */}
        <div className="absolute top-2 right-2 bg-[#0d131b]/90 backdrop-blur-md p-2 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 pointer-events-none space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span>Critical Anomaly (&gt;3.0t)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Severe Anomaly (&gt;1.5t)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Bio-Remediation Active</span>
          </div>
        </div>
      </div>

      {/* Selected Landfill Detailed Drawer */}
      {selectedLandfill && (
        <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border font-semibold ${getSeverityBadge(selectedLandfill.severity)}`}>
                  {selectedLandfill.severity}
                </span>
                <span className="font-mono text-xs text-slate-400">
                  {selectedLandfill.id}
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-emerald-400 font-medium">
                  {selectedLandfill.ward}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-100">
                {selectedLandfill.name}
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{selectedLandfill.location}</span>
                <span className="text-slate-600 font-mono">({selectedLandfill.latitude.toFixed(4)}°N, {selectedLandfill.longitude.toFixed(4)}°E)</span>
              </p>
            </div>

            {/* Quick Metrics & Deploy Action */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-[#0a0e14] px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
                <span className="text-slate-400 block text-[10px]">PLASTIC MASS</span>
                <span className="text-white font-bold text-sm">{selectedLandfill.plastic_tonnage}t</span>
              </div>

              <div className="bg-[#0a0e14] px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
                <span className="text-slate-400 block text-[10px]">BIO-DEPOT UNITS</span>
                <span className="text-emerald-400 font-bold text-sm">
                  {selectedLandfill.active_worm_units} Pods
                </span>
              </div>

              <div className="bg-[#0a0e14] px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
                <span className="text-slate-400 block text-[10px]">RATE</span>
                <span className="text-cyan-400 font-bold text-sm">
                  {selectedLandfill.digestion_rate_kg_day} kg/d
                </span>
              </div>

              <button
                onClick={() => onOpenDeployModal(selectedLandfill)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-900/30 transition-all active:scale-95"
              >
                <Bug className="w-3.5 h-3.5" />
                <span>Deploy Worms</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
