import React from 'react';
import { Check, Clock } from 'lucide-react';
import { STAGE_NAMES } from '../../utils/constants';

export default function StageTrackerStepper({ currentStage = 0, stageTimestamps = [] }) {
  return (
    <div className="w-full py-4">
      {/* Stepper horizontal line and nodes */}
      <div className="relative">
        {/* Background Track Line */}
        <div className="absolute top-5 left-6 right-6 h-0.5 bg-bgElevated -z-0" />

        {/* Active Progress Line */}
        <div
          className="absolute top-5 left-6 h-0.5 bg-accentTeal transition-all duration-700 ease-out -z-0"
          style={{ width: `${Math.min(100, (currentStage / (STAGE_NAMES.length - 1)) * 100)}%` }}
        />

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 relative z-10">
          {STAGE_NAMES.map((name, idx) => {
            const isCompleted = idx < currentStage;
            const isCurrent = idx === currentStage;
            const timestampObj = stageTimestamps.find(st => st.stageIndex === idx);

            return (
              <div key={idx} className="flex flex-col items-center text-center">
                {/* Stage Circle Node */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    isCompleted
                      ? 'bg-accentTeal text-bgPrimary shadow-md shadow-accentTeal/20'
                      : isCurrent
                      ? 'bg-bgCard border-2 border-accentTeal text-accentTeal ring-4 ring-accentTeal/20 animate-pulse'
                      : 'bg-bgElevated border border-borderColor text-textSecondary'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : idx + 1}
                </div>

                {/* Stage Label */}
                <p
                  className={`mt-2 text-[11px] font-semibold tracking-tight line-clamp-2 max-w-[85px] leading-tight ${
                    isCurrent ? 'text-accentTeal' : (isCompleted ? 'text-textPrimary' : 'text-textSecondary/60')
                  }`}
                >
                  {name}
                </p>

                {/* Completion Timestamp */}
                {timestampObj && (
                  <span className="mt-1 text-[9px] text-textSecondary font-medium flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {new Date(timestampObj.completedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
