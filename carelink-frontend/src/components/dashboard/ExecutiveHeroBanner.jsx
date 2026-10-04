import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Sparkles, Building, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ExecutiveHeroBanner({ overview, onOpenSimulator }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'doctor_referring': return 'Referring Medical Officer';
      case 'doctor_specialist': return 'Specialist Cardiologist';
      case 'pharmacist': return 'Chief Pharmacist';
      case 'admin': return 'State Health Coordinator';
      default: return 'Healthcare Provider';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-borderColor bg-gradient-to-r from-bgCard via-bgCard to-[#2A1810]/40 p-6 sm:p-8 shadow-xl">
      {/* Decorative ambient warm glow (Skill Setu signature) */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accentAmber/10 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 -bottom-20 h-48 w-48 rounded-full bg-accentTeal/10 blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left: User Identity & Official Badge */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accentTerracotta/15 border border-accentTerracotta/40 text-[11px] font-bold uppercase tracking-wider text-accentTerracotta">
              <ShieldCheck className="w-3.5 h-3.5" /> Official Clinical Registry
            </span>
            <span className="text-[11px] text-textSecondary font-mono">
              Facility Node: {user?.facilityName || 'Madhya Pradesh Health Network'}
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-textPrimary font-display">
              {user?.name || 'Authorized Clinician'}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-xs text-textSecondary">
              <span className="font-semibold text-accentTeal">{getRoleDisplayName(user?.role)}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-textSecondary">
                <Building className="w-3.5 h-3.5" /> {user?.facilityName || 'District Hospital Sagar'}
              </span>
            </div>
          </div>

          <p className="text-xs text-textSecondary max-w-xl leading-relaxed">
            Continuous cross-facility patient tracking, real-time diagnostic turnaround, and automated care gap escalation.
          </p>
        </div>

        {/* Right: Glassmorphic Metrics Card with Dividers (Skill Setu style) */}
        <div className="bg-bgElevated/70 backdrop-blur-md border border-borderColor rounded-xl p-4 sm:p-5 flex flex-wrap sm:flex-nowrap items-center divide-y sm:divide-y-0 sm:divide-x divide-borderColor/70 shadow-lg">
          <div className="px-4 py-2 sm:py-0 text-center flex-1">
            <p className="text-[10px] uppercase font-bold text-textSecondary tracking-wider">Active Handoffs</p>
            <p className="text-xl sm:text-2xl font-black text-accentAmber mt-0.5">{overview.totalReferrals || 5}</p>
            <span className="text-[10px] text-textSecondary">Referral Loop</span>
          </div>

          <div className="px-4 py-2 sm:py-0 text-center flex-1">
            <p className="text-[10px] uppercase font-bold text-textSecondary tracking-wider">Care Gaps</p>
            <p className="text-xl sm:text-2xl font-black text-danger mt-0.5">{overview.atRiskReferrals || 2}</p>
            <span className="text-[10px] text-danger font-medium">Overdue SLA</span>
          </div>

          <div className="px-4 py-2 sm:py-0 text-center flex-1">
            <p className="text-[10px] uppercase font-bold text-textSecondary tracking-wider">Pending Labs</p>
            <p className="text-xl sm:text-2xl font-black text-warning mt-0.5">{overview.pendingDiagnostics || 2}</p>
            <span className="text-[10px] text-warning font-medium">Troponin & Labs</span>
          </div>

          <div className="px-4 py-2 sm:py-0 text-center flex-1">
            <p className="text-[10px] uppercase font-bold text-textSecondary tracking-wider">AI Engine</p>
            <p className="text-sm font-bold text-accentTeal mt-1.5 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Gemini 3.5
            </p>
            <span className="text-[10px] text-textSecondary">Flash-Lite SSE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
