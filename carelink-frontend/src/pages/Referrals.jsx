import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, ArrowUpRight, GitPullRequest } from 'lucide-react';
import api from '../utils/api';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { STAGE_SHORT_NAMES } from '../utils/constants';

export default function Referrals() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const navigate = useNavigate();

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (riskFilter) params.append('riskLevel', riskFilter);

      const res = await api.get(`/referrals?${params.toString()}`);
      if (res.data?.data) {
        setReferrals(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching referrals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, [statusFilter, riskFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReferrals();
  };

  return (
    <PageContainer>
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-textPrimary tracking-tight">Referral Trajectories</h2>
          <p className="text-xs text-textSecondary">Continuous tracking of patient transfers between healthcare facilities</p>
        </div>
        <Link to="/referrals/new">
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" /> Initiate New Referral
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-textSecondary absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient name or ABHA ID..."
              className="w-full bg-bgElevated border border-borderColor rounded-lg pl-10 pr-4 py-2 text-xs text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-accentTeal"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full bg-bgElevated border border-borderColor rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentTeal"
            >
              <option value="">All Risk Tiers</option>
              <option value="high">High Dropout Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-bgElevated border border-borderColor rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentTeal"
            >
              <option value="">All Stages / Statuses</option>
              <option value="created">Created (Awaiting Acceptance)</option>
              <option value="accepted">Accepted (Pending Appt)</option>
              <option value="appointment_booked">Appointment Booked</option>
              <option value="patient_arrived">Patient Arrived</option>
              <option value="specialist_consulted">Specialist Consulted</option>
              <option value="follow_up_done">Follow-up Completed</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </form>
      </Card>

      {/* Referrals List Table */}
      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-textSecondary animate-pulse">
            Loading active referral records...
          </div>
        ) : referrals.length === 0 ? (
          <div className="p-12 text-center text-xs text-textSecondary">
            No referral records matching the specified filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-borderColor text-textSecondary uppercase tracking-wider bg-bgElevated/30">
                <tr>
                  <th className="py-3 px-4 font-semibold">Patient</th>
                  <th className="py-3 px-4 font-semibold">Referring → Target</th>
                  <th className="py-3 px-4 font-semibold">Specialty & Urgency</th>
                  <th className="py-3 px-4 font-semibold">Stage Progress</th>
                  <th className="py-3 px-4 font-semibold">Risk Score</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderColor/60">
                {referrals.map((ref) => {
                  const riskVariant = ref.riskLevel === 'high' ? 'danger' : (ref.riskLevel === 'medium' ? 'warning' : 'success');
                  const currentStage = ref.currentStage || 0;
                  const progressPercent = Math.min(100, Math.round(((currentStage + 1) / 8) * 100));

                  return (
                    <tr
                      key={ref._id}
                      onClick={() => navigate(`/referrals/${ref._id}`)}
                      className="hover:bg-bgElevated/50 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-textPrimary">{ref.patientId?.name || 'Patient'}</div>
                        <div className="text-[11px] text-textSecondary">{ref.patientId?.abhaId}</div>
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-textSecondary">
                        <div className="truncate max-w-[150px] font-medium text-textPrimary">
                          {ref.referringHospitalId?.name || 'Referring Center'}
                        </div>
                        <div className="text-accentTeal truncate max-w-[150px]">
                          → {ref.targetHospitalId?.name || 'Target Hospital'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-textPrimary">{ref.targetSpecialty}</div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          ref.urgency === 'critical' ? 'text-danger animate-pulse' : (ref.urgency === 'high' ? 'text-danger' : 'text-textSecondary')
                        }`}>
                          {ref.urgency} Urgency
                        </span>
                      </td>

                      <td className="py-3.5 px-4 min-w-[160px]">
                        <div className="flex items-center justify-between text-[10px] text-textSecondary mb-1 font-semibold">
                          <span>{STAGE_SHORT_NAMES[currentStage] || `Stage ${currentStage}`}</span>
                          <span className="text-accentTeal">{currentStage + 1}/8</span>
                        </div>
                        <div className="w-full bg-bgElevated h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              ref.status === 'closed' || ref.status === 'follow_up_done'
                                ? 'bg-success'
                                : (ref.riskLevel === 'high' ? 'bg-danger' : 'bg-accentTeal')
                            }`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge variant={riskVariant} size="sm">
                          {ref.riskScore} • {ref.riskLevel?.toUpperCase()}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/referrals/${ref._id}`}
                          className="inline-flex items-center gap-1 font-bold text-accentTeal hover:underline"
                        >
                          View Detail <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </PageContainer>
  );
}
