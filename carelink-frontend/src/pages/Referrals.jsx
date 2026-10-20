import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, GitBranch, Eye, Edit2 } from 'lucide-react';
import api from '../utils/api';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

const stageLabels = [
  'Created',
  'Accepted',
  'Appointment Booked',
  'Patient Arrived',
  'Consulted',
  'Treatment Started',
  'Follow-up Done',
];

export default function Referrals() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const navigate = useNavigate();

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter && statusFilter !== 'All') params.append('status', statusFilter);
      if (riskFilter && riskFilter !== 'All') params.append('riskLevel', riskFilter.toLowerCase());
      if (urgencyFilter && urgencyFilter !== 'All') params.append('urgency', urgencyFilter.toLowerCase());

      const res = await api.get(`/api/referrals?${params.toString()}`);
      const data = res.data?.data?.referrals || res.data?.data || res.data || [];
      setReferrals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Fetch referrals fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, [statusFilter, riskFilter, urgencyFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReferrals();
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setRiskFilter('');
    setUrgencyFilter('');
    setCurrentPage(1);
    fetchReferrals();
  };

  // Filter in-memory as well for responsive feel
  const filteredReferrals = referrals.filter((ref) => {
    const patientName = (ref.patient?.name || ref.patientName || '').toLowerCase();
    const abha = (ref.patient?.abhaId || ref.abhaId || '').toLowerCase();
    const q = search.toLowerCase();
    if (q && !patientName.includes(q) && !abha.includes(q)) return false;
    return true;
  });

  const totalResults = filteredReferrals.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));
  const paginatedReferrals = filteredReferrals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <PageContainer>
      {/* Header Row: Referrals title left, Create Referral button right with Plus icon */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
          Referrals
        </h1>
        <Button
          variant="primary"
          onClick={() => navigate('/referrals/new')}
          icon={<Plus size={18} />}
        >
          Create Referral
        </Button>
      </div>

      {/* Filter bar below */}
      <Card padding="20px" style={{ marginBottom: '20px' }}>
        <form
          onSubmit={handleSearchSubmit}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          {/* Search input with Search icon */}
          <div style={{ position: 'relative' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)',
              }}
            />
            <input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '10px 14px 10px 36px',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          {/* Status select */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none',
            }}
          >
            <option value="">Status: All</option>
            <option value="Created">Created</option>
            <option value="Accepted">Accepted</option>
            <option value="Appointment Booked">Appointment Booked</option>
            <option value="Patient Arrived">Patient Arrived</option>
            <option value="Consulted">Consulted</option>
            <option value="Treatment Started">Treatment Started</option>
            <option value="Follow-up Done">Follow-up Done</option>
          </select>

          {/* Risk Level select */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none',
            }}
          >
            <option value="">Risk Level: All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          {/* Urgency select */}
          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none',
            }}
          >
            <option value="">Urgency: All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>

          {/* Clear Filters link in var accent-teal */}
          <button
            type="button"
            onClick={handleClearFilters}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-teal)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            Clear Filters
          </button>
        </form>

        {/* Results count below showing showing X of Y referrals */}
        <div style={{ marginTop: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Showing {paginatedReferrals.length} of {totalResults} referrals
        </div>
      </Card>

      {/* Table Card */}
      <Card padding="0px" style={{ overflow: 'hidden', marginBottom: '20px' }}>
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} height="48px" />
              ))}
            </div>
          ) : paginatedReferrals.length === 0 ? (
            <EmptyState
              icon={GitBranch}
              title="No referrals found"
              description="No matching referrals meet your search and filter criteria."
              actionText="Create First Referral"
              onAction={() => navigate('/referrals/new')}
            />
          ) : (
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    color: 'var(--text-secondary)',
                    letterSpacing: '0.5px',
                    backgroundColor: 'var(--bg-elevated)',
                  }}
                >
                  <th style={{ padding: '14px 16px' }}>Patient Name</th>
                  <th style={{ padding: '14px 16px' }}>Specialty</th>
                  <th style={{ padding: '14px 16px', minWidth: '150px' }}>Stage</th>
                  <th style={{ padding: '14px 16px' }}>Risk</th>
                  <th style={{ padding: '14px 16px' }}>Urgency</th>
                  <th style={{ padding: '14px 16px' }}>Days Open</th>
                  <th style={{ padding: '14px 16px' }}>Status</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReferrals.map((ref) => {
                  const patientName = ref.patient?.name || ref.patientName || 'Anonymous Patient';
                  const initial = patientName.charAt(0).toUpperCase();
                  const specialty = ref.targetSpecialty || ref.specialty || 'General';
                  const stageIndex = typeof ref.currentStage === 'number' ? ref.currentStage : 0;
                  const stagePercent = Math.min(100, Math.round(((stageIndex + 1) / 7) * 100));
                  const stageName = stageLabels[stageIndex] || `Stage ${stageIndex + 1}`;

                  const riskLevel = ref.riskLevel || (ref.riskScore >= 70 ? 'high' : ref.riskScore >= 40 ? 'medium' : 'low');
                  const riskVariant = riskLevel === 'high' ? 'danger' : riskLevel === 'medium' ? 'warning' : 'success';

                  const urgency = (ref.urgency || 'Medium').toLowerCase();
                  const urgencyVariant = urgency === 'critical' ? 'danger' : urgency === 'high' ? 'warning' : 'default';

                  const status = ref.status || stageName;
                  const statusVariant = status.toLowerCase().includes('done') || status.toLowerCase().includes('consulted')
                    ? 'success'
                    : 'info';

                  const createdDate = new Date(ref.createdAt || Date.now());
                  const daysOpen = Math.max(1, Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)));

                  return (
                    <tr
                      key={ref._id}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        transition: 'background-color 200ms',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-elevated)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Patient Name with avatar circle showing first letter */}
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--bg-elevated)',
                              color: 'var(--accent-teal)',
                              fontWeight: 700,
                              fontSize: '13px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {initial}
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 500, color: '#FFFFFF' }}>
                              {patientName}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                              ABHA: {ref.patient?.abhaId || ref.abhaId || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Specialty badge */}
                      <td style={{ padding: '16px' }}>
                        <Badge text={specialty} variant="info" />
                      </td>

                      {/* Stage progress bar with label */}
                      <td style={{ padding: '16px' }}>
                        <div
                          style={{
                            height: '6px',
                            width: '100%',
                            backgroundColor: 'var(--bg-elevated)',
                            borderRadius: '3px',
                            overflow: 'hidden',
                            marginBottom: '4px',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${stagePercent}%`,
                              backgroundColor: 'var(--accent-teal)',
                              borderRadius: '3px',
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {stageName}
                        </span>
                      </td>

                      {/* Risk badge */}
                      <td style={{ padding: '16px' }}>
                        <Badge text={riskLevel.toUpperCase()} variant={riskVariant} />
                      </td>

                      {/* Urgency badge */}
                      <td style={{ padding: '16px' }}>
                        <Badge text={urgency.toUpperCase()} variant={urgencyVariant} />
                      </td>

                      {/* Days Open in 14px var text-secondary */}
                      <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        {daysOpen}d
                      </td>

                      {/* Status badge */}
                      <td style={{ padding: '16px' }}>
                        <Badge text={status} variant={statusVariant} />
                      </td>

                      {/* Actions with View and Edit icon buttons */}
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => navigate(`/referrals/${ref._id}`)}
                            title="View Referral"
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              background: 'transparent',
                              border: '1px solid var(--accent-teal)',
                              color: 'var(--accent-teal)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 200ms',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-teal-dim)')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/referrals/${ref._id}`)}
                            title="Edit Referral"
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              background: 'transparent',
                              border: '1px solid var(--border-color)',
                              color: 'var(--text-secondary)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 200ms',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = 'var(--accent-teal)';
                              e.currentTarget.style.borderColor = 'var(--accent-teal)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = 'var(--text-secondary)';
                              e.currentTarget.style.borderColor = 'var(--border-color)';
                            }}
                          >
                            <Edit2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Pagination Row below table: Previous and Next buttons outline style, page number pills with active page having teal fill */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid var(--border-color)',
                    backgroundColor: isActive ? 'var(--accent-teal)' : 'var(--bg-elevated)',
                    color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 200ms',
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </PageContainer>
  );
}
