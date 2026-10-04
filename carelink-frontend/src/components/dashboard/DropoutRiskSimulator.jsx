import React, { useState } from 'react';
import { Activity, AlertTriangle, ShieldCheck, Send, CheckCircle2, User, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DropoutRiskSimulator() {
  const [delayHours, setDelayHours] = useState(24);
  const [dispatched, setDispatched] = useState(false);

  // Steps for the simulation slider (Skill Setu style)
  const steps = [
    { value: 0, label: 'Today (0h)', risk: 35, tier: 'LOW', color: 'text-success', bg: 'bg-success/15 border-success/30' },
    { value: 24, label: '+24h Delay', risk: 62, tier: 'MEDIUM-HIGH', color: 'text-accentAmber', bg: 'bg-accentAmber/15 border-accentAmber/30' },
    { value: 48, label: '+48h Delay', risk: 85, tier: 'CRITICAL', color: 'text-danger', bg: 'bg-danger/15 border-danger/30' },
    { value: 72, label: '+72h Delay', risk: 94, tier: 'SEVERE', color: 'text-danger', bg: 'bg-danger/20 border-danger/40' },
    { value: 168, label: '+7 Days', risk: 99, tier: 'LOST TO CARE', color: 'text-danger', bg: 'bg-danger/25 border-danger/50' }
  ];

  // Find active step or interpolate
  const currentStep = steps.reduce((prev, curr) => {
    return Math.abs(curr.value - delayHours) < Math.abs(prev.value - delayHours) ? curr : prev;
  });

  const handleDispatchASHA = () => {
    setDispatched(true);
    toast.success('Pre-emptive transit SMS sent to patient & ASHA Worker assigned!');
    setTimeout(() => setDispatched(false), 5000);
  };

  return (
    <div className="rounded-2xl border border-borderColor bg-gradient-to-br from-bgCard via-bgElevated to-bgCard p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Subtle indicator bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-borderColor gap-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-accentTerracotta animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-accentTerracotta">
            Innovation Hook: Referral Dropout Decay Horizon
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-textSecondary font-mono">
            Simulated Horizon: <strong className="text-textPrimary">+{delayHours}h Inactivity</strong>
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${currentStep.bg} ${currentStep.color}`}>
            Risk: {currentStep.risk}/100 ({currentStep.tier})
          </span>
        </div>
      </div>

      <p className="text-xs text-textSecondary mt-3">
        Move the horizon slider to project how transit delays, distance (58km), and unbooked specialist visits compound into irreversible patient dropout without ASHA outreach.
      </p>

      {/* Interactive Slider */}
      <div className="mt-5 space-y-3">
        <div className="relative">
          <input
            type="range"
            min="0"
            max="168"
            step="24"
            value={delayHours}
            onChange={(e) => setDelayHours(Number(e.target.value))}
            className="w-full h-2 bg-bgPrimary rounded-lg appearance-none cursor-pointer accent-accentTerracotta"
          />
        </div>

        {/* Step Marks */}
        <div className="flex justify-between text-[10px] text-textSecondary font-mono px-1">
          {steps.map((s) => (
            <button
              key={s.value}
              onClick={() => setDelayHours(s.value)}
              className={`hover:text-textPrimary transition-colors ${delayHours === s.value ? 'font-bold text-accentAmber' : ''}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Simulated Patient Projection Card */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-bgPrimary/50 rounded-xl p-4 border border-borderColor">
        <div className="md:col-span-8 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-textPrimary">
            <User className="w-3.5 h-3.5 text-accentTeal" />
            <span>Target Patient: Suresh Kumar (58 M) • Sagar PHC → Jabalpur MC</span>
          </div>
          <p className="text-xs text-textSecondary">
            {delayHours === 0 && 'Patient is within initial 24h referral acceptance window. Standard SMS sent.'}
            {delayHours === 24 && 'Stage 1 referral accepted, but specialist slot unbooked. Risk escalates due to 58km travel distance.'}
            {delayHours === 48 && 'CRITICAL: Patient missed scheduled bus transit. Probability of follow-up failure exceeds 85%.'}
            {delayHours >= 72 && 'EMERGENCY SLA BREACH: High likelihood of permanent care loop dropout. Immediate field intervention required.'}
          </p>
        </div>

        {/* 1-Click Intervention Action */}
        <div className="md:col-span-4 flex justify-end">
          <button
            onClick={handleDispatchASHA}
            disabled={dispatched}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
              dispatched
                ? 'bg-success text-white'
                : 'bg-gradient-to-r from-accentTerracotta to-accentAmber hover:brightness-110 text-white shadow-glow-amber'
            }`}
          >
            {dispatched ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> ASHA Worker Dispatched!
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" /> Dispatch ASHA & Send SMS
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
