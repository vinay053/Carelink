import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { AlertTriangle, CheckCircle2, UserCheck, Stethoscope } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function ResultModal({ diagnostic, isOpen, onClose, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const [actionNotes, setActionNotes] = useState('');

  if (!diagnostic) return null;

  const handleUpdateStatus = async (newStatus) => {
    setLoading(true);
    try {
      await api.put(`/diagnostics/${diagnostic._id}/status`, {
        status: newStatus,
        actionNotes: actionNotes || undefined
      });
      toast.success(`Diagnostic status updated to ${newStatus.replace('_', ' ')}`);
      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const classVariant = diagnostic.classification === 'urgent'
    ? 'danger'
    : (diagnostic.classification === 'review_needed' ? 'warning' : 'success');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Diagnostic Result: ${diagnostic.testName}`}>
      <div className="space-y-4 text-xs">
        {/* Patient Header */}
        <div className="flex justify-between items-center pb-3 border-b border-borderColor">
          <div>
            <p className="font-bold text-textPrimary text-sm">{diagnostic.patientId?.name || 'Patient'}</p>
            <p className="text-textSecondary font-mono">{diagnostic.patientId?.abhaId}</p>
          </div>
          <Badge variant={classVariant} size="md">
            {diagnostic.classification?.toUpperCase()}
          </Badge>
        </div>

        {/* Result & Normal Range */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-bgElevated border border-borderColor">
          <div>
            <span className="text-[10px] text-textSecondary uppercase font-bold block">Reported Value</span>
            <p className="text-sm font-extrabold text-accentTeal mt-0.5">{diagnostic.resultValue || 'Pending result'}</p>
          </div>
          <div>
            <span className="text-[10px] text-textSecondary uppercase font-bold block">Normal Reference Range</span>
            <p className="text-xs font-medium text-textPrimary mt-0.5">{diagnostic.normalRange || 'Standard reference'}</p>
          </div>
        </div>

        {/* AI Clinical Reasoning */}
        {diagnostic.classificationReason && (
          <div className="p-3 rounded-xl bg-bgCard border border-borderColor space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-textSecondary flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-accentTeal" /> Clinical Reason / Interpretation
            </span>
            <p className="text-textPrimary leading-relaxed">
              {diagnostic.classificationReason}
            </p>
            {diagnostic.keyFindings && diagnostic.keyFindings.length > 0 && (
              <ul className="list-disc list-inside mt-2 text-[11px] text-textSecondary space-y-0.5">
                {diagnostic.keyFindings.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Clinical Action Input */}
        <div>
          <label className="block text-[11px] font-semibold text-textSecondary uppercase tracking-wider mb-1">
            Clinical Action Notes (for Action Taken)
          </label>
          <textarea
            rows={2}
            value={actionNotes}
            onChange={(e) => setActionNotes(e.target.value)}
            placeholder="e.g. Telephonic notification completed; patient scheduled for urgent echocardiogram."
            className="w-full bg-bgElevated border border-borderColor rounded-lg p-2.5 text-xs text-textPrimary focus:outline-none focus:border-accentTeal"
          />
        </div>

        {/* Status Stepper Progression Actions */}
        <div className="pt-2 flex flex-wrap gap-2 justify-end">
          {diagnostic.status === 'completed' && (
            <Button
              variant="outline"
              size="sm"
              loading={loading}
              onClick={() => handleUpdateStatus('reviewed')}
            >
              <UserCheck className="w-3.5 h-3.5 mr-1" /> Mark Clinician Reviewed
            </Button>
          )}

          {diagnostic.status === 'reviewed' && (
            <Button
              variant="secondary"
              size="sm"
              loading={loading}
              onClick={() => handleUpdateStatus('patient_informed')}
            >
              Mark Patient Informed
            </Button>
          )}

          {diagnostic.status !== 'action_taken' && (
            <Button
              variant="primary"
              size="sm"
              loading={loading}
              onClick={() => handleUpdateStatus('action_taken')}
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Action Taken & Close Gap
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
