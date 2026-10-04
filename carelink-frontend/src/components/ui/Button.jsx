import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
  icon: Icon,
  type = 'button',
  className = '',
  ...props
}) {
  // Variant styles
  let variantStyle = {};
  if (variant === 'primary') {
    variantStyle = {
      backgroundColor: 'var(--accent-teal)',
      color: '#FFFFFF',
      border: 'none',
    };
  } else if (variant === 'secondary') {
    variantStyle = {
      backgroundColor: 'transparent',
      color: 'var(--accent-teal)',
      border: '1px solid var(--accent-teal)',
    };
  } else if (variant === 'danger') {
    variantStyle = {
      backgroundColor: 'var(--danger)',
      color: '#FFFFFF',
      border: 'none',
    };
  } else if (variant === 'ghost') {
    variantStyle = {
      backgroundColor: 'transparent',
      color: 'var(--text-secondary)',
      border: 'none',
    };
  }

  // Size styles
  let sizeStyle = {};
  let iconSize = 16;
  if (size === 'sm') {
    sizeStyle = { padding: '6px 12px', fontSize: '12px' };
    iconSize = 14;
  } else if (size === 'lg') {
    sizeStyle = { padding: '14px 24px', fontSize: '16px' };
    iconSize = 20;
  } else {
    // md
    sizeStyle = { padding: '10px 18px', fontSize: '14px' };
    iconSize = 16;
  }

  const baseStyle = {
    borderRadius: 'var(--radius-btn)', // 8px
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    outline: 'none',
    transition: 'all 200ms ease-in-out',
    userSelect: 'none',
    ...variantStyle,
    ...sizeStyle,
  };

  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  let hoverStyle = {};
  if (isHovered && !disabled && !loading) {
    if (variant === 'primary') {
      hoverStyle = { backgroundColor: 'var(--accent-teal-hover)' };
    } else if (variant === 'secondary') {
      hoverStyle = { backgroundColor: 'var(--accent-teal-dim)' };
    } else if (variant === 'ghost') {
      hoverStyle = { color: 'var(--accent-teal)', backgroundColor: 'var(--accent-teal-dim)' };
    } else if (variant === 'danger') {
      hoverStyle = { opacity: 0.9 };
    }
  }

  const activeStyle = isActive && !disabled && !loading ? { transform: 'scale(0.97)' } : {};

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      style={{ ...baseStyle, ...hoverStyle, ...activeStyle }}
      className={className}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin"
          style={{ width: `${iconSize + 2}px`, height: `${iconSize + 2}px` }}
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="30 60"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <>
          {Icon && (React.isValidElement(Icon) ? Icon : <Icon size={iconSize} />)}
          {children}
        </>
      )}
    </button>
  );
}
