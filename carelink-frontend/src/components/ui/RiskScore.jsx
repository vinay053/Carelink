import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import Badge from './Badge';

export default function RiskScore({
  score = 0,
  level = 'low',
  factors = [],
  recommendedAction,
  showFactors = true,
}) {
  const targetScore = Math.min(100, Math.max(0, Number(score) || 0));
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate from 0 to targetScore over 1.5s using requestAnimationFrame
  useEffect(() => {
    let startTimestamp = null;
    let animationFrameId = null;
    const duration = 1500; // 1.5 seconds

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutCubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(easeProgress * targetScore));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [targetScore]);

  // Calculations for semicircle gauge
  // Semicircle with radius 80, strokeWidth 14
  // Path from (20, 100) to (180, 100)
  const radius = 80;
  const strokeWidth = 12;
  const circumference = Math.PI * radius; // ~251.3
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  let gaugeColor = 'var(--success)';
  let riskBadgeVariant = 'success';
  const effectiveLevel = level?.toLowerCase() || (targetScore >= 70 ? 'high' : targetScore >= 40 ? 'medium' : 'low');

  if (effectiveLevel === 'high' || targetScore >= 70) {
    gaugeColor = 'var(--danger)';
    riskBadgeVariant = 'danger';
  } else if (effectiveLevel === 'medium' || targetScore >= 40) {
    gaugeColor = 'var(--warning)';
    riskBadgeVariant = 'warning';
  }

  const defaultFactors = factors && factors.length > 0 ? factors : [
    { factor: 'Clinical Specialty Wait Time', points: Math.round(targetScore * 0.35) },
    { factor: 'Facility Distance & Load', points: Math.round(targetScore * 0.25) },
    { factor: 'Diagnostic Dependencies', points: Math.round(targetScore * 0.25) },
    { factor: 'Patient Demographic Risk', points: Math.round(targetScore * 0.15) },
  ];

  const defaultAction = recommendedAction || (
    effectiveLevel === 'high'
      ? 'Assign dedicated care coordinator, dispatch automated SMS escalation, and confirm priority specialist slot within 24 hours.'
      : effectiveLevel === 'medium'
      ? 'Schedule automated patient reminders via CareBot and monitor diagnostic completion SLA.'
      : 'Standard automated referral tracking with standard 7-day follow-up checks.'
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* Semicircle Gauge Area */}
      <div style={{ position: 'relative', width: '220px', height: '125px', display: 'flex', justifyContent: 'center' }}>
        <svg
          width="220"
          height="125"
          viewBox="0 0 220 125"
          style={{ overflow: 'visible' }}
        >
          {/* Background Track */}
          <path
            d="M 20 110 A 80 80 0 0 1 200 110"
            fill="none"
            stroke="var(--bg-elevated)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Animated Value Stroke */}
          <path
            d="M 20 110 A 80 80 0 0 1 200 110"
            fill="none"
            stroke={gaugeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 80ms linear' }}
          />
        </svg>

        {/* Score Number in Center: 48px 700 */}
        <div
          style={{
            position: 'absolute',
            bottom: '4px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: '48px',
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1,
              letterSpacing: '-1px',
            }}
          >
            {animatedScore}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
            out of 100
          </span>
        </div>
      </div>

      {/* Risk Level Badge Below */}
      <div style={{ marginTop: '12px', marginBottom: '20px' }}>
        <Badge
          text={`${effectiveLevel.toUpperCase()} RISK`}
          variant={riskBadgeVariant}
        />
      </div>

      {showFactors && (
        <>
          {/* Factors Table */}
          <div style={{ width: '100%', marginBottom: '20px' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '13px',
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    fontSize: '11px',
                    letterSpacing: '0.5px',
                    textAlign: 'left',
                  }}
                >
                  <th style={{ padding: '8px 4px' }}>Factor</th>
                  <th style={{ padding: '8px 4px', width: '60px', textAlign: 'center' }}>Points</th>
                  <th style={{ padding: '8px 4px', width: '100px' }}>Impact</th>
                </tr>
              </thead>
              <tbody>
                {defaultFactors.map((f, idx) => {
                  const points = typeof f.points === 'number' ? f.points : (f.score || 0);
                  const maxPoints = 20;
                  const pct = Math.min(100, Math.round((points / maxPoints) * 100));

                  return (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <td style={{ padding: '10px 4px', fontWeight: 500 }}>
                        {f.factor || f.name || f.description || `Factor ${idx + 1}`}
                      </td>
                      <td style={{ padding: '10px 4px', textAlign: 'center', fontWeight: 600, color: 'var(--accent-teal)' }}>
                        +{points}
                      </td>
                      <td style={{ padding: '10px 4px' }}>
                        <div
                          style={{
                            height: '6px',
                            width: '100%',
                            backgroundColor: 'var(--bg-elevated)',
                            borderRadius: '3px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${pct}%`,
                              backgroundColor: pct >= 70 ? 'var(--danger)' : pct >= 40 ? 'var(--warning)' : 'var(--accent-teal)',
                              borderRadius: '3px',
                              transition: 'width 1s ease-out',
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Recommended Action: bordered box with info icon and teal left border */}
          <div
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-color)',
              borderLeft: '4px solid var(--accent-teal)',
              borderRadius: '8px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}
          >
            <div style={{ color: 'var(--accent-teal)', marginTop: '2px', flexShrink: 0 }}>
              <Info size={18} />
            </div>
            <div>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--accent-teal)', fontWeight: 600, margin: '0 0 4px 0', letterSpacing: '0.5px' }}>
                Recommended Clinical Action
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
                {defaultAction}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
