import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  GitPullRequest,
  Users,
  TestTube2,
  Pill,
  Building2,
  Bot,
  BarChart3,
  Settings,
  LogOut,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, logout } = useAuth();
  const { unreadAlertCount } = useApp();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Referrals', path: '/referrals', icon: GitPullRequest },
    { name: 'Patients', path: '/patients', icon: Users },
    { name: 'Diagnostics', path: '/diagnostics', icon: TestTube2 },
    { name: 'Medications', path: '/medications', icon: Pill },
    { name: 'Hospital Map', path: '/hospitals', icon: Building2 },
    { name: 'CareBot AI', path: '/carebot', icon: Bot },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen w-64 bg-bgCard border-r border-borderColor flex flex-col transition-transform duration-300 md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-borderColor justify-between">
        <NavLink to="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accentTeal/10 border border-accentTeal/30 flex items-center justify-center text-accentTeal">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-textPrimary">
              Care<span className="text-accentTeal">Link</span>
            </span>
            <span className="text-[9px] block uppercase font-bold tracking-widest text-textSecondary -mt-1">
              Continuity AI
            </span>
          </div>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen && setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-accentTeal text-bgPrimary font-semibold shadow-md shadow-accentTeal/20'
                    : 'text-textSecondary hover:text-textPrimary hover:bg-bgElevated'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.name}</span>
              </div>
              {item.name === 'Referrals' && unreadAlertCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-danger text-white">
                  {unreadAlertCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer Profile & Logout */}
      {user && (
        <div className="p-4 border-t border-borderColor bg-bgElevated/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-bgElevated border border-accentTeal/30 flex items-center justify-center text-accentTeal font-bold text-xs uppercase flex-shrink-0">
                {user.name ? user.name.slice(0, 2) : 'CL'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-textPrimary truncate">{user.name}</p>
                <p className="text-[11px] text-accentTeal capitalize font-medium truncate">{user.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-textSecondary hover:text-danger hover:bg-bgElevated transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
