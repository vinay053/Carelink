import React from 'react';
import Badge from './Badge';

export default function RiskScore({
  score = 0,
  level = 'low',
  factors = [],
  recommendedAction,
  showFactors = true,
  size = 'md'
}) {
  // Semicircular Gauge calculations
  const radius = 60;
  const strokeWidth = 10;
  const circumference = Math.PI * radius; // half circle
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let color = '#2ED573'; // success green
  let levelVariant = 'success';
  if (clampedScore >= 71) {
    color = '#FF4757'; // danger red
    levelVariant = 'danger';
  } else if (clampedScore >= 41) {
    color = '#FFA502'; // warning amber
    levelVariant = 'warning';
  }

  return (
    <div className="flex flex-col items-center">
      {/* Semicircular Gauge */}
      <div className="relative flex flex-col items-center justify-center">
        <svg
          width="160"
          height="95"
          viewBox="0 0 160 95"
          className="overflow-visible"
        >
          {/* Background Track */}
          <path
            d="M 15 85 A 60 60 0 0 1 145 85"
            fill="none"
            stroke="#243447"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Colored Value Arc */}
          <path
            d="M 15 85 A 60 60 0 0 1 145 85"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Numeric Score Center */}
        <div className="absolute top-10 flex flex-col items-center">
          <span className="text-3xl font-extrabold text-textPrimary tracking-tight">
            {clampedScore}
          </span>
          <span className="text-[10px] uppercase font-bold text-textSecondary tracking-wider">
            out of 100
          </span>
        </div>

        {/* Risk Level Badge */}
        <div className="mt-1">
          <Badge variant={levelVariant} size="md">
            {level.toUpperCase()} DROPOUT RISK
          </Badge>
        </div>
      </div>

      {/* Recommended Action */}
      {recommendedAction && (
        <div className="mt-4 w-full p-3 rounded-lg bg-bgElevated/70 border border-borderColor text-xs text-textSecondary">
          <span className="font-semibold text-textPrimary block mb-1">Recommended Action:</span>
          {recommendedAction}
        </div>
      )}

      {/* Factors Table */}
      {showFactors && factors && factors.length > 0 && (
        <div className="mt-4 w-full">
          <p className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">
            Risk Factor Breakdown
          </p>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {factors.map((f, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs p-2 rounded-lg bg-bgCard border border-borderColor/60"
              >
                <span className="text-textSecondary truncate max-w-[200px]" title={f.factor}>
                  {f.factor}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-1.5 rounded-full bg-bgElevated overflow-hidden">
                    <div
                      className="h-full bg-danger rounded-full"
                      style={{ width: `${Math.min(100, (f.points / 20) * 100)}%` }}
                    />
                  </div>
                  <span className="font-bold text-danger text-[11px]">+{f.points}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
