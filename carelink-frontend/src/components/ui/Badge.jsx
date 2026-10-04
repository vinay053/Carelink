import React from 'react';

export default function Badge({
  text,
  children,
  variant = 'default',
  className = '',
  onClick,
  style = {},
  ...props
}) {
  let color = 'var(--text-secondary)';
  let backgroundColor = 'var(--bg-elevated)';

  if (variant === 'success') {
    color = 'var(--success)';
    backgroundColor = 'var(--success-dim)';
  } else if (variant === 'warning') {
    color = 'var(--warning)';
    backgroundColor = 'var(--warning-dim)';
  } else if (variant === 'danger') {
    color = 'var(--danger)';
    backgroundColor = 'var(--danger-dim)';
  } else if (variant === 'info') {
    color = 'var(--accent-teal)';
    backgroundColor = 'var(--accent-teal-dim)';
  } else if (variant === 'default') {
    color = 'var(--text-secondary)';
    backgroundColor = 'var(--bg-elevated)';
  }

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
    color,
    backgroundColor,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    userSelect: 'none',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 200ms ease-in-out',
    ...style,
  };

  return (
    <span
      className={className}
      onClick={onClick}
      style={baseStyle}
      {...props}
    >
      {text || children}
    </span>
  );
}
