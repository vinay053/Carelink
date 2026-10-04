import React, { useState, useEffect } from 'react';
import { Building2, Search, MapPin, Bed, Activity, ShieldCheck, Stethoscope, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { SPECIALTIES } from '../utils/constants';

export default function HospitalMap() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [specialty, setSpecialty] = useState('');
  const [district, setDistrict] = useState('');
  const [hasCT, setHasCT] = useState(false);
  const [hasMRI, setHasMRI] = useState(false);

  // Recommendation Test Runner
  const [recSpecialty, setRecSpecialty] = useState('Cardiology');
  const [recUrgency, setRecUrgency] = useState('high');
  const [recommendations, setRecommendations] = useState(null);
  const [loadingRec, setLoadingRec] = useState(false);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (specialty) params.append('specialty', specialty);
      if (district) params.append('district', district);
      if (hasCT) params.append('hasCT', 'true');
      if (hasMRI) params.append('hasMRI', 'true');

      const res = await api.get(`/hospitals?${params.toString()}`);
      if (res.data?.data) {
        setHospitals(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching hospitals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, [specialty, district, hasCT, hasMRI]);

  const handleRunRecommendation = async () => {
    setLoadingRec(true);
    try {
      const res = await api.get(`/hospitals/recommend?requiredSpecialty=${encodeURIComponent(recSpecialty)}&urgency=${recUrgency}`);
      if (res.data?.data) {
        setRecommendations(res.data.data);
      }
    } catch (err) {
      console.error('Error running recommendation:', err);
    } finally {
      setLoadingRec(false);
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-textPrimary tracking-tight">Facility Capabilities & Matching</h2>
          <p className="text-xs text-textSecondary">Real-time equipment availability, ICU capacity, and specialist rosters in Madhya Pradesh</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Filters & Recommendation Simulator (35%) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-textSecondary">
              Filter Facilities
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-textSecondary uppercase tracking-wider mb-1">
                Required Specialty
              </label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full bg-bgElevated border border-borderColor rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentTeal"
              >
                <option value="">All Specialties</option>
                {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-textSecondary uppercase tracking-wider mb-1">
                District / Region
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-bgElevated border border-borderColor rounded-lg px-3 py-2 text-xs text-textPrimary focus:outline-none focus:border-accentTeal"
              >
                <option value="">All Districts</option>
                <option value="Sagar">Sagar</option>
                <option value="Jabalpur">Jabalpur</option>
                <option value="Bhopal">Bhopal</option>
              </select>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-textSecondary hover:text-textPrimary">
                <input
                  type="checkbox"
                  checked={hasCT}
                  onChange={(e) => setHasCT(e.target.checked)}
                  className="rounded bg-bgElevated border-borderColor text-accentTeal focus:ring-accentTeal"
                />
                Must have CT Scanner
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-textSecondary hover:text-textPrimary">
                <input
                  type="checkbox"
                  checked={hasMRI}
                  onChange={(e) => setHasMRI(e.target.checked)}
                  className="rounded bg-bgElevated border-borderColor text-accentTeal focus:ring-accentTeal"
                />
                Must have MRI Scanner
              </label>
            </div>
          </Card>

          {/* Test Recommendation Engine */}
          <Card className="space-y-3 bg-gradient-to-b from-bgCard to-bgElevated/50 border-accentTeal/30">
            <h3 className="text-xs font-bold uppercase tracking-wider text-accentTeal flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4" /> Recommendation Engine
            </h3>
            <p className="text-[11px] text-textSecondary leading-relaxed">
              Calculates 6-variable composite score based on live specialist rosters, ICU beds, load, and transit distance.
            </p>

            <div>
              <label className="block text-[10px] font-bold text-textSecondary uppercase tracking-wider mb-1">
                Specialty Needed
              </label>
              <select
                value={recSpecialty}
                onChange={(e) => setRecSpecialty(e.target.value)}
                className="w-full bg-bgElevated border border-borderColor rounded-lg px-3 py-1.5 text-xs text-textPrimary"
              >
                {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <Button
              variant="primary"
              size="sm"
              loading={loadingRec}
              onClick={handleRunRecommendation}
              className="w-full"
            >
              Compute Optimal Referral Hospital <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Card>
        </div>

        {/* Right Column: Hospital Capacity Grid & Recommendations (65%) */}
        <div className="lg:col-span-8 space-y-4">
          {recommendations && (
            <div className="p-4 rounded-xl bg-accentTealDim border border-accentTeal/40 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-accentTeal uppercase tracking-wider">Top Recommendation Result</span>
                <button onClick={() => setRecommendations(null)} className="text-textSecondary hover:text-textPrimary font-semibold text-[11px]">Clear</button>
              </div>
              <p className="text-xs text-textPrimary font-medium">
                1st Choice: <strong className="text-accentTeal">{recommendations[0]?.name}</strong> ({recommendations[0]?.totalScore}/100 points)
              </p>
              <p className="text-[11px] text-textSecondary leading-relaxed">
                {recommendations[0]?.recommendationReason}
              </p>
            </div>
          )}

          {loading ? (
            <div className="p-12 text-center text-xs text-textSecondary animate-pulse">
              Loading facility capacity feeds...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hospitals.map((hospital) => {
                const icuPercent = Math.round((hospital.availableICUBeds / Math.max(hospital.totalICUBeds, 1)) * 100);

                return (
                  <Card key={hospital._id} className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-textPrimary text-sm">{hospital.name}</h4>
                        <p className="text-xs text-textSecondary flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-accentTeal" /> {hospital.district}, {hospital.state}
                        </p>
                      </div>
                      <Badge variant="teal" size="sm">
                        {hospital.type?.toUpperCase()}
                      </Badge>
                    </div>

                    {/* Bed Capacity Bar */}
                    <div className="p-3 rounded-lg bg-bgElevated border border-borderColor space-y-1.5 text-xs">
                      <div className="flex justify-between text-textSecondary">
                        <span>ICU Bed Availability</span>
                        <strong className="text-textPrimary">{hospital.availableICUBeds} / {hospital.totalICUBeds}</strong>
                      </div>
                      <div className="w-full bg-bgCard h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-accentTeal h-full rounded-full"
                          style={{ width: `${icuPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Operational Features */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded bg-bgElevated border border-borderColor/60">
                        <span className="text-[10px] text-textSecondary block uppercase font-bold">Capacity Load</span>
                        <span className={`font-bold ${hospital.currentLoad > 80 ? 'text-danger' : 'text-textPrimary'}`}>
                          {hospital.currentLoad}%
                        </span>
                      </div>
                      <div className="p-2 rounded bg-bgElevated border border-borderColor/60">
                        <span className="text-[10px] text-textSecondary block uppercase font-bold">Est. Wait</span>
                        <span className="font-bold text-textPrimary">{hospital.estimatedWaitMinutes || 30} mins</span>
                      </div>
                    </div>

                    {/* Equipment Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                      {hospital.hasCT && (
                        <span className="px-2 py-0.5 rounded bg-bgElevated border border-borderColor text-textPrimary font-semibold">
                          CT Scanner
                        </span>
                      )}
                      {hospital.hasMRI && (
                        <span className="px-2 py-0.5 rounded bg-bgElevated border border-borderColor text-textPrimary font-semibold">
                          MRI Scanner
                        </span>
                      )}
                      {hospital.hasBloodBank && (
                        <span className="px-2 py-0.5 rounded bg-dangerDim border border-danger/30 text-danger font-semibold">
                          Blood Bank
                        </span>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
