import React, { useState } from 'react';

export default function Input({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  icon: Icon,
  required = false,
  className = '',
  id,
  name,
  disabled = false,
  rightElement,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  let borderCol = 'var(--border-color)';
  let boxShad = 'none';

  if (error) {
    borderCol = 'var(--danger)';
    if (isFocused) {
      boxShad = '0 0 0 3px rgba(255, 71, 87, 0.1)';
    }
  } else if (isFocused) {
    borderCol = 'var(--accent-teal)';
    boxShad = '0 0 0 3px rgba(0, 191, 166, 0.1)';
  }

  return (
    <div className={`w-full ${className}`} style={{ marginBottom: '16px' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            display: 'block',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: 'var(--text-secondary)',
            marginBottom: '6px',
            fontWeight: 600,
          }}
        >
          {label}
          {required && <span style={{ color: 'var(--danger)', marginLeft: '4px' }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
        {Icon && (
          <div
            style={{
              position: 'absolute',
              left: '14px',
              pointerEvents: 'none',
              color: isFocused ? 'var(--accent-teal)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 200ms ease-in-out',
            }}
          >
            {React.isValidElement(Icon) ? Icon : <Icon size={18} />}
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            background: 'var(--bg-elevated)',
            border: `1px solid ${borderCol}`,
            borderRadius: 'var(--radius-btn)', // 8px
            padding: '12px 16px',
            paddingLeft: Icon ? '40px' : '16px',
            paddingRight: rightElement ? '44px' : '16px',
            color: 'var(--text-primary)',
            fontSize: '14px',
            width: '100%',
            outline: 'none',
            boxShadow: boxShad,
            transition: 'all 200ms ease-in-out',
            fontFamily: "'Inter', sans-serif",
            opacity: disabled ? 0.6 : 1,
          }}
          {...props}
        />

        {rightElement && (
          <div
            style={{
              position: 'absolute',
              right: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p
          style={{
            fontSize: '12px',
            color: 'var(--danger)',
            marginTop: '6px',
            fontWeight: 500,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
