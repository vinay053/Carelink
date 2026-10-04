import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, MessageSquare, Send, CheckCircle2, AlertTriangle, Building2, User, Phone } from 'lucide-react';
import api from '../utils/api';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import RiskScore from '../components/ui/RiskScore';
import StageTrackerStepper from '../components/referrals/StageTrackerStepper';
import { STAGE_NAMES } from '../utils/constants';
import toast from 'react-hot-toast';

export default function ReferralDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [referral, setReferral] = useState(null);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Advance Stage Modal
  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false);
  const [stageNotes, setStageNotes] = useState('');
  const [advancing, setAdvancing] = useState(false);

  // SMS Modal
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [smsMessage, setSmsMessage] = useState('');
  const [sendingSms, setSendingSms] = useState(false);

  const fetchReferral = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/referrals/${id}`);
      if (res.data?.data) {
        setReferral(res.data.data.referral);
        setActiveAlerts(res.data.data.activeAlerts || []);
      }
    } catch (err) {
      toast.error('Failed to load referral details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferral();
  }, [id]);

  const handleAdvanceStage = async () => {
    setAdvancing(true);
    try {
      const nextStage = (referral.currentStage || 0) + 1;
      const res = await api.put(`/referrals/${id}/stage`, {
        stageIndex: nextStage,
        notes: stageNotes
      });

      toast.success(res.data?.message || 'Referral stage advanced successfully!');
      setIsAdvanceModalOpen(false);
      setStageNotes('');
      fetchReferral();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to advance stage');
    } finally {
      setAdvancing(false);
    }
  };

  const handleSendSms = async () => {
    setSendingSms(true);
    try {
      await api.post('/alerts/send-sms', {
        toPhone: referral.patientId?.phone || '9425010001',
        message: smsMessage || `CareLink Urgent Alert: Please attend your scheduled ${referral.targetSpecialty} consultation at ${referral.targetHospitalId?.name}.`
      });
      toast.success('SMS escalation alert dispatched successfully!');
      setIsSmsModalOpen(false);
      setSmsMessage('');
    } catch (err) {
      toast.error('Failed to dispatch SMS');
    } finally {
      setSendingSms(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="py-24 text-center text-xs text-textSecondary animate-pulse">
          Loading referral trajectory and risk state...
        </div>
      </PageContainer>
    );
  }

  if (!referral) {
    return (
      <PageContainer>
        <div className="text-center py-16">
          <p className="text-textSecondary text-sm">Referral record not found.</p>
          <Link to="/referrals">
            <Button variant="secondary" size="sm" className="mt-4">Back to Referrals</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  const isHighRisk = referral.riskLevel === 'high';
  const nextStageIndex = (referral.currentStage || 0) + 1;
  const isFinalStage = referral.currentStage >= 6;

  return (
    <PageContainer>
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/referrals')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-textSecondary hover:text-textPrimary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Referral Directory
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSmsMessage(`CareLink Reminder: Your ${referral.targetSpecialty} appointment at ${referral.targetHospitalId?.name} is ready for verification.`);
              setIsSmsModalOpen(true);
            }}
          >
            <Send className="w-3.5 h-3.5 mr-1" /> Dispatch SMS Escalation
          </Button>

          {!isFinalStage && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAdvanceModalOpen(true)}
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Advance to Next Stage
            </Button>
          )}
        </div>
      </div>

      {/* Main Header Card with subtle red glow if high risk */}
      <Card glow={isHighRisk ? 'danger' : null} className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-borderColor">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-textPrimary tracking-tight">
                {referral.patientId?.name || 'Patient'}
              </h2>
              <Badge variant={isHighRisk ? 'danger' : 'teal'} size="sm">
                {referral.riskLevel?.toUpperCase()} RISK ({referral.riskScore}/100)
              </Badge>
              <Badge variant="default" size="sm">
                {referral.urgency?.toUpperCase()} URGENCY
              </Badge>
            </div>
            <p className="text-xs text-textSecondary mt-1 font-mono">
              ABHA ID: {referral.patientId?.abhaId} • Phone: {referral.patientId?.phone || 'N/A'}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-textSecondary uppercase font-bold tracking-wider block">Specialty Target</span>
            <span className="text-base font-extrabold text-accentTeal">{referral.targetSpecialty}</span>
          </div>
        </div>

        {/* Horizontal Stage Stepper */}
        <div className="pt-2">
          <StageTrackerStepper
            currentStage={referral.currentStage || 0}
            stageTimestamps={referral.stageTimestamps || []}
          />
        </div>
      </Card>

      {/* Active Care Gap Alert Callout Banner */}
      {activeAlerts.length > 0 && (
        <div className="p-4 rounded-xl bg-dangerDim border border-danger/40 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5 animate-pulse" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-danger uppercase tracking-wider">Active Referral Gap Detected</h4>
            <p className="text-xs text-textPrimary mt-0.5">{activeAlerts[0].message}</p>
            <p className="text-[11px] text-textSecondary mt-1">
              Advancing the referral to the next stage will automatically verify handoff and resolve this care gap.
            </p>
          </div>
        </div>
      )}

      {/* Two-Column Deep Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Stage Transition Timeline & Clinical Notes (65%) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Notes Card */}
          <Card>
            <h4 className="text-xs font-bold uppercase tracking-wider text-textSecondary mb-2">
              Clinical Referral Notes & Reason for Transfer
            </h4>
            <p className="text-xs text-textPrimary bg-bgElevated p-3 rounded-lg border border-borderColor leading-relaxed">
              {referral.notes || 'Routine specialty referral initiated from primary health center.'}
            </p>
          </Card>

          {/* Stage Progression Audit Trail */}
          <Card>
            <h4 className="text-xs font-bold uppercase tracking-wider text-textSecondary mb-4">
              Stage Transition Audit Trail
            </h4>
            <div className="space-y-4">
              {referral.stageTimestamps && referral.stageTimestamps.map((st, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-accentTealDim text-accentTeal border border-accentTeal/30 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    {st.stageIndex + 1}
                  </div>
                  <div className="flex-1 p-3 rounded-lg bg-bgElevated border border-borderColor">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-textPrimary">{st.stageName}</span>
                      <span className="text-[10px] text-textSecondary">
                        {new Date(st.completedAt).toLocaleString()}
                      </span>
                    </div>
                    {st.notes && (
                      <p className="mt-1 text-textSecondary text-[11px]">{st.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Risk Factors & Facility Details (35%) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Risk Dial Card */}
          <Card>
            <h4 className="text-xs font-bold uppercase tracking-wider text-textSecondary mb-3 text-center">
              Dropout Risk Score
            </h4>
            <RiskScore
              score={referral.riskScore || 0}
              level={referral.riskLevel || 'low'}
              factors={referral.riskFactors || []}
              recommendedAction={referral.recommendedAction}
              showFactors={true}
            />
          </Card>

          {/* Facility Pair Card */}
          <Card className="space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-textSecondary mb-1">
              Participating Facilities
            </h4>

            <div className="p-2.5 rounded-lg bg-bgElevated border border-borderColor">
              <span className="text-[10px] text-textSecondary font-semibold uppercase block">Referring Center</span>
              <p className="font-bold text-textPrimary">{referral.referringHospitalId?.name || 'PHC'}</p>
              <p className="text-[11px] text-textSecondary">{referral.referringHospitalId?.district}</p>
            </div>

            <div className="p-2.5 rounded-lg bg-bgElevated border border-borderColor">
              <span className="text-[10px] text-accentTeal font-semibold uppercase block">Target Hospital</span>
              <p className="font-bold text-textPrimary">{referral.targetHospitalId?.name || 'Hospital'}</p>
              <p className="text-[11px] text-textSecondary">{referral.targetHospitalId?.district}</p>
            </div>

            <div className="pt-2 text-center">
              <Link
                to={`/patients/${referral.patientId?._id || referral.patientId}/timeline`}
                className="text-xs font-bold text-accentTeal hover:underline"
              >
                View Complete Patient Timeline →
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Advance Stage Modal */}
      <Modal
        isOpen={isAdvanceModalOpen}
        onClose={() => setIsAdvanceModalOpen(false)}
        title={`Advance Referral to Stage ${nextStageIndex}: ${STAGE_NAMES[nextStageIndex] || ''}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-textSecondary">
            Confirm that the patient has progressed to the next care stage. This action timestamps the handoff and automatically resolves any active care gaps.
          </p>

          <div>
            <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-1">
              Clinical Transition Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={stageNotes}
              onChange={(e) => setStageNotes(e.target.value)}
              placeholder="e.g., Patient attended cardiology consult with Dr. Patel; scheduled for ECG."
              className="w-full bg-bgElevated border border-borderColor rounded-lg p-3 text-xs text-textPrimary focus:outline-none focus:border-accentTeal"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setIsAdvanceModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" loading={advancing} onClick={handleAdvanceStage}>
              Confirm Progression
            </Button>
          </div>
        </div>
      </Modal>

      {/* SMS Modal */}
      <Modal
        isOpen={isSmsModalOpen}
        onClose={() => setIsSmsModalOpen(false)}
        title="Dispatch Care Gap Escalation SMS"
      >
        <div className="space-y-4">
          <p className="text-xs text-textSecondary">
            Send an urgent notification to patient <strong>{referral.patientId?.name}</strong> or local ASHA community health worker.
          </p>

          <div>
            <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-1">
              Recipient Phone
            </label>
            <input
              type="text"
              readOnly
              value={referral.patientId?.phone || '9425010001'}
              className="w-full bg-bgElevated border border-borderColor rounded-lg px-3 py-2 text-xs text-textSecondary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-1">
              SMS Notification Content
            </label>
            <textarea
              rows={4}
              value={smsMessage}
              onChange={(e) => setSmsMessage(e.target.value)}
              className="w-full bg-bgElevated border border-borderColor rounded-lg p-3 text-xs text-textPrimary focus:outline-none focus:border-accentTeal"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setIsSmsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" loading={sendingSms} onClick={handleSendSms}>
              Dispatch SMS
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
