import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const routeTitles = {
  '/dashboard': 'Dashboard',
  '/patients': 'Patient Management',
  '/referrals': 'Referrals',
  '/referrals/new': 'Create Referral',
  '/diagnostics': 'Diagnostics Tracker',
  '/medications': 'Medication Reconciliation',
  '/hospitals': 'Facility Intelligence',
  '/carebot': 'CareBot Assistant',
  '/analytics': 'Analytics & Reporting',
  '/settings': 'System Settings',
};

export default function Header({ onToggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(0);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const dropdownRef = useRef(null);

  // Dynamic Page Title
  let currentTitle = routeTitles[location.pathname];
  if (!currentTitle) {
    if (location.pathname.startsWith('/referrals/')) currentTitle = 'Referral Detail';
    else if (location.pathname.includes('/timeline')) currentTitle = 'Patient Longitudinal Timeline';
    else currentTitle = 'CareLink Portal';
  }

  // Fetch unread alerts count
  useEffect(() => {
    let isMounted = true;
    const fetchAlerts = async () => {
      try {
        const res = await api.get('/api/alerts');
        const alerts = res.data?.data || res.data || [];
        const unread = alerts.filter((a) => a.status === 'active' || !a.isAcknowledged).length;
        if (isMounted) setUnreadAlertsCount(unread || alerts.length);
      } catch (err) {
        // Fallback default
        if (isMounted) setUnreadAlertsCount(3);
      }
    };
    fetchAlerts();
    return () => { isMounted = false; };
  }, [location.pathname]);

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '64px',
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-color)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
      }}
      className="left-0 md:left-[240px]"
    >
      {/* Left side: hamburger on mobile only, then current page title in 20px 600 white */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          type="button"
          onClick={onToggleSidebar}
          className="md:hidden"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Toggle navigation"
        >
          <Menu size={22} />
        </button>

        <h1
          style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#FFFFFF',
            margin: 0,
            letterSpacing: '-0.3px',
          }}
        >
          {currentTitle}
        </h1>
      </div>

      {/* Right side: search icon button, Bell with red badge, circle avatar button with dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Search icon button */}
        <button
          type="button"
          onClick={() => navigate('/referrals')}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: 'transparent',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 200ms ease-in-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--accent-teal)';
            e.currentTarget.style.borderColor = 'var(--accent-teal)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
          }}
          aria-label="Search"
        >
          <Search size={18} />
        </button>

        {/* Bell icon button with red badge circle */}
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          style={{
            position: 'relative',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: 'transparent',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 200ms ease-in-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--accent-teal)';
            e.currentTarget.style.borderColor = 'var(--accent-teal)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
          }}
          aria-label="Alerts"
        >
          <Bell size={18} />
          {unreadAlertsCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: 'var(--danger)',
                color: '#FFFFFF',
                fontSize: '10px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 0 2px var(--bg-card)',
              }}
            >
              {unreadAlertsCount > 9 ? '9+' : unreadAlertsCount}
            </span>
          )}
        </button>

        {/* Circle avatar button with dropdown menu */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-elevated)',
              border: '2px solid var(--accent-teal)',
              color: 'var(--accent-teal)',
              fontWeight: 700,
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 200ms ease-in-out',
            }}
            aria-label="User profile menu"
          >
            {userInitial}
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '48px',
                right: 0,
                width: '200px',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-card)',
                padding: '6px',
                zIndex: 200,
                animation: 'fadeIn 0.2s ease-in-out',
              }}
            >
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)', marginBottom: '4px' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                  {user?.name || 'CareLink User'}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
                  {user?.email || 'user@carelink.in'}
                </p>
              </div>

              <Link
                to="/settings"
                onClick={() => setDropdownOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  textDecoration: 'none',
                  transition: 'background 200ms',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-card)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <User size={15} color="var(--accent-teal)" />
                <span>Profile</span>
              </Link>

              <Link
                to="/settings"
                onClick={() => setDropdownOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  textDecoration: 'none',
                  transition: 'background 200ms',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-card)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Settings size={15} color="var(--accent-teal)" />
                <span>Settings</span>
              </Link>

              <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '4px 0' }} />

              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  color: 'var(--danger)',
                  fontSize: '13px',
                  fontWeight: 500,
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 200ms',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--danger-dim)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <LogOut size={15} color="var(--danger)" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
