import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, ArrowUpRight, Phone, MapPin, ShieldAlert } from 'lucide-react';
import api from '../utils/api';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/patients?search=${encodeURIComponent(search)}`);
      if (res.data?.data) {
        setPatients(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPatients();
  };

  return (
    <PageContainer>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-textPrimary tracking-tight">Patient Continuity Registry</h2>
          <p className="text-xs text-textSecondary">Verified longitudinal patient records tracked across health centers</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or ABHA ID..."
            className="bg-bgElevated border border-borderColor rounded-lg px-3 py-1.5 text-xs text-textPrimary focus:outline-none focus:border-accentTeal"
          />
          <Button type="submit" variant="secondary" size="sm">Search</Button>
        </form>
      </div>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-textSecondary animate-pulse">
            Loading patient records...
          </div>
        ) : patients.length === 0 ? (
          <div className="p-12 text-center text-xs text-textSecondary">
            No patients found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-borderColor text-textSecondary uppercase tracking-wider bg-bgElevated/30">
                <tr>
                  <th className="py-3 px-4 font-semibold">Patient Name</th>
                  <th className="py-3 px-4 font-semibold">ABHA ID</th>
                  <th className="py-3 px-4 font-semibold">Demographics</th>
                  <th className="py-3 px-4 font-semibold">Clinical Conditions</th>
                  <th className="py-3 px-4 font-semibold">Primary Center</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderColor/60">
                {patients.map((patient) => (
                  <tr key={patient._id} className="hover:bg-bgElevated/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-textPrimary">
                      {patient.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-textSecondary">
                      {patient.abhaId}
                    </td>
                    <td className="py-3.5 px-4 text-textSecondary">
                      {patient.gender} • {patient.bloodGroup || 'N/A'} • {patient.address?.district}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {(patient.conditions || []).slice(0, 2).map((c, i) => (
                          <span key={i} className="text-[10px] bg-bgElevated px-1.5 py-0.5 rounded border border-borderColor text-textPrimary">
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-textSecondary">
                      {patient.hospitalId?.name || 'District Hospital'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/patients/${patient._id}/timeline`}
                        className="inline-flex items-center gap-1 font-bold text-accentTeal hover:underline"
                      >
                        Open Journey <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </PageContainer>
  );
}
