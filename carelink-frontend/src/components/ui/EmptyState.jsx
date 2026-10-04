import React from 'react';
import Button from './Button';

export default function EmptyState({
  icon: Icon,
  title = 'No items found',
  description,
  actionText,
  onAction,
  actionIcon,
  className = '',
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
      }}
      className={className}
    >
      {Icon && (
        <div style={{ marginBottom: '16px', color: 'var(--accent-teal)' }}>
          {React.isValidElement(Icon) ? Icon : <Icon size={64} />}
        </div>
      )}

      <h3
        style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#FFFFFF',
          marginBottom: '8px',
        }}
      >
        {title}
      </h3>

      {description && (
        <p
          style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
            maxWidth: '460px',
            marginBottom: '20px',
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      )}

      {actionText && onAction && (
        <Button variant="primary" onClick={onAction} icon={actionIcon}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
