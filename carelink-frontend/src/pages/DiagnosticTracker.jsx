import React, { useState, useEffect } from 'react';
import { TestTube2, AlertTriangle, CheckCircle2, Clock, Eye, Filter } from 'lucide-react';
import api from '../utils/api';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import ResultModal from '../components/diagnostics/ResultModal';

export default function DiagnosticTracker() {
  const [diagnostics, setDiagnostics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState(null);
  const [classificationFilter, setClassificationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchDiagnostics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (classificationFilter) params.append('classification', classificationFilter);
      if (statusFilter) params.append('status', statusFilter);

      const res = await api.get(`/diagnostics?${params.toString()}`);
      if (res.data?.data) {
        setDiagnostics(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching diagnostics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, [classificationFilter, statusFilter]);

  const urgentCount = diagnostics.filter(d => d.classification === 'urgent' && d.status !== 'action_taken').length;
  const reviewNeededCount = diagnostics.filter(d => d.classification === 'review_needed' && d.status !== 'action_taken').length;

  return (
    <PageContainer>
      {/* Top 3 Diagnostic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Diagnostic Tests"
          value={diagnostics.length}
          icon={TestTube2}
          variant="teal"
        />
        <StatCard
          title="Urgent Unreviewed Results"
          value={urgentCount}
          icon={AlertTriangle}
          variant={urgentCount > 0 ? 'danger' : 'default'}
        />
        <StatCard
          title="Awaiting Clinician Review"
          value={reviewNeededCount}
          icon={Clock}
          variant={reviewNeededCount > 0 ? 'warning' : 'default'}
        />
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-6 text-xs text-textSecondary">
            <span className="font-bold text-textPrimary">Continuous Diagnostic Follow-up</span>: Ensuring critical test results are not lost between lab completion and clinical review.
          </div>

          <div className="sm:col-span-3">
            <select
              value={classificationFilter}
              onChange={(e) => setClassificationFilter(e.target.value)}
              className="w-full bg-bgElevated border border-borderColor rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentTeal"
            >
              <option value="">All Classifications</option>
              <option value="urgent">Urgent / Critical Biomarkers</option>
              <option value="review_needed">Review Needed</option>
              <option value="normal">Normal Reference</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-bgElevated border border-borderColor rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentTeal"
            >
              <option value="">All Statuses</option>
              <option value="completed">Completed (Awaiting Review)</option>
              <option value="reviewed">Reviewed by Clinician</option>
              <option value="patient_informed">Patient Informed</option>
              <option value="action_taken">Action Taken (Closed)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Diagnostic Results Table */}
      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-textSecondary animate-pulse">
            Loading diagnostic records...
          </div>
        ) : diagnostics.length === 0 ? (
          <div className="p-12 text-center text-xs text-textSecondary">
            No diagnostic tests matching the filter parameters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-borderColor text-textSecondary uppercase tracking-wider bg-bgElevated/30">
                <tr>
                  <th className="py-3 px-4 font-semibold">Patient</th>
                  <th className="py-3 px-4 font-semibold">Test Name</th>
                  <th className="py-3 px-4 font-semibold">Result & Normal Range</th>
                  <th className="py-3 px-4 font-semibold">AI Classification</th>
                  <th className="py-3 px-4 font-semibold">Lifecycle Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderColor/60">
                {diagnostics.map((diag) => {
                  const isUrgent = diag.classification === 'urgent';
                  const classVariant = isUrgent ? 'danger' : (diag.classification === 'review_needed' ? 'warning' : 'success');

                  return (
                    <tr
                      key={diag._id}
                      onClick={() => setSelectedDiagnostic(diag)}
                      className={`hover:bg-bgElevated/50 transition-colors cursor-pointer ${
                        isUrgent && diag.status !== 'action_taken' ? 'bg-dangerDim/20' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-textPrimary">{diag.patientId?.name || 'Patient'}</div>
                        <div className="text-[11px] text-textSecondary font-mono">{diag.patientId?.abhaId}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-textPrimary">{diag.testName}</span>
                        <div className="text-[10px] text-textSecondary">
                          Ordered: {new Date(diag.orderedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-textPrimary">{diag.resultValue || 'Awaiting lab value'}</div>
                        <div className="text-[10px] text-textSecondary">Ref: {diag.normalRange || 'Standard'}</div>
                      </td>

                      <td className="py-3.5 px-4" title={diag.classificationReason}>
                        <Badge variant={classVariant} size="sm" className="cursor-help">
                          {diag.classification?.toUpperCase()}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="capitalize text-[11px] font-medium text-textPrimary bg-bgElevated px-2.5 py-1 rounded-md border border-borderColor">
                          {diag.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDiagnostic(diag);
                          }}
                          className="font-bold text-accentTeal hover:underline"
                        >
                          Review →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal View for Detail & Action */}
      <ResultModal
        diagnostic={selectedDiagnostic}
        isOpen={!!selectedDiagnostic}
        onClose={() => setSelectedDiagnostic(null)}
        onUpdated={fetchDiagnostics}
      />
    </PageContainer>
  );
}
