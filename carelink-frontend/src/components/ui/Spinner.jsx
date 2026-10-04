import React from 'react';

export default function Spinner({ size = 'md', className = '' }) {
  let dimension = 24;
  let strokeWidth = 3;

  if (size === 'sm') {
    dimension = 16;
    strokeWidth = 2.5;
  } else if (size === 'lg') {
    dimension = 40;
    strokeWidth = 4;
  }

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: `${dimension}px`, height: `${dimension}px` }}
      role="status"
    >
      <svg
        style={{
          width: `${dimension}px`,
          height: `${dimension}px`,
          animation: 'spin 1s linear infinite',
        }}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="rgba(0, 191, 166, 0.2)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="var(--accent-teal)"
          strokeWidth={strokeWidth}
          strokeDasharray="40 60"
          strokeLinecap="round"
        />
      </svg>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
