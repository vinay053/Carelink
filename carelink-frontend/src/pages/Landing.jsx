import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, ShieldCheck, Clock, GitPullRequest, AlertTriangle } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function Landing() {
  return (
    <div className="min-h-screen bg-bgPrimary flex flex-col selection:bg-accentTeal selection:text-bgPrimary">
      {/* Top Navigation */}
      <header className="h-20 border-b border-borderColor/60 px-6 sm:px-12 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accentTeal/10 border border-accentTeal/30 flex items-center justify-center text-accentTeal">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-textPrimary">
              Care<span className="text-accentTeal">Link</span>
            </span>
            <span className="text-[10px] block uppercase font-bold tracking-widest text-textSecondary -mt-1">
              Continuity AI
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center px-6 sm:px-12 max-w-7xl mx-auto w-full py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Headline */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accentTealDim border border-accentTeal/30 text-xs font-semibold text-accentTeal">
              <span className="w-2 h-2 rounded-full bg-accentTeal animate-ping" />
              Healthcare Continuity & Referral Intelligence
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-textPrimary leading-tight">
              Healthcare does not fail only inside hospitals. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accentTeal via-teal-300 to-emerald-400">
                It fails between them.
              </span>
            </h1>

            <p className="text-lg text-textSecondary max-w-xl leading-relaxed">
              CareLink is the intelligence layer that tracks patient journeys across primary health centres, district hospitals, and labs — detecting stalled handoffs, predicting dropout risk, and closing care gaps in real time.
            </p>

            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <Link to="/login">
                <Button variant="primary" size="lg" className="shadow-lg shadow-accentTeal/20">
                  Launch Demo Dashboard <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
              <a href="#metrics">
                <Button variant="secondary" size="lg">Explore System Metrics</Button>
              </a>
            </div>
          </div>

          {/* Right Live Simulation Card */}
          <div className="lg:col-span-5">
            <div className="bg-bgCard border border-borderColor rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-borderColor">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-danger animate-pulse" />
                  <span className="text-xs font-bold text-textPrimary uppercase tracking-wider">Live Journey Tracker</span>
                </div>
                <Badge variant="danger" size="sm">ACTIVE CARE GAP</Badge>
              </div>

              {/* Patient Snippet */}
              <div className="mt-4 p-3 rounded-lg bg-bgElevated border border-borderColor">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-textPrimary">Suresh Kumar (58 M)</span>
                  <span className="text-textSecondary">ABHA: 23-4567-8901</span>
                </div>
                <p className="text-[11px] text-textSecondary mt-1">Sagar PHC → Jabalpur Medical College (Cardiology)</p>
              </div>

              {/* Stepper Preview */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-accentTeal">Stage 1: Referral Accepted</span>
                  <span className="text-danger font-bold">Overdue by 24h</span>
                </div>
                <div className="w-full bg-bgElevated h-2 rounded-full overflow-hidden">
                  <div className="bg-accentTeal h-full w-[28%] rounded-full" />
                </div>
                <p className="text-[11px] text-textSecondary">
                  Expected window: 24h • Elapsed: 48h without specialist booking.
                </p>
              </div>

              {/* Alert Callout */}
              <div className="mt-4 p-3 rounded-lg bg-dangerDim border border-danger/30 text-xs flex gap-2.5 items-start">
                <AlertTriangle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-danger">AI Care Coordinator Alert:</span>
                  <p className="text-textSecondary text-[11px] mt-0.5">
                    High dropout probability (Risk: 85/100). ASHA worker intervention required for transit coordination.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Strip */}
        <div id="metrics" className="mt-24 pt-12 border-t border-borderColor/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-4xl font-extrabold text-accentTeal">40%</p>
            <p className="mt-1 text-xs uppercase font-bold text-textSecondary">Referral Dropout Reduction</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-textPrimary">8x</p>
            <p className="mt-1 text-xs uppercase font-bold text-textSecondary">Faster Critical Lab Review</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-warning">100%</p>
            <p className="mt-1 text-xs uppercase font-bold text-textSecondary">Drug Conflicts Surfaced</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-success">0</p>
            <p className="mt-1 text-xs uppercase font-bold text-textSecondary">Blind Hospital Referrals</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-borderColor/60 py-6 text-center text-xs text-textSecondary">
        CareLink © 2026 • Healthcare Continuity & Referral Intelligence System
      </footer>
    </div>
  );
}
