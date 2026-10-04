import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'doctor',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setLoading(true);
    const result = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      password: formData.password
    });
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-bgPrimary flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md bg-bgCard border border-borderColor rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-accentTeal/10 border border-accentTeal/30 flex items-center justify-center mx-auto text-accentTeal">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-textPrimary">Create Account</h2>
          <p className="text-xs text-textSecondary">Join the CareLink Healthcare Continuity Network</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-textSecondary absolute left-3.5 top-3" />
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Dr. Anand Patel"
                className="w-full bg-bgElevated border border-borderColor rounded-lg pl-10 pr-4 py-2 text-sm text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-accentTeal"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-textSecondary absolute left-3.5 top-3" />
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="anand@hospital.in"
                className="w-full bg-bgElevated border border-borderColor rounded-lg pl-10 pr-4 py-2 text-sm text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-accentTeal"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-textSecondary absolute left-3 top-3" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full bg-bgElevated border border-borderColor rounded-lg pl-9 pr-3 py-2 text-sm text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-accentTeal"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-1">
                Clinical Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-bgElevated border border-borderColor rounded-lg px-3 py-2 text-sm text-textPrimary focus:outline-none focus:border-accentTeal"
              >
                <option value="doctor">Doctor</option>
                <option value="admin">Administrator</option>
                <option value="pharmacist">Pharmacist</option>
                <option value="patient">Patient</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-1">
              Password (min 8 chars)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-textSecondary absolute left-3.5 top-3" />
              <input
                type="password"
                required
                name="password"
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-bgElevated border border-borderColor rounded-lg pl-10 pr-4 py-2 text-sm text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-accentTeal"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-textSecondary absolute left-3.5 top-3" />
              <input
                type="password"
                required
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-bgElevated border border-borderColor rounded-lg pl-10 pr-4 py-2 text-sm text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-accentTeal"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" loading={loading} className="w-full mt-2">
            Create Account <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <p className="text-center text-xs text-textSecondary">
          Already registered?{' '}
          <Link to="/login" className="text-accentTeal font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
