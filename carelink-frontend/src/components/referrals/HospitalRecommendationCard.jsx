import React from 'react';
import { Building2, CheckCircle2, ShieldCheck, MapPin, Bed, Activity } from 'lucide-react';
import Badge from '../ui/Badge';

export default function HospitalRecommendationCard({
  hospital,
  isSelected,
  onSelect
}) {
  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'bg-accentTealDim/40 border-accentTeal ring-2 ring-accentTeal/30 shadow-lg shadow-accentTeal/10'
          : 'bg-bgCard border-borderColor hover:border-borderColor/80 hover:bg-bgElevated/40'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-bgElevated text-accentTeal border border-borderColor">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-textPrimary">{hospital.name}</h4>
            <div className="flex items-center gap-2 text-xs text-textSecondary mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-accentTeal" />
                {hospital.district} ({hospital.distanceKm} km)
              </span>
              <span>•</span>
              <span className="capitalize">{hospital.type} facility</span>
            </div>
          </div>
        </div>

        <Badge variant={hospital.totalScore >= 70 ? 'teal' : 'default'} size="sm">
          Match Score: {hospital.totalScore}/100
        </Badge>
      </div>

      {/* Metrics Row */}
      <div className="mt-3 pt-3 border-t border-borderColor/60 grid grid-cols-3 gap-2 text-[11px] text-textSecondary">
        <div className="flex items-center gap-1.5">
          <Bed className="w-3.5 h-3.5 text-accentTeal" />
          <span>ICU: <strong className="text-textPrimary">{hospital.availableICUBeds}</strong>/{hospital.totalICUBeds}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-warning" />
          <span>Load: <strong className="text-textPrimary">{hospital.currentLoad}%</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-success" />
          <span>{hospital.hasCT ? 'CT Scanner' : 'Basic Imaging'}</span>
        </div>
      </div>

      {/* Specialist & Recommendation Explanation */}
      {hospital.specialistInfo && (
        <div className="mt-2.5 p-2 rounded bg-bgElevated/60 text-xs text-textSecondary flex items-center justify-between">
          <span>Specialist: <strong className="text-textPrimary">{hospital.specialistInfo.name}</strong></span>
          <span className="text-accentTeal font-semibold">{hospital.specialistInfo.availableToday ? 'Available Today' : hospital.specialistInfo.nextAvailable}</span>
        </div>
      )}

      {isSelected && (
        <div className="mt-2 text-right">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-accentTeal">
            <CheckCircle2 className="w-4 h-4" /> Selected Target Facility
          </span>
        </div>
      )}
    </div>
  );
}
