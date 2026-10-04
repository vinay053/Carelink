import React from 'react';
import Card from './Card';

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel = 'vs last week',
  variant = 'default', // 'default' | 'danger' | 'warning' | 'teal'
  onClick
}) {
  const variantStyles = {
    default: { text: 'text-textPrimary', iconBg: 'bg-bgElevated text-accentTeal', border: '' },
    teal: { text: 'text-accentTeal', iconBg: 'bg-accentTealDim text-accentTeal', border: 'border-accentTeal/30' },
    danger: { text: 'text-danger', iconBg: 'bg-dangerDim text-danger', border: 'border-danger/40' },
    warning: { text: 'text-warning', iconBg: 'bg-warningDim text-warning', border: 'border-warning/30' }
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <Card hoverEffect={!!onClick} onClick={onClick} className={`relative overflow-hidden ${style.border}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-textSecondary">{title}</p>
          <p className={`mt-2 text-3xl font-extrabold tracking-tight ${style.text}`}>{value}</p>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${style.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 flex items-center text-xs font-medium">
          <span className={trend.startsWith('+') ? 'text-success' : 'text-danger'}>
            {trend}
          </span>
          <span className="ml-1.5 text-textSecondary">{trendLabel}</span>
        </div>
      )}
    </Card>
  );
}
