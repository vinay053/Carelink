import React from 'react';
import { GitPullRequest, Bot, Clock, TestTube2, Building2, Pill, ShieldAlert, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export default function CognitiveArchitectureGrid() {
  const steps = [
    {
      step: 'STEP 01 — PRIMARY REFERRAL',
      title: 'Isolated Handoff Orders',
      desc: 'Patients receive paper or siloed referrals. If the patient misses transit, the referring doctor never knows.',
      badge: 'Traditional System: Blind Gaps',
      badgeColor: 'text-danger bg-danger/10 border-danger/30',
      highlight: false
    },
    {
      step: 'STEP 02 — COGNITIVE CARE GAP FUSION',
      title: 'CareLink Fuses the Dots',
      desc: 'Our engine connects 58km transit distance + delayed specialist booking + unreviewed Troponin lab into one compound risk score.',
      badge: 'Compound Risk: 85/100 (HIGH)',
      badgeColor: 'text-accentAmber bg-accentAmber/10 border-accentAmber/30',
      highlight: true
    },
    {
      step: 'STEP 03 — AUTONOMOUS ACTION',
      title: 'Closed-Loop Continuity',
      desc: 'Pre-emptive SMS alert dispatched to patient, ASHA worker assigned for transit help, and specialist slot reserved.',
      badge: 'Zero Dropouts Achieved',
      badgeColor: 'text-success bg-success/10 border-success/30',
      highlight: false
    }
  ];

  const systems = [
    {
      icon: GitPullRequest,
      title: '5-Stage Referral Mesh',
      desc: 'Real-time telemetry from Referral Created → Accepted → Scheduled → Completed → Counter-Referred.',
      color: 'text-accentTeal'
    },
    {
      icon: Bot,
      title: 'Gemini 3.5 Flash-Lite Brain',
      desc: 'Ground-truth evidence extraction, timeline reconstruction, and real-time SSE streaming for clinicians.',
      color: 'text-accentAmber'
    },
    {
      icon: Clock,
      title: 'Care Gap SLA Auditor',
      desc: 'Automated 15-minute background auditor that detects stalled handoffs and auto-resolves when stage advances.',
      color: 'text-accentBlue'
    },
    {
      icon: TestTube2,
      title: '24h Diagnostic Radar',
      desc: 'Urgent diagnostic flagger ensuring abnormal Troponin, CT, or ECG tests are reviewed before clinical deterioration.',
      color: 'text-danger'
    },
    {
      icon: Pill,
      title: 'Drug Conflict Detector',
      desc: 'Cross-checks chronic medication history across facilities, instantly flagging dangerous interactions like Aspirin + Warfarin.',
      color: 'text-accentSaffron'
    },
    {
      icon: Building2,
      title: 'Facility Telemetry',
      desc: 'Live multi-parameter matching across distance, ICU beds, diagnostics, and specialist on-call schedules.',
      color: 'text-success'
    }
  ];

  return (
    <div className="py-20 space-y-16">
      {/* 3-Step Cognitive Fusion Section (Kawach style) */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-accentTeal">
          THE CONTINUITY PROBLEM & SOLUTION
        </span>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-textPrimary font-display">
          Data existed. Continuity didn't.
        </h2>
        <p className="text-sm sm:text-base text-textSecondary leading-relaxed">
          At district hospitals, every doctor worked hard. Tests were ordered. Yet 40% of referred patients dropped out because no system connected travel friction, delayed appointments, and abnormal test results into a single actionable workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-6 border transition-all duration-300 relative flex flex-col justify-between ${
              s.highlight
                ? 'bg-gradient-to-b from-bgElevated to-bgCard border-accentAmber/40 shadow-glow-amber ring-1 ring-accentAmber/30'
                : 'bg-bgCard/60 border-borderColor hover:border-borderColor/80'
            }`}
          >
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-textSecondary">
                {s.step}
              </span>
              <h3 className="text-lg font-bold text-textPrimary font-display">
                {s.title}
              </h3>
              <p className="text-xs text-textSecondary leading-relaxed">
                {s.desc}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-borderColor/60">
              <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold border ${s.badgeColor}`}>
                {s.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Six Systems One Brain Grid (Kawach style) */}
      <div className="pt-12 border-t border-borderColor/60 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-accentAmber">
            WHAT CARELINK DOES
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-textPrimary font-display">
            Six systems. One healthcare brain.
          </h2>
          <p className="text-xs text-textSecondary">
            Engineered specifically for the public healthcare continuum in Madhya Pradesh.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {systems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-bgCard border border-borderColor hover:border-accentTeal/40 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 shadow-lg group"
              >
                <div className="w-10 h-10 rounded-xl bg-bgElevated border border-borderColor flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <h4 className="text-base font-bold text-textPrimary font-display mb-1.5">
                  {item.title}
                </h4>
                <p className="text-xs text-textSecondary leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
