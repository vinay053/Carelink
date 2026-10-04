import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import {
  LayoutDashboard,
  GitBranch,
  Users,
  Bot,
  MoreHorizontal,
  FlaskConical,
  Pill,
  MapPin,
  BarChart3,
  Settings,
  X,
} from 'lucide-react';

export default function PageContainer({ children, className = '' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const navigate = useNavigate();

  // Page transition effect (opacity 0 to 1 over 0.2s)
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(1);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  const moreNavItems = [
    { name: 'Diagnostics', path: '/diagnostics', icon: FlaskConical },
    { name: 'Medications', path: '/medications', icon: Pill },
    { name: 'Hospital Map', path: '/hospitals', icon: MapPin },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        position: 'relative',
      }}
    >
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Container */}
      <main
        style={{
          minHeight: '100vh',
          paddingTop: '64px',
          paddingBottom: '72px', // space for mobile nav
          transition: 'all 200ms ease-in-out',
        }}
        className="ml-0 md:ml-[240px] md:pb-0"
      >
        <div
          style={{
            padding: '32px',
            opacity,
            transition: 'opacity 200ms ease-in-out',
          }}
          className={`p-4 md:p-8 ${className}`}
        >
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar (below 768px) */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '64px',
          backgroundColor: 'var(--bg-card)',
          borderTop: '1px solid var(--border-color)',
          zIndex: 900,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 8px',
        }}
        className="flex md:hidden"
      >
        <NavLink
          to="/dashboard"
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            fontSize: '11px',
            color: isActive ? 'var(--accent-teal)' : 'var(--text-secondary)',
            textDecoration: 'none',
            padding: '4px 8px',
          })}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/referrals"
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            fontSize: '11px',
            color: isActive ? 'var(--accent-teal)' : 'var(--text-secondary)',
            textDecoration: 'none',
            padding: '4px 8px',
          })}
        >
          <GitBranch size={20} />
          <span>Referrals</span>
        </NavLink>

        <NavLink
          to="/patients"
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            fontSize: '11px',
            color: isActive ? 'var(--accent-teal)' : 'var(--text-secondary)',
            textDecoration: 'none',
            padding: '4px 8px',
          })}
        >
          <Users size={20} />
          <span>Patients</span>
        </NavLink>

        <NavLink
          to="/carebot"
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            fontSize: '11px',
            color: isActive ? 'var(--accent-teal)' : 'var(--text-secondary)',
            textDecoration: 'none',
            padding: '4px 8px',
          })}
        >
          <Bot size={20} />
          <span>CareBot</span>
        </NavLink>

        <button
          type="button"
          onClick={() => setMoreDrawerOpen(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            fontSize: '11px',
            color: moreDrawerOpen ? 'var(--accent-teal)' : 'var(--text-secondary)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          <MoreHorizontal size={20} />
          <span>More</span>
        </button>
      </nav>

      {/* Slide-Up Drawer for 'More' */}
      {moreDrawerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
          onClick={() => setMoreDrawerOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderTop: '1px solid var(--border-color)',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              padding: '24px',
              maxHeight: '60vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                Additional Services
              </h3>
              <button
                type="button"
                onClick={() => setMoreDrawerOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {moreNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => {
                      setMoreDrawerOpen(false);
                      navigate(item.path);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 200ms',
                    }}
                  >
                    <Icon size={20} color="var(--accent-teal)" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
