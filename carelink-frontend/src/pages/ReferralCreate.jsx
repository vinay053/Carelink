import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, User, Building2, AlertTriangle, ShieldCheck } from 'lucide-react';
import api from '../utils/api';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import RiskScore from '../components/ui/RiskScore';
import HospitalRecommendationCard from '../components/referrals/HospitalRecommendationCard';
import { SPECIALTIES, URGENCY_LEVELS } from '../utils/constants';
import toast from 'react-hot-toast';

export default function ReferralCreate() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Wizard State
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchPatient, setSearchPatient] = useState('');

  const [specialty, setSpecialty] = useState('Cardiology');
  const [urgency, setUrgency] = useState('high');
  const [notes, setNotes] = useState('');
  const [distanceKm, setDistanceKm] = useState(58);
  const [hasPrivateTransport, setHasPrivateTransport] = useState(false);

  const [recommendedHospitals, setRecommendedHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [loadingHospitals, setLoadingHospitals] = useState(false);

  // Initial Patients load
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('/patients?limit=20');
        if (res.data?.data) {
          setPatients(res.data.data);
          if (res.data.data.length > 0) {
            setSelectedPatient(res.data.data[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching patients:', err);
      }
    };
    fetchPatients();
  }, []);

  // Fetch Hospital Recommendations on entering Step 3
  const fetchHospitalRecommendations = async () => {
    setLoadingHospitals(true);
    try {
      const res = await api.get(`/hospitals/recommend?requiredSpecialty=${encodeURIComponent(specialty)}&urgency=${urgency}`);
      if (res.data?.data) {
        setRecommendedHospitals(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedHospital(res.data.data[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoadingHospitals(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedPatient) {
      toast.error('Please select a patient.');
      return;
    }
    if (currentStep === 2) {
      fetchHospitalRecommendations();
    }
    if (currentStep === 3 && !selectedHospital) {
      toast.error('Please choose a target healthcare facility.');
      return;
    }
    setCurrentStep(prev => Math.min(5, prev + 1));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // Calculate live preview risk score for Step 4
  const computeLiveRiskScore = () => {
    let score = 0;
    const factors = [];

    if (distanceKm > 50) {
      score += 20;
      factors.push({ factor: `Long travel distance (${distanceKm} km > 50 km)`, points: 20 });
    }
    if (!hasPrivateTransport) {
      score += 10;
      factors.push({ factor: 'No private transport recorded', points: 10 });
    }
    if (urgency === 'critical') {
      score += 20;
      factors.push({ factor: 'Critical clinical urgency tier', points: 20 });
    } else if (urgency === 'high') {
      score += 10;
      factors.push({ factor: 'High clinical urgency tier', points: 10 });
    }
    // No appointment confirmed yet
    score += 15;
    factors.push({ factor: 'No confirmed appointment booked', points: 15 });

    if (selectedHospital && selectedHospital.currentLoad > 70) {
      score += 15;
      factors.push({ factor: `Target facility congestion (${selectedHospital.currentLoad}%)`, points: 15 });
    }

    const clamped = Math.min(100, score);
    const level = clamped >= 71 ? 'high' : (clamped >= 41 ? 'medium' : 'low');
    const recommendedAction = level === 'high'
      ? 'Assign ASHA/Community health worker immediately; coordinate transport assistance.'
      : (level === 'medium' ? 'Schedule automated follow-up call within 48 hours.' : 'Standard monitoring of referral progress.');

    return { score: clamped, level, factors, recommendedAction };
  };

  const riskPreview = computeLiveRiskScore();

  // Final Submit to Backend
  const handleSubmitReferral = async () => {
    setLoading(true);
    try {
      const payload = {
        patientId: selectedPatient._id,
        targetHospitalId: selectedHospital.hospitalId || selectedHospital._id,
        targetSpecialty: specialty,
        urgency,
        notes,
        distanceKm,
        hasPrivateTransport
      };

      const res = await api.post('/referrals', payload);
      toast.success('Referral created and evaluated successfully!');
      navigate(`/referrals/${res.data?.data?._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create referral');
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = ['Patient', 'Clinical Details', 'Hospital Match', 'Risk Audit', 'Confirm'];

  return (
    <PageContainer>
      {/* Wizard Progress Indicator */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-bgElevated -z-0" />
          <div
            className="absolute top-4 left-6 h-0.5 bg-accentTeal transition-all duration-300 -z-0"
            style={{ width: `${((currentStep - 1) / (stepLabels.length - 1)) * 100}%` }}
          />

          {stepLabels.map((label, idx) => {
            const stepNum = idx + 1;
            const isDone = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <div key={idx} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                    isDone
                      ? 'bg-accentTeal text-bgPrimary'
                      : isCurrent
                      ? 'bg-bgCard border-2 border-accentTeal text-accentTeal ring-4 ring-accentTeal/20'
                      : 'bg-bgElevated border border-borderColor text-textSecondary'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : stepNum}
                </div>
                <span className={`mt-2 text-xs font-semibold ${isCurrent ? 'text-accentTeal' : 'text-textSecondary'}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step 1: Patient Selection */}
        {currentStep === 1 && (
          <Card className="space-y-4">
            <h3 className="text-base font-bold text-textPrimary tracking-tight">Step 1: Select Patient</h3>
            <p className="text-xs text-textSecondary">Choose an existing verified patient or search by ABHA ID.</p>

            <div className="relative">
              <input
                type="text"
                value={searchPatient}
                onChange={(e) => setSearchPatient(e.target.value)}
                placeholder="Search patient name..."
                className="w-full bg-bgElevated border border-borderColor rounded-lg px-4 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentTeal"
              />
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {patients
                .filter(p => p.name.toLowerCase().includes(searchPatient.toLowerCase()))
                .map((patient) => (
                  <div
                    key={patient._id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedPatient?._id === patient._id
                        ? 'bg-accentTealDim/40 border-accentTeal ring-1 ring-accentTeal'
                        : 'bg-bgCard border-borderColor hover:bg-bgElevated/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-textPrimary">{patient.name}</span>
                      <span className="text-textSecondary font-mono">{patient.abhaId}</span>
                    </div>
                    <div className="text-[11px] text-textSecondary mt-1 flex gap-3">
                      <span>{patient.gender} • {patient.bloodGroup}</span>
                      <span>District: {patient.address?.district}</span>
                      <span>Conditions: {patient.conditions?.join(', ') || 'None'}</span>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        )}

        {/* Step 2: Referral Details */}
        {currentStep === 2 && (
          <Card className="space-y-4">
            <h3 className="text-base font-bold text-textPrimary tracking-tight">Step 2: Clinical Details & Transit Parameters</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-1">
                  Required Target Specialty
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full bg-bgElevated border border-borderColor rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentTeal"
                >
                  {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-1">
                  Clinical Urgency Level
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full bg-bgElevated border border-borderColor rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentTeal"
                >
                  <option value="low">Low (Routine Elective)</option>
                  <option value="medium">Medium (Subacute, 48h SLA)</option>
                  <option value="high">High (Urgent, 24h SLA)</option>
                  <option value="critical">Critical (Emergency, 12h SLA)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-1">
                  Estimated Distance to Tertiary Facility (km)
                </label>
                <input
                  type="number"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="w-full bg-bgElevated border border-borderColor rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentTeal"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-1">
                  Private Transport Available
                </label>
                <select
                  value={hasPrivateTransport ? 'yes' : 'no'}
                  onChange={(e) => setHasPrivateTransport(e.target.value === 'yes')}
                  className="w-full bg-bgElevated border border-borderColor rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentTeal"
                >
                  <option value="no">No (Requires Public/ASHA Transit)</option>
                  <option value="yes">Yes (Patient Has Private Vehicle)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider mb-1">
                Clinical Referral Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Diagnostic findings, reason for transfer, specific clinical concerns..."
                className="w-full bg-bgElevated border border-borderColor rounded-lg p-3 text-xs text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-accentTeal"
              />
            </div>
          </Card>
        )}

        {/* Step 3: Hospital Selection */}
        {currentStep === 3 && (
          <Card className="space-y-4">
            <h3 className="text-base font-bold text-textPrimary tracking-tight">Step 3: Algorithmic Facility Matching</h3>
            <p className="text-xs text-textSecondary">
              CareLink matches nearby facilities based on on-site specialist availability today, ICU capacity, and imaging capability.
            </p>

            {loadingHospitals ? (
              <div className="py-12 text-center text-xs text-textSecondary animate-pulse">
                Ranking available regional healthcare facilities...
              </div>
            ) : (
              <div className="space-y-3">
                {recommendedHospitals.map((hosp, idx) => (
                  <HospitalRecommendationCard
                    key={hosp.hospitalId || idx}
                    hospital={hosp}
                    isSelected={selectedHospital?.hospitalId === hosp.hospitalId}
                    onSelect={() => setSelectedHospital(hosp)}
                  />
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Step 4: Real-time Risk Assessment */}
        {currentStep === 4 && (
          <Card className="space-y-4">
            <div className="text-center pb-2">
              <h3 className="text-base font-bold text-textPrimary tracking-tight">Step 4: Dropout Risk Assessment</h3>
              <p className="text-xs text-textSecondary">Explainable rule-based risk calculation before dispatch</p>
            </div>

            <RiskScore
              score={riskPreview.score}
              level={riskPreview.level}
              factors={riskPreview.factors}
              recommendedAction={riskPreview.recommendedAction}
              showFactors={true}
            />
          </Card>
        )}

        {/* Step 5: Summary & Confirm */}
        {currentStep === 5 && (
          <Card className="space-y-5">
            <h3 className="text-base font-bold text-textPrimary tracking-tight">Step 5: Review & Confirm Referral Dispatch</h3>

            <div className="p-4 rounded-xl bg-bgElevated border border-borderColor space-y-3 text-xs">
              <div className="flex justify-between border-b border-borderColor/60 pb-2">
                <span className="text-textSecondary">Patient:</span>
                <span className="font-bold text-textPrimary">{selectedPatient?.name} ({selectedPatient?.abhaId})</span>
              </div>
              <div className="flex justify-between border-b border-borderColor/60 pb-2">
                <span className="text-textSecondary">Target Specialty:</span>
                <span className="font-bold text-accentTeal">{specialty} ({urgency.toUpperCase()} Urgency)</span>
              </div>
              <div className="flex justify-between border-b border-borderColor/60 pb-2">
                <span className="text-textSecondary">Target Facility:</span>
                <span className="font-bold text-textPrimary">{selectedHospital?.name} ({selectedHospital?.district})</span>
              </div>
              <div className="flex justify-between border-b border-borderColor/60 pb-2">
                <span className="text-textSecondary">Calculated Risk Score:</span>
                <span className={`font-bold ${riskPreview.level === 'high' ? 'text-danger' : 'text-accentTeal'}`}>
                  {riskPreview.score}/100 ({riskPreview.level.toUpperCase()})
                </span>
              </div>
              <div>
                <span className="text-textSecondary block mb-1">Clinical Notes:</span>
                <p className="text-textPrimary bg-bgCard p-2 rounded border border-borderColor/60">
                  {notes || 'No notes specified.'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Wizard Footer Navigation Controls */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="secondary"
            size="md"
            onClick={handlePrevStep}
            disabled={currentStep === 1 || loading}
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
          </Button>

          {currentStep < 5 ? (
            <Button variant="primary" size="md" onClick={handleNextStep}>
              Next Step <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          ) : (
            <Button variant="primary" size="md" loading={loading} onClick={handleSubmitReferral}>
              Confirm & Dispatch Referral <Check className="w-4 h-4 ml-1.5" />
            </Button>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
