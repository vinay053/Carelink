import React from 'react';
import { Zap, Bot, Shield, Activity, Building, TrendingDown, Clock, AlertTriangle } from 'lucide-react';

export default function LiveTickerRibbon({ className = '' }) {
  const items = [
    { icon: Zap, label: 'Real-Time SLA Engine', val: '<1s Event Loop', color: 'text-accentAmber' },
    { icon: Bot, label: 'AI Care Coordinator', val: 'Gemini 3.5 Flash-Lite', color: 'text-accentTeal' },
    { icon: Building, label: 'Madhya Pradesh Network', val: 'Sagar • Jabalpur • Bhopal', color: 'text-accentBlue' },
    { icon: Shield, label: 'Ayushman Bharat ABHA', val: '100% Verified Identifiers', color: 'text-success' },
    { icon: TrendingDown, label: 'Dropout Prevention', val: '40% Predicted Reduction', color: 'text-accentSaffron' },
    { icon: Clock, label: 'Critical Lab Turnaround', val: '<24h Protocol SLA', color: 'text-danger' },
    { icon: Activity, label: 'Cross-Facility Bed Map', val: '100% Live Availability', color: 'text-accentTeal' },
  ];

  // Duplicate list to achieve continuous infinite marquee loop
  const duplicated = [...items, ...items];

  return (
    <div className={`w-full overflow-hidden bg-bgElevated/50 border-y border-borderColor/70 py-2.5 ${className}`}>
      <div className="animate-marquee items-center gap-8 text-xs font-medium">
        {duplicated.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2 flex-shrink-0 px-2 group cursor-default">
              <Icon className={`w-3.5 h-3.5 ${item.color} group-hover:scale-110 transition-transform`} />
              <span className="text-textSecondary">{item.label}:</span>
              <span className="text-textPrimary font-semibold tracking-wide">{item.val}</span>
              <span className="text-borderColor ml-4">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
