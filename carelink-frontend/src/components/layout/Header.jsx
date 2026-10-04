import React, { useState } from 'react';
import { Bell, Menu, Search, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Header({ title, onMenuToggle }) {
  const { activeAlerts, unreadAlertCount, acknowledgeAlert } = useApp();
  const { user } = useAuth();
  const [showAlertDropdown, setShowAlertDropdown] = useState(false);

  return (
    <header className="h-16 bg-bgCard/90 backdrop-blur-md border-b border-borderColor sticky top-0 z-30 flex items-center justify-between px-6">
      {/* Mobile Menu Button + Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-lg text-textSecondary hover:text-textPrimary hover:bg-bgElevated"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-textPrimary tracking-tight">{title}</h1>
      </div>

      {/* Right Action Icons: Active Alerts & Avatar */}
      <div className="flex items-center gap-3">
        {/* Alert Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAlertDropdown(!showAlertDropdown)}
            className="p-2 rounded-lg text-textSecondary hover:text-textPrimary hover:bg-bgElevated relative transition-colors"
            title="System Care Gap Alerts"
          >
            <Bell className="w-5 h-5" />
            {unreadAlertCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-danger animate-ping" />
            )}
            {unreadAlertCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-danger" />
            )}
          </button>

          {/* Alert Dropdown Panel */}
          {showAlertDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-bgCard border border-borderColor rounded-xl shadow-2xl z-50 p-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-borderColor">
                <span className="text-xs font-bold uppercase tracking-wider text-textPrimary">
                  Care Gap Alerts ({activeAlerts.length})
                </span>
                <Link
                  to="/dashboard"
                  onClick={() => setShowAlertDropdown(false)}
                  className="text-xs font-semibold text-accentTeal hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="mt-2 space-y-2 max-h-72 overflow-y-auto pr-1">
                {activeAlerts.length === 0 ? (
                  <p className="text-xs text-textSecondary py-4 text-center">
                    No active care gaps or alerts.
                  </p>
                ) : (
                  activeAlerts.slice(0, 5).map((alert) => (
                    <div
                      key={alert._id}
                      className={`p-2.5 rounded-lg border text-xs ${
                        alert.severity === 'critical'
                          ? 'bg-dangerDim border-danger/30 text-danger'
                          : 'bg-bgElevated border-borderColor text-textSecondary'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-danger" />
                        <div className="flex-1">
                          <p className="font-medium text-textPrimary leading-snug">{alert.message}</p>
                          <div className="mt-1.5 flex items-center justify-between">
                            <span className="text-[10px] text-textSecondary">
                              {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {alert.status === 'active' && (
                              <button
                                onClick={() => acknowledgeAlert(alert._id)}
                                className="text-[10px] font-semibold text-accentTeal hover:underline"
                              >
                                Acknowledge
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        {user && (
          <div className="flex items-center gap-2 pl-3 border-l border-borderColor">
            <div className="w-7 h-7 rounded-full bg-accentTealDim text-accentTeal font-bold text-xs flex items-center justify-center border border-accentTeal/30">
              {user.name ? user.name[0] : 'U'}
            </div>
            <span className="hidden sm:inline text-xs font-medium text-textSecondary truncate max-w-[120px]">
              {user.name}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
