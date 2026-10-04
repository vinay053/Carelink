import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'Doctor',
    hospitalName: 'District Hospital Jabalpur',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    // Phone must be 10 digits
    const cleanedPhone = formData.phone.replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }
    // Password min 8 chars
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    // Passwords must match
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.hospitalName.trim()) {
      newErrors.hospitalName = 'Hospital name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the validation errors.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.replace(/\D/g, ''),
        password: formData.password,
        role: formData.role.toLowerCase(),
        hospitalName: formData.hospitalName.trim(),
      };

      const result = await register(payload);
      if (result.success) {
        toast.success('Registration successful! Please login.');
        navigate('/login');
      } else {
        toast.error(result.message || 'Registration failed.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: 'var(--bg-card)',
          border: '2px solid var(--border-color)',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* Top: CareLink logo centered */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
          <div
            style={{
              position: 'relative',
              width: '12px',
              height: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-teal)',
                opacity: 0.75,
              }}
              className="animate-ping"
            />
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-teal)',
              }}
            />
          </div>
          <span style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.5px' }}>
            CARE
          </span>
          <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-teal)', letterSpacing: '-0.5px' }}>
            LINK
          </span>
        </div>

        {/* Create your account title in 24px 700 white */}
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          Create your account
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Full Name with User icon */}
          <Input
            label="Full Name"
            icon={User}
            placeholder="Dr. Siddharth Rao"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />

          {/* Email with Mail icon */}
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="siddharth.rao@hospital.in"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            required
          />

          {/* Phone with Phone icon */}
          <Input
            label="Phone (10 digits)"
            type="tel"
            icon={Phone}
            placeholder="9876543210"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={errors.phone}
            required
          />

          {/* Role as styled select element */}
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'var(--text-secondary)',
                marginBottom: '6px',
                fontWeight: 600,
              }}
            >
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              style={{
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '12px 16px',
                width: '100%',
                fontSize: '14px',
                outline: 'none',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <option value="Doctor">Doctor</option>
              <option value="Admin">Admin</option>
              <option value="Pharmacist">Pharmacist</option>
            </select>
          </div>

          {/* Hospital Name with Building2 icon */}
          <Input
            label="Hospital / Clinic Name"
            icon={Building2}
            placeholder="Netaji Subhash Chandra Bose Medical College"
            value={formData.hospitalName}
            onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
            error={errors.hospitalName}
            required
          />

          {/* Password with Lock icon and toggle */}
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            icon={Lock}
            placeholder="Min. 8 characters"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
            required
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          {/* Confirm Password with Lock icon */}
          <Input
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            icon={Lock}
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
            required
          />

          {/* Register button full width primary */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : 'Register'}
          </Button>

          {/* Already have an account login link at bottom */}
          <div style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: 'var(--accent-teal)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
