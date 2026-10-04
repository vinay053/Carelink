import React, { useState } from 'react';

export default function Card({
  children,
  className = '',
  hover = false,
  padding = '24px',
  onClick,
  style = {},
  ...props
}) {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyle = {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-card)', // 12px
    padding: padding,
    boxShadow: 'var(--shadow-card)',
    transition: 'all 200ms ease-in-out',
    ...style,
  };

  const hoverStyle = hover && isHovered ? {
    transform: 'translateY(-2px)',
    boxShadow: 'var(--shadow-hover)',
  } : {};

  return (
    <div
      className={className}
      onClick={onClick}
      onMouseEnter={() => { if (hover) setIsHovered(true); }}
      onMouseLeave={() => { if (hover) setIsHovered(false); }}
      style={{ ...baseStyle, ...hoverStyle }}
      {...props}
    >
      {children}
    </div>
  );
}
