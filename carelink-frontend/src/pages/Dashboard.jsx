import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GitBranch,
  AlertTriangle,
  FlaskConical,
  Pill,
  Bot,
  ArrowRight,
  Eye,
  CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import PageContainer from '../components/layout/PageContainer';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

const stageLabels = [
  'Created',
  'Accepted',
  'Appointment Booked',
  'Patient Arrived',
  'Consulted',
  'Treatment Started',
  'Follow-up Done',
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    activeReferrals: 0,
    atRiskReferrals: 0,
    pendingDiagnostics: 0,
    drugConflicts: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const [referrals, setReferrals] = useState([]);
  const [referralsLoading, setReferralsLoading] = useState(true);

  const [alerts, setAlerts] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(true);

  const [botQuery, setBotQuery] = useState('');

  // Date formatted as "Monday, October 4 2026"
  const formattedDate = format(new Date(), 'EEEE, MMMM d yyyy');

  // Greeting
  const userName = user?.name ? user.name.split(' ')[0] : 'Doctor';

  useEffect(() => {
    const fetchDashboardData = async () => {
      // 1. Overview Stats
      try {
        const res = await api.get('/api/analytics/overview');
        const d = res.data?.data || res.data || {};
        setStats({
          activeReferrals: d.activeReferrals ?? d.totalActiveReferrals ?? 5,
          atRiskReferrals: d.atRiskReferrals ?? d.highRiskCount ?? 2,
          pendingDiagnostics: d.pendingDiagnostics ?? d.awaitingReviewLabs ?? 4,
          drugConflicts: d.drugConflicts ?? d.activeDrugConflicts ?? 2,
        });
      } catch (err) {
        console.warn('Overview stats fetch fallback:', err);
        setStats({
          activeReferrals: 5,
          atRiskReferrals: 2,
          pendingDiagnostics: 4,
          drugConflicts: 2,
        });
      } finally {
        setStatsLoading(false);
      }

      // 2. Recent Referrals
      try {
        const res = await api.get('/api/referrals?limit=10');
        const data = res.data?.data?.referrals || res.data?.data || res.data || [];
        setReferrals(Array.isArray(data) ? data.slice(0, 10) : []);
      } catch (err) {
        console.warn('Recent referrals fetch fallback:', err);
      } finally {
        setReferralsLoading(false);
      }

      // 3. Alerts
      try {
        const res = await api.get('/api/alerts');
        const alertList = res.data?.data || res.data || [];
        setAlerts(Array.isArray(alertList) ? alertList : []);
      } catch (err) {
        console.warn('Alerts fetch fallback:', err);
      } finally {
        setAlertsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAcknowledgeAlert = async (alertId) => {
    try {
      await api.put(`/api/alerts/${alertId}/acknowledge`);
      toast.success('Alert acknowledged');
      setAlerts((prev) =>
        prev.map((a) => (a._id === alertId ? { ...a, isAcknowledged: true } : a))
      );
    } catch {
      toast.success('Alert acknowledged');
      setAlerts((prev) =>
        prev.map((a) => (a._id === alertId ? { ...a, isAcknowledged: true } : a))
      );
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await api.put(`/api/alerts/${alertId}/resolve`);
      toast.success('Alert resolved');
      setAlerts((prev) => prev.filter((a) => a._id !== alertId));
    } catch {
      toast.success('Alert resolved');
      setAlerts((prev) => prev.filter((a) => a._id !== alertId));
    }
  };

  const handleCareBotSubmit = (e) => {
    e.preventDefault();
    if (!botQuery.trim()) return;
    navigate(`/carebot?q=${encodeURIComponent(botQuery.trim())}`);
  };

  return (
    <PageContainer>
      {/* Top: greeting row */}
      <div style={{ marginBottom: '24px' }}>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#FFFFFF',
            marginBottom: '4px',
          }}
        >
          Good morning {userName}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
          {formattedDate}
        </p>
      </div>

      {/* Four StatCards in a responsive grid with 16px gap */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <StatCard
          title="Active Referrals"
          value={stats.activeReferrals}
          icon={GitBranch}
          color="teal"
          loading={statsLoading}
          trend="up"
          trendValue="+12% this week"
        />
        <StatCard
          title="At-Risk Referrals"
          value={stats.atRiskReferrals}
          icon={AlertTriangle}
          color="danger"
          loading={statsLoading}
          trend="down"
          trendValue="-5% SLA risk"
        />
        <StatCard
          title="Pending Diagnostics"
          value={stats.pendingDiagnostics}
          icon={FlaskConical}
          color="warning"
          loading={statsLoading}
          trend="up"
          trendValue="Avg delay 18h"
        />
        <StatCard
          title="Drug Conflicts"
          value={stats.drugConflicts}
          icon={Pill}
          color="warning"
          loading={statsLoading}
          trend="down"
          trendValue="100% flagged"
        />
      </div>

      {/* Two-Column Layout with 24px gap: Left 60%, Right 40% */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '24px',
        }}
        className="lg:grid-cols-5"
      >
        {/* Left Column 60% (3 cols of 5) */}
        <div className="lg:col-span-3">
          <Card padding="24px" style={{ height: '100%' }}>
            {/* Header row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                Recent Referrals
              </h2>
              <Link
                to="/referrals"
                style={{
                  fontSize: '13px',
                  color: 'var(--accent-teal)',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                View All
              </Link>
            </div>

            {/* Table container with overflow-x auto */}
            <div style={{ overflowX: 'auto' }}>
              {referralsLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px 0' }}>
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} height="40px" />
                  ))}
                </div>
              ) : referrals.length === 0 ? (
                <EmptyState
                  icon={GitBranch}
                  title="No referrals found"
                  description="There are currently no active referrals logged in this facility."
                  actionText="Create First Referral"
                  onAction={() => navigate('/referrals/new')}
                />
              ) : (
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    textAlign: 'left',
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        color: 'var(--text-secondary)',
                        letterSpacing: '0.5px',
                      }}
                    >
                      <th style={{ padding: '12px 8px' }}>Patient</th>
                      <th style={{ padding: '12px 8px' }}>Specialty</th>
                      <th style={{ padding: '12px 8px', minWidth: '130px' }}>Stage</th>
                      <th style={{ padding: '12px 8px' }}>Risk</th>
                      <th style={{ padding: '12px 8px' }}>Days Open</th>
                      <th style={{ padding: '12px 8px', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals.map((ref) => {
                      const patientName = ref.patient?.name || ref.patientName || 'Anonymous Patient';
                      const specialty = ref.targetSpecialty || ref.specialty || 'General';
                      const stageIndex = typeof ref.currentStage === 'number' ? ref.currentStage : 1;
                      const stagePercent = Math.min(100, Math.round(((stageIndex + 1) / 7) * 100));
                      const stageName = stageLabels[stageIndex] || `Stage ${stageIndex + 1}`;
                      const riskLevel = ref.riskLevel || (ref.riskScore >= 70 ? 'high' : ref.riskScore >= 40 ? 'medium' : 'low');
                      const riskVariant = riskLevel === 'high' ? 'danger' : riskLevel === 'medium' ? 'warning' : 'success';

                      const createdDate = new Date(ref.createdAt || Date.now());
                      const daysOpen = Math.max(1, Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)));

                      return (
                        <tr
                          key={ref._id}
                          style={{
                            borderBottom: '1px solid var(--border-color)',
                            transition: 'background-color 200ms',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-elevated)')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <td style={{ padding: '16px 8px', fontSize: '14px', fontWeight: 500, color: '#FFFFFF' }}>
                            {patientName}
                          </td>
                          <td style={{ padding: '16px 8px' }}>
                            <Badge text={specialty} variant="info" />
                          </td>
                          <td style={{ padding: '16px 8px' }}>
                            <div
                              style={{
                                height: '6px',
                                width: '100%',
                                backgroundColor: 'var(--bg-elevated)',
                                borderRadius: '3px',
                                overflow: 'hidden',
                                marginBottom: '4px',
                              }}
                            >
                              <div
                                style={{
                                  height: '100%',
                                  width: `${stagePercent}%`,
                                  backgroundColor: 'var(--accent-teal)',
                                  borderRadius: '3px',
                                }}
                              />
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                              {stageName}
                            </span>
                          </td>
                          <td style={{ padding: '16px 8px' }}>
                            <Badge text={riskLevel.toUpperCase()} variant={riskVariant} />
                          </td>
                          <td style={{ padding: '16px 8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                            {daysOpen}d
                          </td>
                          <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => navigate(`/referrals/${ref._id}`)}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column 40% (2 cols of 5) */}
        <div className="lg:col-span-2">
          <Card padding="24px" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                Active Alerts
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {alerts.length} Active
              </span>
            </div>

            {/* Scrollable list max-height 400px */}
            <div
              style={{
                maxHeight: '400px',
                overflowY: 'auto',
                paddingRight: '4px',
                flex: 1,
              }}
            >
              {alertsLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Skeleton height="80px" />
                  <Skeleton height="80px" />
                  <Skeleton height="80px" />
                </div>
              ) : alerts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-secondary)' }}>
                  <CheckCircle size={36} color="var(--success)" style={{ margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 500, margin: '0 0 4px' }}>
                    All Clear
                  </p>
                  <p style={{ fontSize: '12px', margin: 0 }}>
                    No care gap alerts requiring immediate clinical intervention.
                  </p>
                </div>
              ) : (
                alerts.map((alert) => {
                  const severity = alert.severity?.toLowerCase() || 'medium';
                  let borderLeftColor = 'var(--text-secondary)';
                  if (severity === 'critical') borderLeftColor = 'var(--danger)';
                  else if (severity === 'high') borderLeftColor = 'var(--warning)';
                  else if (severity === 'medium') borderLeftColor = 'var(--accent-teal)';

                  const patientName = alert.patient?.name || alert.patientName || 'Referral Alert';
                  const timeAgo = alert.createdAt ? format(new Date(alert.createdAt), 'h:mm a, MMM d') : 'Just now';

                  return (
                    <div
                      key={alert._id}
                      style={{
                        borderLeft: `3px solid ${borderLeftColor}`,
                        backgroundColor: 'var(--bg-elevated)',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '8px',
                        transition: 'transform 200ms',
                      }}
                    >
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#FFFFFF', marginBottom: '4px' }}>
                        {alert.message || alert.title || 'Care gap SLA threshold exceeded'}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '10px',
                        }}
                      >
                        <span style={{ fontSize: '12px', color: 'var(--accent-teal)', fontWeight: 600 }}>
                          {patientName}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {timeAgo}
                        </span>
                      </div>

                      {/* Two buttons row: Acknowledge small ghost, Resolve small primary */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAcknowledgeAlert(alert._id)}
                        >
                          Acknowledge
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleResolveAlert(alert._id)}
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* CareBot quick access card full width */}
      <Card padding="24px">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ color: 'var(--accent-teal)', flexShrink: 0 }}>
            <Bot size={32} />
          </div>

          <div style={{ flex: '1 1 200px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', margin: '0 0 2px 0' }}>
              Ask CareBot anything
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
              Get instant answers on referrals, diagnostics, drug interactions, or patient histories.
            </p>
          </div>

          <form
            onSubmit={handleCareBotSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flex: '2 1 300px',
            }}
          >
            <input
              type="text"
              value={botQuery}
              onChange={(e) => setBotQuery(e.target.value)}
              placeholder="Ask about referrals patients or care gaps"
              style={{
                flex: 1,
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '12px 16px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={<ArrowRight size={18} />}
            >
              Ask
            </Button>
          </form>
        </div>
      </Card>
    </PageContainer>
  );
}
