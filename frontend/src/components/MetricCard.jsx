import React from 'react';

export default function MetricCard({ title, value, unit, change, icon: Icon, color = 'emerald', subtext }) {
  const colorStyles = {
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-950/30',
    },
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      text: 'text-cyan-400',
      glow: 'shadow-cyan-950/30',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      glow: 'shadow-amber-950/30',
    },
    rose: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      text: 'text-rose-400',
      glow: 'shadow-rose-950/30',
    },
  }[color] || {
    bg: 'bg-slate-800/40',
    border: 'border-slate-700/40',
    text: 'text-slate-300',
    glow: '',
  };

  return (
    <div className={`relative overflow-hidden rounded-xl bg-[#111822] border ${colorStyles.border} p-4 shadow-lg ${colorStyles.glow} transition-all duration-300 hover:border-slate-600`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 tracking-wide uppercase">{title}</p>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl lg:text-3xl font-bold font-mono tracking-tight text-white">
              {value}
            </span>
            {unit && <span className="text-xs font-mono font-medium text-slate-400">{unit}</span>}
          </div>
        </div>

        <div className={`p-2.5 rounded-lg ${colorStyles.bg} ${colorStyles.text} border ${colorStyles.border}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      {(subtext || change) && (
        <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800/60 font-mono">
          {subtext && <span className="text-slate-400 truncate">{subtext}</span>}
          {change && (
            <span className={`font-medium ${colorStyles.text}`}>
              {change}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
