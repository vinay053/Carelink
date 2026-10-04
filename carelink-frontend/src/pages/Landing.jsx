import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, ShieldCheck, Clock, GitPullRequest, AlertTriangle, Sparkles, Building2, User } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LiveTickerRibbon from '../components/common/LiveTickerRibbon';
import CognitiveArchitectureGrid from '../components/landing/CognitiveArchitectureGrid';

export default function Landing() {
  return (
    <div className="min-h-screen bg-bgPrimary flex flex-col selection:bg-accentTeal selection:text-bgPrimary">
      {/* Live Ticker Ribbon at top of page (Kawach style) */}
      <LiveTickerRibbon />

      {/* Top Navigation Bar */}
      <header className="h-20 border-b border-borderColor/60 px-6 sm:px-12 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accentTeal/10 border border-accentTeal/30 flex items-center justify-center text-accentTeal shadow-glow-teal">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-textPrimary font-display">
              Care<span className="text-accentTeal">Link</span>
            </span>
            <span className="text-[10px] block uppercase font-bold tracking-widest text-accentAmber -mt-1 font-mono">
              Continuity AI • MP Node
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-textSecondary hover:text-textPrimary">
              Clinical Login
            </Button>
          </Link>
          <Link to="/login">
            <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-accentTerracotta to-accentAmber hover:brightness-110 text-white shadow-glow-amber transition-all">
              Launch Console <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center px-6 sm:px-12 max-w-7xl mx-auto w-full py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Headline */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accentTealDim border border-accentTeal/30 text-xs font-semibold text-accentTeal">
              <span className="w-2 h-2 rounded-full bg-accentTeal animate-ping" />
              <span>AI-Powered Healthcare Continuity & Referral Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-textPrimary leading-[1.08] font-display">
              Healthcare does not fail inside hospitals.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accentTeal via-teal-300 to-accentAmber">
                It fails between them.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-textSecondary max-w-xl leading-relaxed">
              CareLink is the intelligence layer that tracks patient journeys across primary health centres, district hospitals, and tertiary medical colleges in Madhya Pradesh — eliminating blind referrals, predicting dropout risk, and closing care gaps in real time.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <Link to="/login">
                <button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-accentTerracotta via-accentAmber to-accentSaffron hover:brightness-110 text-white shadow-glow-amber transition-all">
                  Launch Clinical Console <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </Link>
              <a href="#how-it-works">
                <Button variant="secondary" size="lg" className="border-borderColor hover:bg-bgElevated">
                  See How It Works ↓
                </Button>
              </a>
            </div>

            {/* Quick Demo Clinician Links */}
            <div className="pt-4 flex items-center gap-2 text-xs text-textSecondary">
              <span className="font-semibold text-textPrimary">Instant Demo Access:</span>
              <Link to="/login" className="text-accentTeal hover:underline">Dr. Verma (PHC)</Link> •
              <Link to="/login" className="text-accentAmber hover:underline">Dr. Patel (Cardiology)</Link> •
              <Link to="/login" className="text-accentBlue hover:underline">State Admin</Link>
            </div>
          </div>

          {/* Right Live Simulation Card (Kawach / Skill Setu style) */}
          <div className="lg:col-span-5">
            <div className="bg-bgCard border border-borderColor rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden ring-1 ring-white/5">
              <div className="flex items-center justify-between pb-4 border-b border-borderColor">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-danger animate-ping" />
                  <span className="text-xs font-bold text-textPrimary uppercase tracking-wider font-mono">
                    Live Journey Telemetry
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-danger/15 text-danger border border-danger/30">
                  ▲ CRITICAL CARE GAP
                </span>
              </div>

              {/* Patient Card */}
              <div className="mt-4 p-4 rounded-xl bg-bgElevated/70 border border-borderColor/80 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-textPrimary flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-accentTeal" /> Suresh Kumar (58 M)
                  </span>
                  <span className="text-[11px] text-textSecondary font-mono">ABHA: 23-4567-8901</span>
                </div>
                <p className="text-[11px] text-textSecondary">
                  Sagar PHC → Jabalpur Medical College (Cardiology) • Distance: 58km
                </p>
              </div>

              {/* Stepper Preview */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-accentTeal font-bold">Stage 1: Referral Accepted</span>
                  <span className="text-danger font-bold">Overdue by 24h</span>
                </div>
                <div className="w-full bg-bgPrimary h-2.5 rounded-full overflow-hidden p-0.5 border border-borderColor">
                  <div className="bg-gradient-to-r from-accentTeal to-accentAmber h-full w-[45%] rounded-full animate-pulse" />
                </div>
                <div className="flex justify-between text-[10px] text-textSecondary font-mono">
                  <span>SLA Window: 24h</span>
                  <span>Elapsed: 48h without booking</span>
                </div>
              </div>

              {/* AI Gemini Callout */}
              <div className="mt-5 p-3.5 rounded-xl bg-danger/10 border border-danger/30 text-xs flex gap-3 items-start">
                <AlertTriangle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-danger flex items-center gap-1">
                    Gemini 3.5 Care Coordinator Alert:
                  </span>
                  <p className="text-textSecondary text-[11px] leading-relaxed">
                    Compound Dropout Risk calculated at <strong>85/100 (HIGH)</strong>. Unscheduled transit + rural transit friction. ASHA intervention recommended.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Item Impact Metric Strip (Kawach & Skill Setu style) */}
        <div id="metrics" className="mt-20 pt-10 border-t border-borderColor/70 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-xl bg-bgCard/40 border border-borderColor/40">
            <p className="text-3xl sm:text-5xl font-black text-accentAmber font-display">40%</p>
            <p className="mt-1 text-xs uppercase font-bold text-textSecondary tracking-wider">Dropout Reduction</p>
            <span className="text-[10px] text-textSecondary">Pre-emptive ASHA Outreach</span>
          </div>
          <div className="p-4 rounded-xl bg-bgCard/40 border border-borderColor/40">
            <p className="text-3xl sm:text-5xl font-black text-textPrimary font-display">&lt;24h</p>
            <p className="mt-1 text-xs uppercase font-bold text-textSecondary tracking-wider">Critical Lab Escalation</p>
            <span className="text-[10px] text-textSecondary">Abnormal Troponin Alerting</span>
          </div>
          <div className="p-4 rounded-xl bg-bgCard/40 border border-borderColor/40">
            <p className="text-3xl sm:text-5xl font-black text-accentTeal font-display">100%</p>
            <p className="mt-1 text-xs uppercase font-bold text-textSecondary tracking-wider">Drug Conflicts Surfaced</p>
            <span className="text-[10px] text-textSecondary">Aspirin + Warfarin Safety</span>
          </div>
          <div className="p-4 rounded-xl bg-bgCard/40 border border-borderColor/40">
            <p className="text-3xl sm:text-5xl font-black text-success font-display">0</p>
            <p className="mt-1 text-xs uppercase font-bold text-textSecondary tracking-wider">Blind Hospital Referrals</p>
            <span className="text-[10px] text-textSecondary">Live ICU & Specialist Telemetry</span>
          </div>
        </div>

        {/* Cognitive Fusion & Six Systems Section */}
        <div id="how-it-works">
          <CognitiveArchitectureGrid />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-borderColor/60 py-8 px-6 text-center text-xs text-textSecondary space-y-2">
        <p className="font-semibold text-textPrimary">CareLink • Healthcare Continuity & Referral Intelligence System</p>
        <p>Operational Pilot: Sagar District Hospital • NSCB Medical College Jabalpur • AIIMS Bhopal</p>
      </footer>
    </div>
  );
}
