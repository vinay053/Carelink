import React from 'react';

export default function SkeletonLoader({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-3 animate-pulse p-4 ${className}`}>
      <div className="h-4 bg-bgElevated rounded-md w-3/4" />
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <div key={i} className="h-3 bg-bgElevated/70 rounded-md w-full" />
      ))}
    </div>
  );
}
