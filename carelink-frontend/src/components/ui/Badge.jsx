import React from 'react';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) {
  const variants = {
    default: 'bg-bgElevated text-textSecondary border-borderColor',
    teal: 'bg-accentTealDim text-accentTeal border-accentTeal/30',
    success: 'bg-successDim text-success border-success/30',
    warning: 'bg-warningDim text-warning border-warning/30',
    danger: 'bg-dangerDim text-danger border-danger/30',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 font-semibold'
  };

  return (
    <span className={`inline-flex items-center rounded-full border ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}>
      {children}
    </span>
  );
}
