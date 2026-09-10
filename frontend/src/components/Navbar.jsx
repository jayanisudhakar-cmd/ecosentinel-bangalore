import React from 'react';
import { Radio, Satellite, RefreshCw, AlertTriangle, ShieldCheck, Bug, Sparkles } from 'lucide-react';

export default function Navbar({ onScan, isScanning, onRefresh, isRefreshing, systemStatus }) {
  const currentTime = new Date().toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <header className="sticky top-0 z-50 bg-[#0d131b]/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Jurisdiction */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-950/40">
            <Radio className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-100 via-emerald-200 to-cyan-400 bg-clip-text text-transparent">
                EcoSentinel Bangalore
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                PROTOTYPE v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span className="text-emerald-400 font-medium">Ward 111 (Shanthi Nagar)</span>
              <span className="text-slate-600">•</span>
              <span>K.H. Double Road Corridor</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400 font-mono text-[11px]">BBMP Autonomous SWM</span>
            </p>
          </div>
        </div>

        {/* Live System Telemetry Badges */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          
          {/* Satellite Sensor Feed Link */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
            <Satellite className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline text-slate-400">FEED:</span>
            <span className="text-cyan-300 font-semibold">CARTOSAT-3</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          </div>

          {/* Larvae Bio-Depot Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
            <Bug className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline text-slate-400">DEPOTS:</span>
            <span className="text-emerald-300 font-semibold">
              {systemStatus?.totals?.total_worm_units || 9} Units Active
            </span>
          </div>

          {/* Time Display */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-400">
            <span>IST</span>
            <span className="text-slate-200 font-medium">{currentTime}</span>
          </div>

          {/* Action: Trigger Satellite CV Scan */}
          <button
            onClick={onScan}
            disabled={isScanning}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-medium text-xs transition-all shadow-md ${
              isScanning
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80 cursor-wait'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/30 active:scale-95'
            }`}
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>Scanning Double Rd...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                <span>Scan Satellite Feed</span>
              </>
            )}
          </button>

          {/* Action: Refresh Data */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh Registry"
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>

      </div>
    </header>
  );
}
