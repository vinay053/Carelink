import React, { useState, useEffect } from 'react';
import { GitPullRequest, AlertCircle, TestTube2, Pill, Bot, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import PageContainer from '../components/layout/PageContainer';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import RecentReferralsTable from '../components/dashboard/RecentReferralsTable';
import ActiveAlertsPanel from '../components/dashboard/ActiveAlertsPanel';
import ExecutiveHeroBanner from '../components/dashboard/ExecutiveHeroBanner';
import DropoutRiskSimulator from '../components/dashboard/DropoutRiskSimulator';
import LiveTickerRibbon from '../components/common/LiveTickerRibbon';
import Button from '../components/ui/Button';

export default function Dashboard() {
  const [overview, setOverview] = useState({
    totalReferrals: 0,
    atRiskReferrals: 0,
    pendingDiagnostics: 0,
    unresolvedConflicts: 0
  });
  const [recentReferrals, setRecentReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [overviewRes, referralsRes] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/referrals?limit=10')
        ]);
        if (overviewRes.data?.data) {
          setOverview(overviewRes.data.data);
        }
        if (referralsRes.data?.data) {
          setRecentReferrals(referralsRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickPrompts = [
    'Which referrals are at risk right now?',
    'Show pending urgent diagnostic results',
    'Summarize patient Suresh Kumar journey',
    'Is there an ICU bed available in Jabalpur?'
  ];

  return (
    <PageContainer className="space-y-6">
      {/* Live System Telemetry Ticker (Kawach style) */}
      <LiveTickerRibbon className="-mx-4 sm:-mx-6 -mt-4 sm:-mt-6 rounded-none" />

      {/* Executive Hero Banner (Skill Setu style) */}
      <ExecutiveHeroBanner overview={overview} />

      {/* Top 4 Metric StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Referrals"
          value={overview.totalReferrals}
          icon={GitPullRequest}
          variant="teal"
          trend="+12%"
          onClick={() => navigate('/referrals')}
        />
        <StatCard
          title="At-Risk Referrals"
          value={overview.atRiskReferrals}
          icon={AlertCircle}
          variant={overview.atRiskReferrals > 0 ? 'danger' : 'default'}
          trend="+2 stalled"
          onClick={() => navigate('/referrals?riskLevel=high')}
        />
        <StatCard
          title="Pending Diagnostics"
          value={overview.pendingDiagnostics}
          icon={TestTube2}
          variant={overview.pendingDiagnostics > 0 ? 'warning' : 'default'}
          onClick={() => navigate('/diagnostics')}
        />
        <StatCard
          title="Drug Conflicts"
          value={overview.unresolvedConflicts}
          icon={Pill}
          variant={overview.unresolvedConflicts > 0 ? 'warning' : 'default'}
          onClick={() => navigate('/medications')}
        />
      </div>

      {/* Interactive Dropout Risk Simulator (Skill Setu Innovation Hook) */}
      <DropoutRiskSimulator />

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Recent Referrals (65%) */}
        <div className="lg:col-span-8">
          <Card className="p-0 overflow-hidden border-borderColor/80 shadow-xl">
            <div className="p-4 sm:p-5 border-b border-borderColor flex items-center justify-between bg-bgElevated/30">
              <div>
                <h3 className="text-sm font-bold text-textPrimary tracking-tight font-display">
                  Active Referral Trajectories
                </h3>
                <p className="text-xs text-textSecondary">Real-time status across healthcare handoffs</p>
              </div>
              <Link to="/referrals">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            <RecentReferralsTable referrals={recentReferrals} loading={loading} />
          </Card>
        </div>

        {/* Right Column: Active Care Gaps & Alerts (35%) */}
        <div className="lg:col-span-4">
          <div className="bg-bgCard border border-borderColor/80 rounded-2xl p-4 sm:p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-borderColor mb-4">
              <div>
                <h3 className="text-sm font-bold text-textPrimary tracking-tight font-display">
                  Live Care Gaps
                </h3>
                <p className="text-xs text-textSecondary">Stalled handoffs requiring action</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-danger/15 text-danger border border-danger/30">
                Auto-SLA
              </span>
            </div>
            <ActiveAlertsPanel />
          </div>
        </div>
      </div>

      {/* Bottom Gemini 3.5 Flash-Lite Coordinator Bar */}
      <Card className="bg-gradient-to-r from-bgCard via-bgElevated to-bgCard border-accentTeal/30 shadow-xl p-5">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accentTeal/10 border border-accentTeal/30 text-accentTeal shadow-glow-teal flex-shrink-0">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-textPrimary uppercase tracking-wider font-display">
                  Ask CareBot AI Coordinator
                </p>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accentTeal/15 text-accentTeal border border-accentTeal/30">
                  Gemini 3.5 Flash-Lite
                </span>
              </div>
              <p className="text-xs text-textSecondary mt-0.5">
                Instant reasoning on referral SLAs, patient timelines, and facility availability.
              </p>
            </div>
          </div>

          {/* Prompt Chips */}
          <div className="flex flex-wrap gap-2 justify-center">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => navigate(`/carebot?prompt=${encodeURIComponent(q)}`)}
                className="px-3 py-1.5 rounded-xl bg-bgCard hover:bg-accentTealDim border border-borderColor hover:border-accentTeal/50 text-xs text-textSecondary hover:text-accentTeal transition-all duration-150"
              >
                {q}
              </button>
            ))}
          </div>

          <Link to="/carebot" className="flex-shrink-0">
            <Button variant="primary" size="sm" className="shadow-glow-teal">
              Open Chat <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </Card>
    </PageContainer>
  );
}
