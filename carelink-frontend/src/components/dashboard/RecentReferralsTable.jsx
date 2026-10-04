import React from 'react';
import { Link } from 'react-router-dom';
import { STAGE_SHORT_NAMES } from '../../utils/constants';
import Badge from '../ui/Badge';
import { ArrowUpRight } from 'lucide-react';

export default function RecentReferralsTable({ referrals = [], loading = false }) {
  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-textSecondary animate-pulse">
        Loading active referrals...
      </div>
    );
  }

  if (referrals.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-textSecondary">
        No referrals registered in the system.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-borderColor text-textSecondary uppercase tracking-wider bg-bgElevated/30">
          <tr>
            <th className="py-3 px-4 font-semibold">Patient</th>
            <th className="py-3 px-4 font-semibold">Specialty</th>
            <th className="py-3 px-4 font-semibold">Stage Progress</th>
            <th className="py-3 px-4 font-semibold">Risk Level</th>
            <th className="py-3 px-4 font-semibold">Handoff</th>
            <th className="py-3 px-4 font-semibold text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-borderColor/60">
          {referrals.map((ref) => {
            const riskVariant = ref.riskLevel === 'high' ? 'danger' : (ref.riskLevel === 'medium' ? 'warning' : 'success');
            const currentStage = ref.currentStage || 0;
            const progressPercent = Math.min(100, Math.round(((currentStage + 1) / 8) * 100));

            return (
              <tr key={ref._id} className="hover:bg-bgElevated/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-textPrimary">{ref.patientId?.name || 'Patient'}</div>
                  <div className="text-[11px] text-textSecondary">{ref.patientId?.abhaId || 'ABHA N/A'}</div>
                </td>
                <td className="py-3 px-4 font-medium text-textPrimary">
                  {ref.targetSpecialty}
                </td>
                <td className="py-3 px-4 min-w-[140px]">
                  <div className="flex items-center justify-between text-[10px] text-textSecondary mb-1 font-semibold">
                    <span>{STAGE_SHORT_NAMES[currentStage] || `Stage ${currentStage}`}</span>
                    <span className="text-accentTeal">{currentStage + 1}/8</span>
                  </div>
                  <div className="w-full bg-bgElevated h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        ref.status === 'closed' || ref.status === 'follow_up_done'
                          ? 'bg-success'
                          : (ref.riskLevel === 'high' ? 'bg-danger' : 'bg-accentTeal')
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge variant={riskVariant} size="sm">
                    {ref.riskScore} • {ref.riskLevel?.toUpperCase()}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-[11px] text-textSecondary">
                  <div className="truncate max-w-[120px]" title={ref.referringHospitalId?.name}>
                    {ref.referringHospitalId?.name || 'PHC'}
                  </div>
                  <div className="text-accentTeal truncate max-w-[120px]" title={ref.targetHospitalId?.name}>
                    → {ref.targetHospitalId?.name || 'Hospital'}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <Link
                    to={`/referrals/${ref._id}`}
                    className="inline-flex items-center gap-1 font-bold text-accentTeal hover:underline"
                  >
                    View <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
