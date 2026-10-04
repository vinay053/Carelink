import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [escalationHours, setEscalationHours] = useState(24);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    toast.success('Profile preferences updated.');
  };

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-black text-textPrimary tracking-tight">System Preferences & Settings</h2>
          <p className="text-xs text-textSecondary">Manage account details, notification escalation rules, and facility parameters</p>
        </div>

        {/* User Profile Form */}
        <Card className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-textSecondary">User Profile Details</h3>

          <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-textSecondary uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-bgElevated border border-borderColor rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentTeal"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-textSecondary uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                readOnly
                value={user?.email || ''}
                className="w-full bg-bgElevated border border-borderColor rounded-lg px-3 py-2 text-xs text-textSecondary cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-textSecondary uppercase tracking-wider mb-1">
                Emergency Dispatch Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9826011111"
                className="w-full bg-bgElevated border border-borderColor rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentTeal"
              />
            </div>

            <div className="pt-2 text-right">
              <Button type="submit" variant="primary" size="sm">Save Profile</Button>
            </div>
          </form>
        </Card>

        {/* Care Gap Escalation SLAs */}
        <Card className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-textSecondary">
            Care Gap Escalation Parameters
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-bgElevated border border-borderColor">
              <div>
                <span className="font-bold text-textPrimary block">Automatic SMS Alert Dispatch</span>
                <span className="text-[11px] text-textSecondary">Send automated SMS to clinicians when referral stages are overdue</span>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="rounded bg-bgCard border-borderColor text-accentTeal focus:ring-accentTeal w-4 h-4 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-textSecondary uppercase tracking-wider mb-1">
                High-Urgency Stage SLA Window (Hours)
              </label>
              <input
                type="number"
                value={escalationHours}
                onChange={(e) => setEscalationHours(Number(e.target.value))}
                className="w-full bg-bgElevated border border-borderColor rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentTeal"
              />
              <span className="text-[10px] text-textSecondary mt-1 block">
                Standard configured SLA: Critical (12h), High (24h), Medium (48h), Low (72h).
              </span>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
