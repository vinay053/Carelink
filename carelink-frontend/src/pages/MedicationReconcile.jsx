import React, { useState, useEffect } from 'react';
import { Pill, Plus, AlertTriangle, ShieldCheck, CheckCircle2, User } from 'lucide-react';
import api from '../utils/api';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import ConflictCard from '../components/medications/ConflictCard';
import toast from 'react-hot-toast';

export default function MedicationReconcile() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [medData, setMedData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add Prescription Modal
  const [isAddRxModalOpen, setIsAddRxModalOpen] = useState(false);
  const [doctorName, setDoctorName] = useState('Dr. Sunita Patel (Cardiologist)');
  const [hospitalName, setHospitalName] = useState('Jabalpur Medical College');
  const [newDrugName, setNewDrugName] = useState('Warfarin');
  const [newDrugDose, setNewDrugDose] = useState('2.5mg');
  const [newDrugFreq, setNewDrugFreq] = useState('Once daily');
  const [submittingRx, setSubmittingRx] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('/patients');
        if (res.data?.data && res.data.data.length > 0) {
          setPatients(res.data.data);
          setSelectedPatientId(res.data.data[0]._id);
        }
      } catch (err) {
        console.error('Error fetching patients:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const fetchMedicationRecord = async (patientId) => {
    if (!patientId) return;
    try {
      const res = await api.get(`/medications/${patientId}`);
      if (res.data?.data) {
        setMedData(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching medications:', err);
    }
  };

  useEffect(() => {
    if (selectedPatientId) {
      fetchMedicationRecord(selectedPatientId);
    }
  }, [selectedPatientId]);

  const handleResolveConflict = async (conflictId) => {
    try {
      await api.put(`/medications/conflicts/${conflictId}/resolve`, {
        patientId: selectedPatientId
      });
      toast.success('Medication conflict resolved by pharmacist.');
      fetchMedicationRecord(selectedPatientId);
    } catch (err) {
      toast.error('Failed to resolve conflict');
    }
  };

  const handleAddPrescription = async (e) => {
    e.preventDefault();
    setSubmittingRx(true);
    try {
      const res = await api.post('/medications/add-prescription', {
        patientId: selectedPatientId,
        prescribedBy: doctorName,
        hospitalName,
        drugs: [
          { drugName: newDrugName, dose: newDrugDose, frequency: newDrugFreq }
        ]
      });

      if (res.data?.conflictsFlagged > 0) {
        toast.error(`⚠️ Cross-provider conflict detected: ${newDrugName}!`);
      } else {
        toast.success('Prescription added cleanly with 0 detected interactions.');
      }

      setIsAddRxModalOpen(false);
      fetchMedicationRecord(selectedPatientId);
    } catch (err) {
      toast.error('Failed to add prescription');
    } finally {
      setSubmittingRx(false);
    }
  };

  const selectedPatient = patients.find(p => p._id === selectedPatientId);
  const activeConflicts = medData?.conflicts?.filter(c => c.status === 'unresolved') || [];

  return (
    <PageContainer>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-textPrimary tracking-tight">
            Cross-Provider Medication Reconciliation
          </h2>
          <p className="text-xs text-textSecondary">
            Unifying prescriptions across PHCs and hospitals to prevent adverse drug events and dangerous duplications
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Patient Selector */}
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="bg-bgElevated border border-borderColor rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentTeal"
          >
            {patients.map(p => (
              <option key={p._id} value={p._id}>{p.name} ({p.abhaId})</option>
            ))}
          </select>

          <Button variant="primary" size="sm" onClick={() => setIsAddRxModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" /> Add Cross-Facility Prescription
          </Button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Active Prescriptions across Facilities (55%) */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-borderColor">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-accentTeal" />
                <h3 className="text-sm font-bold text-textPrimary">Prescription History by Provider</h3>
              </div>
              <Badge variant={medData?.reconciliationStatus === 'pending' ? 'danger' : 'success'} size="sm">
                {medData?.reconciliationStatus?.toUpperCase() || 'RESOLVED'}
              </Badge>
            </div>

            {(!medData || !medData.prescriptions || medData.prescriptions.length === 0) ? (
              <p className="text-xs text-textSecondary py-8 text-center">
                No medication records found for this patient.
              </p>
            ) : (
              <div className="space-y-3">
                {medData.prescriptions.map((rx, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-bgElevated border border-borderColor text-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-textPrimary text-sm">{rx.hospitalName}</span>
                        <p className="text-[11px] text-textSecondary">Prescribed by {rx.prescribedBy}</p>
                      </div>
                      <span className="text-[10px] text-textSecondary font-medium">
                        {new Date(rx.prescribedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {rx.drugs.map((drug, dIdx) => (
                        <div key={dIdx} className="flex justify-between items-center p-2 rounded bg-bgCard border border-borderColor/60 text-xs">
                          <span className="font-bold text-textPrimary">{drug.drugName}</span>
                          <span className="text-textSecondary">{drug.dose} • {drug.frequency}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Interaction Checker & Flagged Conflicts (45%) */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-borderColor">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <h3 className="text-sm font-bold text-textPrimary">
                  Flagged Discrepancies ({medData?.conflicts?.length || 0})
                </h3>
              </div>
              <span className="text-xs text-textSecondary font-semibold">
                {activeConflicts.length} Unresolved
              </span>
            </div>

            {(!medData || !medData.conflicts || medData.conflicts.length === 0) ? (
              <div className="p-8 text-center">
                <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2 opacity-80" />
                <p className="text-xs font-semibold text-textPrimary">No Drug-Drug Conflicts Detected</p>
                <p className="text-[11px] text-textSecondary mt-0.5">All active prescriptions verified compatible.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {medData.conflicts.map((conflict) => (
                  <ConflictCard
                    key={conflict._id}
                    conflict={conflict}
                    onResolve={handleResolveConflict}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Add Prescription Modal */}
      <Modal
        isOpen={isAddRxModalOpen}
        onClose={() => setIsAddRxModalOpen(false)}
        title="Add Cross-Facility Prescription & Reconcile"
      >
        <form onSubmit={handleAddPrescription} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-textSecondary uppercase tracking-wider mb-1">
              Prescribing Physician
            </label>
            <input
              type="text"
              required
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="w-full bg-bgElevated border border-borderColor rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentTeal"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-textSecondary uppercase tracking-wider mb-1">
              Facility / Clinic
            </label>
            <input
              type="text"
              required
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              className="w-full bg-bgElevated border border-borderColor rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentTeal"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-textSecondary uppercase tracking-wider mb-1">
                Drug Name
              </label>
              <input
                type="text"
                required
                value={newDrugName}
                onChange={(e) => setNewDrugName(e.target.value)}
                placeholder="e.g. Warfarin"
                className="w-full bg-bgElevated border border-borderColor rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentTeal"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-textSecondary uppercase tracking-wider mb-1">
                Dosage
              </label>
              <input
                type="text"
                required
                value={newDrugDose}
                onChange={(e) => setNewDrugDose(e.target.value)}
                placeholder="2.5mg"
                className="w-full bg-bgElevated border border-borderColor rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentTeal"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-textSecondary uppercase tracking-wider mb-1">
                Frequency
              </label>
              <input
                type="text"
                required
                value={newDrugFreq}
                onChange={(e) => setNewDrugFreq(e.target.value)}
                placeholder="Once daily"
                className="w-full bg-bgElevated border border-borderColor rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentTeal"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setIsAddRxModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={submittingRx}>
              Submit & Check Interactions
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}
