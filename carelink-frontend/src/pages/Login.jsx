import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Stethoscope, Building, Pill, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const demoAccounts = [
    {
      name: 'Dr. Ramesh Verma',
      roleTitle: 'Senior Medical Officer (PHC)',
      facility: 'District Hospital Sagar',
      email: 'dr.verma@sagarphc.in',
      icon: Stethoscope,
      color: 'text-accentTeal bg-accentTealDim border-accentTeal/30'
    },
    {
      name: 'Dr. Priya Patel',
      roleTitle: 'Cardiologist Specialist',
      facility: 'NSCB Medical College, Jabalpur',
      email: 'dr.patel@jabalpurmc.in',
      icon: Activity,
      color: 'text-danger bg-danger/10 border-danger/30'
    },
    {
      name: 'Dr. Suresh Sharma',
      roleTitle: 'State Health Coordinator',
      facility: 'Madhya Pradesh Health Mission',
      email: 'admin@carelink.in',
      icon: ShieldCheck,
      color: 'text-accentAmber bg-accentAmber/10 border-accentAmber/30'
    },
    {
      name: 'R. K. Shukla',
      roleTitle: 'Chief Pharmacist',
      facility: 'Jabalpur MC Dispensary',
      email: 'pharma.shukla@carelink.in',
      icon: Pill,
      color: 'text-accentBlue bg-accentBlue/10 border-accentBlue/30'
    },
  ];

  const handleInstantLogin = async (demoEmail) => {
    setLoading(true);
    const result = await login(demoEmail, 'password123');
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-bgPrimary flex flex-col justify-center items-center p-4 sm:p-8">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed -top-40 left-1/4 h-96 w-96 rounded-full bg-accentTeal/5 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 right-1/4 h-96 w-96 rounded-full bg-accentAmber/5 blur-3xl" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
        
        {/* Left Column: 1-Click Instant Login Hub (Skill Setu style) */}
        <div className="lg:col-span-7 bg-bgCard border border-borderColor rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accentTeal/10 border border-accentTeal/30 flex items-center justify-center text-accentTeal shadow-glow-teal">
                <Activity className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-textPrimary tracking-tight font-display">
                  Care<span className="text-accentTeal">Link</span> Clinical Portal
                </h2>
                <p className="text-xs text-textSecondary font-mono">Healthcare Continuity & Referral Intelligence</p>
              </div>
            </div>
          </div>

          {/* 1-Click Demo Accounts Selector */}
          <div className="space-y-3">
            <p className="text-[11px] font-bold text-accentAmber uppercase tracking-wider">
              SELECT DEMO CLINICAL ACCOUNT FOR INSTANT LOG IN:
            </p>

            <div className="space-y-2.5">
              {demoAccounts.map((acc, idx) => {
                const Icon = acc.icon;
                return (
                  <div
                    key={idx}
                    className="p-3 sm:p-3.5 rounded-2xl bg-bgElevated/70 border border-borderColor hover:border-accentAmber/50 flex items-center justify-between gap-3 transition-all duration-150 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${acc.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-textPrimary truncate group-hover:text-accentAmber transition-colors">
                          {acc.name}
                        </p>
                        <p className="text-[11px] text-textSecondary truncate">
                          {acc.roleTitle} • <span className="text-textMuted">{acc.facility}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleInstantLogin(acc.email)}
                      disabled={loading}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-accentTerracotta to-accentAmber hover:brightness-110 text-white shadow-glow-amber flex items-center gap-1.5 flex-shrink-0 transition-transform active:scale-95 disabled:opacity-50"
                    >
                      Log In <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Or Custom Credentials Form */}
          <div className="pt-4 border-t border-borderColor/60 space-y-3">
            <p className="text-[11px] font-bold text-textSecondary uppercase tracking-wider">
              Or Custom Officer Credentials
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <Mail className="w-4 h-4 text-textSecondary absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@hospital.in"
                    className="w-full bg-bgElevated border border-borderColor rounded-xl pl-9 pr-3 py-2 text-xs text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-accentTeal"
                  />
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-textSecondary absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-bgElevated border border-borderColor rounded-xl pl-9 pr-3 py-2 text-xs text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-accentTeal"
                  />
                </div>
              </div>

              <Button type="submit" variant="secondary" loading={loading} className="w-full text-xs py-2">
                Sign In With Custom Credentials
              </Button>
            </form>
          </div>
        </div>

        {/* Right Column: Facility Profile & Testing Options (Skill Setu style) */}
        <div className="lg:col-span-5 bg-bgCard/60 border border-borderColor rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-accentTeal">
                CLINICAL ENVIRONMENT & TEST NODES
              </span>
              <h3 className="text-xl font-bold text-textPrimary font-display mt-1">
                Madhya Pradesh Referral Network
              </h3>
              <p className="text-xs text-textSecondary mt-1 leading-relaxed">
                Pre-configured multi-tier test environment simulating real clinical handoffs across district health systems.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-bgElevated/50 border border-borderColor/70 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-textPrimary flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-accentTeal" /> District Hospital Sagar
                  </span>
                  <span className="text-[10px] text-success font-semibold">Referring Node</span>
                </div>
                <p className="text-[11px] text-textSecondary">Primary intake, ECG, Troponin labs & Stage 0 referral dispatch.</p>
              </div>

              <div className="p-3 rounded-xl bg-bgElevated/50 border border-borderColor/70 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-textPrimary flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-accentAmber" /> NSCB Medical College Jabalpur
                  </span>
                  <span className="text-[10px] text-accentAmber font-semibold">Tertiary Center</span>
                </div>
                <p className="text-[11px] text-textSecondary">Cardiology specialty clinic, ICU beds, angiography & counter-referrals.</p>
              </div>

              <div className="p-3 rounded-xl bg-bgElevated/50 border border-borderColor/70 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-textPrimary flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accentBlue" /> Gemini 3.5 Flash-Lite
                  </span>
                  <span className="text-[10px] text-accentTeal font-semibold">Active Engine</span>
                </div>
                <p className="text-[11px] text-textSecondary">Real-time SSE care coordination assistant with patient context awareness.</p>
              </div>
            </div>
          </div>

          {/* Quick Direct Launch Action */}
          <div className="pt-4 border-t border-borderColor/60 space-y-2">
            <button
              onClick={() => handleInstantLogin('dr.verma@sagarphc.in')}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-accentTerracotta via-accentAmber to-accentSaffron hover:brightness-110 text-white shadow-glow-amber transition-all flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" /> Direct Log In as Dr. Verma & Open Dashboard
            </button>
            <p className="text-[10px] text-center text-textSecondary">
              Default password for all demo credentials: <code className="text-textPrimary font-mono">password123</code>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
