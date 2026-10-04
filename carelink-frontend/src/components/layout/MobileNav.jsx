import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, GitPullRequest, Users, Bot, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function MobileNav() {
  const { unreadAlertCount } = useApp();

  const items = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Referrals', path: '/referrals', icon: GitPullRequest, badge: unreadAlertCount },
    { name: 'Patients', path: '/patients', icon: Users },
    { name: 'CareBot', path: '/carebot', icon: Bot },
    { name: 'Hospitals', path: '/hospitals', icon: Building2 },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-bgCard/95 backdrop-blur-lg border-t border-borderColor z-40 flex items-center justify-around px-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors relative ${
                isActive ? 'text-accentTeal font-bold' : 'text-textSecondary hover:text-textPrimary'
              }`
            }
          >
            <div className="relative">
              <Icon className="w-5 h-5 mb-0.5" />
              {item.badge > 0 && (
                <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-danger text-white text-[9px] flex items-center justify-center font-black">
                  {item.badge}
                </span>
              )}
            </div>
            <span>{item.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
