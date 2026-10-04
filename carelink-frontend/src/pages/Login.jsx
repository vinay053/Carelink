import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleQuickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-bgPrimary flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md bg-bgCard border border-borderColor rounded-2xl p-8 shadow-2xl space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-accentTeal/10 border border-accentTeal/30 flex items-center justify-center mx-auto text-accentTeal">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-textPrimary">Sign In to CareLink</h2>
          <p className="text-xs text-textSecondary">Healthcare Continuity & Referral Intelligence</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-textSecondary absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@hospital.in"
                className="w-full bg-bgElevated border border-borderColor rounded-lg pl-10 pr-4 py-2.5 text-sm text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-accentTeal"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-textSecondary absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-bgElevated border border-borderColor rounded-lg pl-10 pr-4 py-2.5 text-sm text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-accentTeal"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" loading={loading} className="w-full mt-2">
            Sign In <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        {/* Quick Demo Logins */}
        <div className="pt-4 border-t border-borderColor/60 space-y-2">
          <p className="text-[11px] text-center font-semibold text-textSecondary uppercase tracking-wider">
            Quick Demo Accounts (Madhya Pradesh)
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('dr.verma@sagarphc.in')}
              className="p-2 rounded bg-bgElevated hover:border-accentTeal border border-borderColor text-left transition-colors"
            >
              <span className="font-bold text-textPrimary block truncate">Dr. Verma (PHC)</span>
              <span className="text-[10px] text-textSecondary">Sagar DH</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('dr.patel@jabalpurmc.in')}
              className="p-2 rounded bg-bgElevated hover:border-accentTeal border border-borderColor text-left transition-colors"
            >
              <span className="font-bold text-textPrimary block truncate">Dr. Patel (Cardio)</span>
              <span className="text-[10px] text-textSecondary">Jabalpur MC</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@carelink.in')}
              className="p-2 rounded bg-bgElevated hover:border-accentTeal border border-borderColor text-left transition-colors"
            >
              <span className="font-bold text-textPrimary block truncate">State Admin</span>
              <span className="text-[10px] text-textSecondary">Coordinator</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('pharma.shukla@carelink.in')}
              className="p-2 rounded bg-bgElevated hover:border-accentTeal border border-borderColor text-left transition-colors"
            >
              <span className="font-bold text-textPrimary block truncate">R. Shukla</span>
              <span className="text-[10px] text-textSecondary">Chief Pharmacist</span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-textSecondary">
          Need an account?{' '}
          <Link to="/register" className="text-accentTeal font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
