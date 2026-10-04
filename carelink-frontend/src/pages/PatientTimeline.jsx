import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Upload, Bot, FileText, CheckCircle2, AlertTriangle, Pill, GitPullRequest } from 'lucide-react';
import api from '../utils/api';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

export default function PatientTimeline() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline' | 'upload'
  const [simulatingUpload, setSimulatingUpload] = useState(false);

  const fetchTimeline = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/patients/${id}/timeline`);
      if (res.data?.data) {
        setPatient(res.data.data.patient);
        setTimeline(res.data.data.timeline || []);
      }
    } catch (err) {
      toast.error('Failed to load patient timeline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, [id]);

  const handleSimulateDocumentUpload = () => {
    setSimulatingUpload(true);
    setTimeout(() => {
      // Add simulated document extraction event
      const newEvent = {
        id: `doc_${Date.now()}`,
        type: 'document_extraction',
        date: new Date(),
        title: 'Prescription Document Extracted (OCR)',
        description: 'Uploaded Discharge Summary: Extracted Atorvastatin 40mg and verified normal cardiac enzymes.',
        severity: 'teal',
        category: 'document'
      };
      setTimeline(prev => [...prev, newEvent]);
      setSimulatingUpload(false);
      setActiveTab('timeline');
      toast.success('Clinical document processed via OCR and appended to timeline.');
    }, 1500);
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="py-24 text-center text-xs text-textSecondary animate-pulse">
          Reconstructing unified patient journey across health facilities...
        </div>
      </PageContainer>
    );
  }

  if (!patient) {
    return (
      <PageContainer>
        <div className="text-center py-16">
          <p className="text-textSecondary text-sm">Patient not found.</p>
          <Link to="/patients">
            <Button variant="secondary" size="sm" className="mt-4">Back to Patients</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  const getNodeColor = (severity) => {
    switch (severity) {
      case 'danger': return 'bg-danger text-white border-danger shadow-md shadow-danger/20';
      case 'warning': return 'bg-warning text-bgPrimary border-warning';
      case 'teal': return 'bg-accentTeal text-bgPrimary border-accentTeal shadow-md shadow-accentTeal/20';
      case 'success': return 'bg-success text-bgPrimary border-success';
      default: return 'bg-blue-500 text-white border-blue-400';
    }
  };

  const getNodeIcon = (type) => {
    if (type.includes('referral')) return GitPullRequest;
    if (type.includes('diagnostic')) return Clock;
    if (type.includes('medication')) return Pill;
    if (type.includes('alert')) return AlertTriangle;
    return FileText;
  };

  return (
    <PageContainer>
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/patients')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-textSecondary hover:text-textPrimary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Patient Directory
        </button>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate(`/carebot?patientId=${patient._id}`)}
        >
          <Bot className="w-4 h-4 mr-1.5" /> Query CareBot About This Patient
        </Button>
      </div>

      {/* Patient Demographic & Clinical Banner */}
      <Card className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-borderColor">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-textPrimary tracking-tight">{patient.name}</h2>
              <Badge variant="teal" size="sm">ABHA: {patient.abhaId}</Badge>
              <Badge variant="default" size="sm">Blood Group: {patient.bloodGroup || 'O+'}</Badge>
            </div>
            <p className="text-xs text-textSecondary mt-1">
              {patient.gender} • District: {patient.address?.district}, {patient.address?.state} • Phone: {patient.phone}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'timeline'
                  ? 'bg-accentTeal text-bgPrimary'
                  : 'bg-bgElevated text-textSecondary hover:text-textPrimary'
              }`}
            >
              Unified Timeline ({timeline.length})
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'upload'
                  ? 'bg-accentTeal text-bgPrimary'
                  : 'bg-bgElevated text-textSecondary hover:text-textPrimary'
              }`}
            >
              Document OCR Upload
            </button>
          </div>
        </div>

        {/* Conditions and Allergies Pill Strip */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-textSecondary font-semibold">Diagnosed Conditions:</span>
          {(patient.conditions || []).map((c, i) => (
            <span key={i} className="px-2 py-0.5 rounded bg-bgElevated border border-borderColor text-textPrimary font-medium">
              {c}
            </span>
          ))}
          {patient.allergies && patient.allergies.length > 0 && (
            <span className="px-2 py-0.5 rounded bg-dangerDim text-danger border border-danger/30 font-bold ml-2">
              Allergies: {patient.allergies.join(', ')}
            </span>
          )}
        </div>
      </Card>

      {/* Tab 1: Chronological Timeline View */}
      {activeTab === 'timeline' && (
        <Card className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-textSecondary">
            Chronological Care Journey (From First Encounter to Present)
          </h3>

          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-borderColor">
            {timeline.map((event, idx) => {
              const Icon = getNodeIcon(event.type);

              return (
                <div key={event.id || idx} className="relative group">
                  {/* Timeline Dot Node */}
                  <div className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center ${getNodeColor(event.severity)}`}>
                    <Icon className="w-3 h-3 stroke-[2.5]" />
                  </div>

                  {/* Event Content Box */}
                  <div className="p-4 rounded-xl bg-bgElevated border border-borderColor text-xs space-y-1.5 transition-all group-hover:border-borderColor/90 group-hover:bg-bgElevated/70">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-textPrimary text-sm">{event.title}</span>
                      <span className="text-[10px] text-textSecondary font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(event.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-textSecondary leading-relaxed">{event.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Tab 2: Document OCR Upload Simulator */}
      {activeTab === 'upload' && (
        <Card className="p-8 text-center max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-accentTealDim border border-accentTeal/30 flex items-center justify-center mx-auto text-accentTeal">
            <Upload className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-textPrimary">Upload Prescription or Lab Report</h3>
            <p className="text-xs text-textSecondary max-w-sm mx-auto mt-1">
              Supports scanned PDFs, camera photos, and lab slips. CareLink extracts dates, medications, and findings into the patient timeline.
            </p>
          </div>

          <div className="p-6 border-2 border-dashed border-borderColor rounded-xl bg-bgElevated/50">
            <p className="text-xs text-textSecondary">Drag and drop file here or click below to simulate</p>
            <Button
              variant="primary"
              size="sm"
              loading={simulatingUpload}
              onClick={handleSimulateDocumentUpload}
              className="mt-4"
            >
              Simulate Uploading Discharge Summary (PDF)
            </Button>
          </div>
        </Card>
      )}
    </PageContainer>
  );
}
