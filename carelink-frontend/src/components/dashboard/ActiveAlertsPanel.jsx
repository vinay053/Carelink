import React from 'react';
import { AlertTriangle, Clock, CheckCircle2, Eye, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';

export default function ActiveAlertsPanel() {
  const { activeAlerts, acknowledgeAlert, resolveAlert } = useApp();

  if (activeAlerts.length === 0) {
    return (
      <div className="p-8 text-center bg-bgCard border border-borderColor rounded-xl">
        <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2 opacity-80" />
        <p className="text-xs font-semibold text-textPrimary">All Care Gaps Resolved</p>
        <p className="text-[11px] text-textSecondary mt-0.5">Continuous handoff monitoring active.</p>
      </div>
    );
  }

  const getBorderColor = (severity) => {
    switch (severity) {
      case 'critical': return 'border-l-4 border-l-danger border-borderColor bg-dangerDim';
      case 'high': return 'border-l-4 border-l-danger/80 border-borderColor bg-bgCard';
      case 'medium': return 'border-l-4 border-l-warning border-borderColor bg-bgCard';
      default: return 'border-l-4 border-l-blue-400 border-borderColor bg-bgCard';
    }
  };

  return (
    <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
      {activeAlerts.map((alert) => (
        <div
          key={alert._id}
          className={`p-3.5 rounded-xl border text-xs transition-all duration-150 ${getBorderColor(alert.severity)}`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wider">
              {alert.severity === 'critical' ? (
                <ShieldAlert className="w-3.5 h-3.5 text-danger animate-pulse" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-warning" />
              )}
              <span className={alert.severity === 'critical' || alert.severity === 'high' ? 'text-danger' : 'text-warning'}>
                {alert.severity} • {alert.type.replace('_', ' ')}
              </span>
            </div>
            <span className="text-[10px] text-textSecondary flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <p className="mt-2 text-textPrimary font-medium leading-relaxed">
            {alert.message}
          </p>

          <div className="mt-3 pt-2 border-t border-borderColor/60 flex items-center justify-between">
            {alert.patientId ? (
              <Link
                to={`/patients/${alert.patientId._id || alert.patientId}/timeline`}
                className="text-[11px] font-semibold text-accentTeal hover:underline truncate max-w-[150px]"
              >
                {alert.patientId.name || 'View Patient'}
              </Link>
            ) : (
              <span className="text-[11px] text-textSecondary">System Alert</span>
            )}

            <div className="flex items-center gap-2">
              {alert.status === 'active' && (
                <button
                  onClick={() => acknowledgeAlert(alert._id)}
                  className="px-2 py-1 rounded bg-bgElevated hover:bg-bgElevated/80 text-[10px] font-semibold text-textSecondary hover:text-textPrimary border border-borderColor transition-colors"
                >
                  Acknowledge
                </button>
              )}
              <button
                onClick={() => resolveAlert(alert._id)}
                className="px-2 py-1 rounded bg-successDim hover:bg-success/20 text-[10px] font-bold text-success border border-success/30 transition-colors"
              >
                Resolve Gap
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
