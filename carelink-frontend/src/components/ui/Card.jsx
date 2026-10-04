import React from 'react';

export default function Card({
  children,
  className = '',
  hoverEffect = false,
  glow = null, // 'danger' | 'teal' | 'warning'
  onClick,
  ...props
}) {
  const glowClasses = {
    danger: 'border-danger/40 shadow-lg shadow-danger/10',
    teal: 'border-accentTeal/40 shadow-lg shadow-accentTeal/10',
    warning: 'border-warning/40 shadow-lg shadow-warning/10'
  };

  return (
    <div
      onClick={onClick}
      className={`bg-bgCard border border-borderColor rounded-xl p-5 transition-all duration-200 ${
        hoverEffect ? 'hover:-translate-y-0.5 hover:shadow-xl hover:border-borderColor/80 cursor-pointer' : ''
      } ${glow ? glowClasses[glow] : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
