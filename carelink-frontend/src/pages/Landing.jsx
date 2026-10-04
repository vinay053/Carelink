import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, GitBranch, TrendingUp, Bot } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Fixed Navbar at top with height 64px, padding 0 48px */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '64px',
          padding: '0 48px',
          backgroundColor: 'rgba(13, 27, 42, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 1000,
        }}
        className="px-4 md:px-12"
      >
        {/* Left: CareLink Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              position: 'relative',
              width: '12px',
              height: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-teal)',
                opacity: 0.75,
              }}
              className="animate-ping"
            />
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-teal)',
              }}
            />
          </div>
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.5px' }}>
            CARE
          </span>
          <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent-teal)', letterSpacing: '-0.5px' }}>
            LINK
          </span>
        </div>

        {/* Center: nav links Features, How It Works, Contact */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
          }}
          className="hidden md:flex"
        >
          {['Features', 'How It Works', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color 200ms ease-in-out',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-teal)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Right: Login button secondary style and Get Started button primary style */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button variant="secondary" size="sm" onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section below navbar, min-height calc(100vh - 64px) */}
      <section
        style={{
          paddingTop: '64px',
          minHeight: 'calc(100vh - 64px)',
          display: 'grid',
          alignItems: 'center',
        }}
        className="grid grid-cols-1 md:grid-cols-2 p-6 md:p-12 gap-12"
      >
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          {/* Badge: AI-Powered Healthcare Coordination */}
          <div
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              backgroundColor: 'var(--accent-teal-dim)',
              color: 'var(--accent-teal)',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '24px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>✦</span> AI-Powered Healthcare Coordination
          </div>

          {/* Headline in 52px 800 weight line-height 1.1 white */}
          <h1
            style={{
              fontSize: 'clamp(36px, 5vw, 52px)',
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#FFFFFF',
              letterSpacing: '-1px',
              marginBottom: '20px',
            }}
          >
            Healthcare doesn't fail only inside hospitals<br />It fails between them.
          </h1>

          {/* Subtext in 18px 400 var(--text-secondary) */}
          <p
            style={{
              fontSize: '18px',
              fontWeight: 400,
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '32px',
              maxWidth: '560px',
            }}
          >
            CareLink is the AI coordination layer that tracks every patient journey and detects care gaps before they become harm.
          </p>

          {/* Two buttons side by side with 16px gap */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/register')}
              icon={<ArrowRight size={18} />}
            >
              Get Started
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else navigate('/login');
              }}
            >
              See How It Works
            </Button>
          </div>
        </div>

        {/* Right Column: Dark card with 2px teal border, 12px border-radius, 24px padding */}
        <div>
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '2px solid var(--accent-teal)',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: 'var(--shadow-hover)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-teal)' }} />
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF' }}>
                  Live Referral Intelligence Feed
                </span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--accent-teal)', fontWeight: 600, textTransform: 'uppercase' }}>
                Real-Time Tracking
              </span>
            </div>

            {/* Three fake referral rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Row 1: Red CARE GAP badge */}
              <div
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderRadius: '8px',
                  padding: '16px',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF' }}>
                      Rameshwar Sen (ABHA: 91-8842-1002)
                    </span>
                    <div style={{ marginTop: '4px' }}>
                      <Badge text="Cardiology" variant="info" />
                    </div>
                  </div>
                  <Badge text="CARE GAP" variant="danger" />
                </div>
                <div style={{ marginTop: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    <span>Stage: Appointment Booked (Stage 3/7)</span>
                    <span style={{ color: 'var(--danger)', fontWeight: 600 }}>Stalled &gt; 48h</span>
                  </div>
                  <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--bg-card)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '42%', backgroundColor: 'var(--accent-teal)', borderRadius: '3px' }} />
                  </div>
                </div>
              </div>

              {/* Row 2: HIGH RISK badge */}
              <div
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderRadius: '8px',
                  padding: '16px',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF' }}>
                      Geeta Bai (ABHA: 44-9921-5501)
                    </span>
                    <div style={{ marginTop: '4px' }}>
                      <Badge text="Neurology" variant="info" />
                    </div>
                  </div>
                  <Badge text="HIGH RISK" variant="warning" />
                </div>
                <div style={{ marginTop: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    <span>Stage: Consulted (Stage 5/7)</span>
                    <span>Score: 84/100</span>
                  </div>
                  <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--bg-card)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '71%', backgroundColor: 'var(--accent-teal)', borderRadius: '3px' }} />
                  </div>
                </div>
              </div>

              {/* Row 3: Follow-up Done / On Track */}
              <div
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderRadius: '8px',
                  padding: '16px',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF' }}>
                      Ankit Verma (ABHA: 22-1092-8831)
                    </span>
                    <div style={{ marginTop: '4px' }}>
                      <Badge text="Orthopedics" variant="info" />
                    </div>
                  </div>
                  <Badge text="ON TRACK" variant="success" />
                </div>
                <div style={{ marginTop: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    <span>Stage: Follow-up Done (Stage 7/7)</span>
                    <span style={{ color: 'var(--success)' }}>Complete</span>
                  </div>
                  <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--bg-card)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '100%', backgroundColor: 'var(--success)', borderRadius: '3px' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Row with three equal cards in a 48px padded container */}
      <section
        id="features"
        style={{
          padding: '48px',
          borderTop: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Referral Intelligence */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '28px',
              transition: 'transform 200ms ease-in-out',
            }}
          >
            <div style={{ color: 'var(--accent-teal)', marginBottom: '16px' }}>
              <GitBranch size={32} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px' }}>
              Referral Intelligence
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Track every stage from created to follow-up done. Eliminate blind handoffs between primary care and apex medical colleges.
            </p>
          </div>

          {/* Card 2: AI Risk Scoring */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '28px',
              transition: 'transform 200ms ease-in-out',
            }}
          >
            <div style={{ color: 'var(--accent-teal)', marginBottom: '16px' }}>
              <TrendingUp size={32} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px' }}>
              AI Risk Scoring
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Know which referrals will fail before they do. Dynamic Bayesian risk engine analyzes distance, capacity, and historical attendance.
            </p>
          </div>

          {/* Card 3: CareBot AI */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '28px',
              transition: 'transform 200ms ease-in-out',
            }}
          >
            <div style={{ color: 'var(--accent-teal)', marginBottom: '16px' }}>
              <Bot size={32} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px' }}>
              CareBot AI
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Proactive alerts without being asked. Stream longitudinal timelines, cross-reference drug interactions, and triage urgent lab delays.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Strip with four stats in a row, centered, 80px padding vertical */}
      <section
        id="how-it-works"
        style={{
          padding: '80px 48px',
          textAlign: 'center',
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--accent-teal)', lineHeight: 1 }}>
              40%
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Referral Dropout Reduction
            </div>
          </div>

          <div>
            <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--accent-teal)', lineHeight: 1 }}>
              8x
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Faster Result Review
            </div>
          </div>

          <div>
            <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--accent-teal)', lineHeight: 1 }}>
              100%
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Drug Conflicts Flagged
            </div>
          </div>

          <div>
            <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--accent-teal)', lineHeight: 1 }}>
              0
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Blind Referrals
            </div>
          </div>
        </div>
      </section>

      {/* Footer: dark var bg-card background, 40px padding, CareLink logo left, copyright right */}
      <footer
        id="contact"
        style={{
          backgroundColor: 'var(--bg-card)',
          padding: '40px 48px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
        className="px-6 md:px-12"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>CARE</span>
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-teal)' }}>LINK</span>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '8px' }}>
            National Clinical Handshake & Referral Continuity Protocol
          </span>
        </div>

        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          © 2026 CareLink Systems Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
