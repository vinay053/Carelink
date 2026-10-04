import React, { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import Skeleton from './Skeleton';

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend, // 'up' | 'down'
  trendValue,
  color = 'teal', // 'teal' | 'danger' | 'warning' | 'success' | etc.
  loading = false,
  className = '',
  onClick,
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Determine color and dim background
  let mainColor = 'var(--accent-teal)';
  let dimBg = 'var(--accent-teal-dim)';

  if (color === 'danger' || color === 'red') {
    mainColor = 'var(--danger)';
    dimBg = 'var(--danger-dim)';
  } else if (color === 'warning' || color === 'amber' || color === 'yellow') {
    mainColor = 'var(--warning)';
    dimBg = 'var(--warning-dim)';
  } else if (color === 'success' || color === 'green') {
    mainColor = 'var(--success)';
    dimBg = 'var(--success-dim)';
  } else if (color === 'info' || color === 'blue') {
    mainColor = 'var(--accent-teal)';
    dimBg = 'var(--accent-teal-dim)';
  }

  const cardStyle = {
    backgroundColor: 'var(--bg-card)',
    padding: '24px',
    borderRadius: 'var(--radius-card)', // 12px
    border: '1px solid var(--border-color)',
    boxShadow: isHovered ? 'var(--shadow-hover)' : 'var(--shadow-card)',
    transform: isHovered ? 'translateY(-2px)' : 'none',
    transition: 'all 200ms ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    cursor: onClick ? 'pointer' : 'default',
  };

  if (loading) {
    return (
      <div style={cardStyle} className={className}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Skeleton width="40px" height="40px" borderRadius="50%" />
        </div>
        <Skeleton width="60%" height="36px" style={{ marginBottom: '8px' }} />
        <Skeleton width="80%" height="16px" />
      </div>
    );
  }

  return (
    <div
      style={cardStyle}
      className={className}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top row: 40px by 40px circle with color-dim background fill */}
      <div style={{ marginBottom: '16px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: dimBg,
            color: mainColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {Icon && (React.isValidElement(Icon) ? Icon : <Icon size={20} color={mainColor} />)}
        </div>
      </div>

      {/* Value: 36px 700 weight white */}
      <div
        style={{
          fontSize: '36px',
          fontWeight: 700,
          color: '#FFFFFF',
          lineHeight: 1.1,
          marginBottom: '6px',
        }}
      >
        {value ?? 0}
      </div>

      {/* Title: 14px var(--text-secondary) */}
      <div
        style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          fontWeight: 500,
        }}
      >
        {title}
      </div>

      {/* Trend if provided */}
      {trend && trendValue && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '8px',
            fontSize: '12px',
            fontWeight: 600,
            color: trend === 'up' ? 'var(--success)' : 'var(--danger)',
          }}
        >
          {trend === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
}
