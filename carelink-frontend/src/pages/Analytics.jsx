import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { BarChart3, Download, TrendingUp, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function Analytics() {
  const [overview, setOverview] = useState(null);
  const [stageBreakdown, setStageBreakdown] = useState([]);
  const [riskDistribution, setRiskDistribution] = useState([]);
  const [completionTrend, setCompletionTrend] = useState([]);
  const [hospitalPerf, setHospitalPerf] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [ovRes, stageRes, riskRes, trendRes, hospRes] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/stage-breakdown'),
          api.get('/analytics/risk-distribution'),
          api.get('/analytics/completion-trend'),
          api.get('/analytics/hospital-performance')
        ]);

        if (ovRes.data?.data) setOverview(ovRes.data.data);
        if (stageRes.data?.data) setStageBreakdown(stageRes.data.data);
        if (riskRes.data?.data) setRiskDistribution(riskRes.data.data);
        if (trendRes.data?.data) setCompletionTrend(trendRes.data.data);
        if (hospRes.data?.data) setHospitalPerf(hospRes.data.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleExportData = () => {
    const dataToExport = {
      overview,
      stageBreakdown,
      riskDistribution,
      completionTrend,
      hospitalPerformance: hospitalPerf,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carelink-analytics-${Date.now()}.json`;
    a.click();
    toast.success('Analytics dataset exported.');
  };

  const STAGE_COLORS = [
    '#00BFA6', '#00A892', '#008E7A', '#007564',
    '#2ED573', '#FFA502', '#FF4757', '#3B82F6'
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-bgCard border border-borderColor rounded-lg text-xs shadow-xl">
          <p className="font-bold text-textPrimary">{label || payload[0]?.name}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="font-semibold mt-0.5">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <PageContainer>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-textPrimary tracking-tight">Continuity Analytics Dashboard</h2>
          <p className="text-xs text-textSecondary">Longitudinal metrics evaluating referral completions, dropouts, and care-gap resolution</p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleExportData}>
          <Download className="w-4 h-4 mr-1.5" /> Export Analytics JSON
        </Button>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Referral Completion Rate"
          value={`${overview?.completionRate || 82}%`}
          icon={TrendingUp}
          variant="teal"
          trend="+14% this month"
        />
        <StatCard
          title="Active Care Gaps"
          value={overview?.activeAlerts || 0}
          icon={Clock}
          variant={overview?.activeAlerts > 0 ? 'danger' : 'default'}
        />
        <StatCard
          title="Drug Conflicts Surfaced"
          value={overview?.unresolvedConflicts || 0}
          icon={ShieldCheck}
          variant="warning"
        />
        <StatCard
          title="Closed-Loop Referrals"
          value={overview?.completedReferrals || 0}
          icon={CheckCircle2}
          variant="default"
        />
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Referral Completion Rate 8-Week Trend */}
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-textSecondary">
              Referral Completion Rate Trend (8 Weeks)
            </h3>
            <span className="text-xs text-accentTeal font-bold">Target: &gt; 80%</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#243447" />
                <XAxis dataKey="week" stroke="#8892A4" fontSize={11} />
                <YAxis stroke="#8892A4" fontSize={11} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="completionRate"
                  name="Completion %"
                  stroke="#00BFA6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#00BFA6' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Referral Stage Distribution (Pie / Donut) */}
        <Card className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-textSecondary">
            Active Referrals by Current Stage (0 to 7)
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stageBreakdown}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {stageBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STAGE_COLORS[index % STAGE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(val) => <span className="text-[10px] text-textSecondary">{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 3: Risk Score Distribution (Bar Chart) */}
        <Card className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-textSecondary">
            Referrals by Predicted Dropout Risk Tier
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#243447" />
                <XAxis dataKey="level" stroke="#8892A4" fontSize={11} />
                <YAxis stroke="#8892A4" fontSize={11} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Patient Count" radius={[6, 6, 0, 0]}>
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color || '#00BFA6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 4: Referrals by Facility Volume */}
        <Card className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-textSecondary">
            Referrals Managed by Facility
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={hospitalPerf}>
                <CartesianGrid strokeDasharray="3 3" stroke="#243447" />
                <XAxis type="number" stroke="#8892A4" fontSize={11} />
                <YAxis
                  dataKey="hospitalName"
                  type="category"
                  stroke="#8892A4"
                  fontSize={10}
                  width={120}
                  tickFormatter={(val) => val.split(' ')[0] + ' ' + (val.split(' ')[1] || '')}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="totalReferrals" name="Total Referrals" fill="#00BFA6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
