import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

export default function Login() {
  const [email, setEmail] = useState('dr.verma@sagarphc.in');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        toast.success(`Welcome back, ${result.user?.name || 'Doctor'}!`);
        navigate('/dashboard');
      } else {
        const err = result.message || 'Invalid credentials. Please try again.';
        setErrorMessage(err);
        toast.error(err);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed.';
      setErrorMessage(msg);
      toast.error(msg);
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
        padding: '24px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--bg-card)',
          border: '2px solid var(--border-color)',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* Top: CareLink logo centered */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
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

        {/* Welcome back in 24px 700 white centered */}
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: '6px',
          }}
        >
          Welcome back
        </h2>

        {/* Sign in to your account in 14px var text-secondary centered */}
        <p
          style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            textAlign: 'center',
            marginBottom: '28px',
          }}
        >
          Sign in to your account
        </p>

        {/* Form below with 24px gap between fields */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Email input with Mail icon */}
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="doctor@carelink.in"
            icon={Mail}
            required
          />

          {/* Password input with Lock icon and clickable Eye toggle */}
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            icon={Lock}
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

          {/* Row with Remember me checkbox left-aligned, Forgot password link right-aligned */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '13px',
              marginTop: '-6px',
            }}
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  accentColor: 'var(--accent-teal)',
                  cursor: 'pointer',
                }}
              />
              <span>Remember me</span>
            </label>

            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                toast('Contact state coordinator admin to reset credential credentials.');
              }}
              style={{
                color: 'var(--accent-teal)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Forgot password?
            </a>
          </div>

          {/* Login button full width primary below */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : 'Login'}
          </Button>

          {/* Divider with OR centered between two lines */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
            <span style={{ padding: '0 12px', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
              OR
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
          </div>

          {/* Demo account quick login helper */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEmail('admin@carelink.in');
                setPassword('password123');
              }}
            >
              Admin Demo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEmail('dr.patel@jabalpurmc.in');
                setPassword('password123');
              }}
            >
              Specialist Demo
            </Button>
          </div>

          {/* Error message area below form in var danger color if login fails */}
          {errorMessage && (
            <div
              style={{
                backgroundColor: 'var(--danger-dim)',
                border: '1px solid var(--danger)',
                color: 'var(--danger)',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                textAlign: 'center',
                fontWeight: 500,
              }}
            >
              {errorMessage}
            </div>
          )}

          {/* Bottom: Don't have an account? text then Register link in teal */}
          <div style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{
                color: 'var(--accent-teal)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
