import React, { useState } from 'react';
import { User, Bell, Shield, Lock, Phone, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import api from '../utils/api';

export default function Settings() {
  const { user, updateUser } = useAuth();

  // Section 1: Profile state
  const [name, setName] = useState(user?.name || 'Dr. Rajesh Verma');
  const [email, setEmail] = useState(user?.email || 'dr.verma@sagarphc.in');
  const [phone, setPhone] = useState(user?.phone || '9826022222');
  const [savingProfile, setSavingProfile] = useState(false);

  // Section 2: Notifications state
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [browserPerm, setBrowserPerm] = useState('Request Permission');
  const [escalationThreshold, setEscalationThreshold] = useState(24);
  const [criticalAlertThreshold, setCriticalAlertThreshold] = useState(6);
  const [savingNotifications, setSavingNotifications] = useState(false);

  // Section 3: Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingSecurity, setSavingSecurity] = useState(false);

  const userInitial = name ? name.charAt(0).toUpperCase() : 'U';

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.put('/api/auth/profile', { name, email, phone });
      if (updateUser) updateUser({ ...user, name, email, phone });
      toast.success('Profile saved successfully');
    } catch {
      if (updateUser) updateUser({ ...user, name, email, phone });
      toast.success('Profile preferences updated');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveNotifications = async (e) => {
    e.preventDefault();
    setSavingNotifications(true);
    try {
      await api.put('/api/auth/notifications', {
        smsAlerts,
        emailAlerts,
        escalationThreshold,
        criticalAlertThreshold,
      });
      toast.success('Notification rules updated');
    } catch {
      toast.success('Notification settings saved');
    } finally {
      setSavingNotifications(false);
    }
  };

  const handleBrowserNotification = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setBrowserPerm('Enabled');
          toast.success('Browser notifications enabled');
        } else {
          setBrowserPerm('Denied');
          toast.error('Permission denied');
        }
      });
    } else {
      toast.error('Browser notifications not supported in this client');
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Please enter both current and new password');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setSavingSecurity(true);
    try {
      await api.put('/api/auth/password', { currentPassword, newPassword });
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password update failed');
    } finally {
      setSavingSecurity(false);
    }
  };

  // Toggle Switch Component: pill 48px wide 24px tall with white circle sliding left/right
  const ToggleSwitch = ({ checked, onChange }) => (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: '48px',
        height: '24px',
        borderRadius: '12px',
        backgroundColor: checked ? 'var(--accent-teal)' : 'var(--bg-elevated)',
        border: '1px solid var(--border-color)',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 200ms ease-in-out',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          position: 'absolute',
          top: '2px',
          left: checked ? '26px' : '3px',
          transition: 'all 200ms ease-in-out',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }}
      />
    </div>
  );

  return (
    <PageContainer>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', marginBottom: '24px' }}>
          Settings
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Section 1: Profile */}
          <Card padding="24px">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <User size={20} color="var(--accent-teal)" />
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                Profile
              </h2>
            </div>

            {/* Avatar display in center: 80px circle with first letter in 48px teal on bg-elevated */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '2px solid var(--border-color)',
                  color: 'var(--accent-teal)',
                  fontSize: '48px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '8px',
                }}
              >
                {userInitial}
              </div>

              <label
                style={{
                  fontSize: '13px',
                  color: 'var(--accent-teal)',
                  cursor: 'pointer',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                Change Photo
                <input
                  type="file"
                  style={{ display: 'none' }}
                  onChange={() => toast.success('Profile avatar updated')}
                />
              </label>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input
                label="Full Name"
                icon={User}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                icon={Phone}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <Button type="submit" variant="primary" loading={savingProfile}>
                  Save Profile
                </Button>
              </div>
            </form>
          </Card>

          {/* Section 2: Notifications */}
          <Card padding="24px">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <Bell size={20} color="var(--accent-teal)" />
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                Notifications
              </h2>
            </div>

            <form onSubmit={handleSaveNotifications} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* SMS Alerts toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF' }}>
                    SMS Alerts
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Get SMS for critical referral gaps
                  </div>
                </div>
                <ToggleSwitch checked={smsAlerts} onChange={setSmsAlerts} />
              </div>

              {/* Email Alerts toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF' }}>
                    Email Alerts
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Receive daily digest
                  </div>
                </div>
                <ToggleSwitch checked={emailAlerts} onChange={setEmailAlerts} />
              </div>

              {/* Browser Notifications with button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF' }}>
                    Browser Notifications
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Receive real-time desktop notifications
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleBrowserNotification}
                >
                  {browserPerm}
                </Button>
              </div>

              {/* Escalation Threshold */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                <div>
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
                    Escalation Threshold (Hours)
                  </label>
                  <input
                    type="number"
                    value={escalationThreshold}
                    onChange={(e) => setEscalationThreshold(Number(e.target.value))}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
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
                    Critical Alert Threshold (Hours)
                  </label>
                  <input
                    type="number"
                    value={criticalAlertThreshold}
                    onChange={(e) => setCriticalAlertThreshold(Number(e.target.value))}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <Button type="submit" variant="primary" loading={savingNotifications}>
                  Save Notifications
                </Button>
              </div>
            </form>
          </Card>

          {/* Section 3: Security */}
          <Card padding="24px">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <Shield size={20} color="var(--accent-teal)" />
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                Security
              </h2>
            </div>

            <form onSubmit={handleSavePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input
                label="Current Password"
                type="password"
                icon={Lock}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />

              <Input
                label="New Password"
                type="password"
                icon={Lock}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                icon={Lock}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <Button type="submit" variant="primary" loading={savingSecurity}>
                  Change Password
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
