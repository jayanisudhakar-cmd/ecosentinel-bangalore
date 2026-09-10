import React from 'react';
import { 
  ShieldAlert, 
  Send, 
  CheckCircle, 
  Clock, 
  ExternalLink, 
  AlertTriangle,
  FileText,
  UserCheck
} from 'lucide-react';

export default function BBMPAlertFeed({ alerts = [], onResolveAlert }) {
  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'border-l-4 border-l-red-500 bg-red-950/20 text-red-400';
      case 'SEVERE':
        return 'border-l-4 border-l-amber-500 bg-amber-950/20 text-amber-400';
      case 'MODERATE':
        return 'border-l-4 border-l-yellow-500 bg-yellow-950/20 text-yellow-400';
      default:
        return 'border-l-4 border-l-cyan-500 bg-cyan-950/20 text-cyan-400';
    }
  };

  return (
    <div className="bg-[#111822] rounded-xl border border-slate-800 p-5 shadow-xl flex flex-col h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-semibold text-slate-100 tracking-wide">
              BBMP SWM Authority Grievance Stream
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated Webhook Dispatch to Ward 111 (Shanthi Nagar Sub-Division)
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400">
          <Send className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>WEBHOOK: 202 ACCEPTED</span>
        </div>
      </div>

      {/* Alert Stream Feed */}
      <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1 max-h-[440px]">
        {alerts.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-mono text-xs">
            No active municipal violations. System nominal.
          </div>
        ) : (
          alerts.map((alert) => {
            const ticketId = alert.ticket_id || alert.id;
            const isResolved = alert.status === 'RESOLVED';

            return (
              <div
                key={ticketId}
                className={`p-3.5 rounded-lg border border-slate-800/80 bg-[#0a0e14] transition-all hover:border-slate-700 ${getSeverityStyle(
                  alert.severity
                )}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-white tracking-wider">
                        {ticketId}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-black/40 border border-slate-700">
                        {alert.severity}
                      </span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {alert.jurisdiction || alert.ward || 'Ward 111 (Shanthi Nagar)'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 mt-1.5 leading-relaxed">
                      {alert.message}
                    </p>
                  </div>

                  {/* Status / Action Button */}
                  <div className="flex-shrink-0">
                    {isResolved ? (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-[11px] font-mono">
                        <CheckCircle className="w-3 h-3" />
                        <span>RESOLVED</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => onResolveAlert(ticketId)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-[11px] font-mono transition-colors"
                      >
                        Acknowledge
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub-details: Officer in Charge & Delivery target */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/70 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-1.5 truncate max-w-xs">
                    <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="truncate">
                      {alert.officer_assigned || alert.officer_in_charge || 'AEE SWM Shanthi Nagar'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{alert.timestamp?.split('T')[1]?.split('+')[0] || alert.timestamp}</span>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
