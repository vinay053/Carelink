import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import MobileNav from '../components/layout/MobileNav';

// Pages
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Referrals from '../pages/Referrals';
import ReferralCreate from '../pages/ReferralCreate';
import ReferralDetail from '../pages/ReferralDetail';
import Patients from '../pages/Patients';
import PatientTimeline from '../pages/PatientTimeline';
import DiagnosticTracker from '../pages/DiagnosticTracker';
import MedicationReconcile from '../pages/MedicationReconcile';
import HospitalMap from '../pages/HospitalMap';
import CareBot from '../pages/CareBot';
import Analytics from '../pages/Analytics';
import Settings from '../pages/Settings';

// Placeholder or imported pages (will be expanded in Prompts 10-12)
const PlaceholderPage = ({ title }) => (
  <div className="p-8 text-center bg-bgCard border border-borderColor rounded-xl text-textSecondary text-sm max-w-xl mx-auto mt-12">
    <h2 className="text-xl font-bold text-textPrimary mb-2">{title}</h2>
    <p>Module active. Ready for functional interaction.</p>
  </div>
);

// Protected Layout Shell
const ProtectedLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bgPrimary flex items-center justify-center text-accentTeal">
        <div className="w-8 h-8 animate-spin rounded-full border-2 border-borderColor border-t-accentTeal" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary flex">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        <Header title={title} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 pb-20 md:pb-16">{children}</main>
        <MobileNav />
      </div>
    </div>
  );
};


export default function AppRoutes() {
  const location = useLocation();

  // Dynamic header titles based on pathname
  const getPageTitle = (path) => {
    if (path.startsWith('/dashboard')) return 'Clinical Operations Dashboard';
    if (path.startsWith('/referrals/new')) return 'Initiate New Referral';
    if (path.startsWith('/referrals/')) return 'Referral Handoff Detail';
    if (path.startsWith('/referrals')) return 'Referral Tracking Directory';
    if (path.startsWith('/patients/') && path.includes('/timeline')) return 'Unified Patient Journey';
    if (path.startsWith('/patients')) return 'Patient Registry';
    if (path.startsWith('/diagnostics')) return 'Diagnostic Follow-up Tracker';
    if (path.startsWith('/medications')) return 'Medication Reconciliation & Interaction Engine';
    if (path.startsWith('/hospitals')) return 'Facility Capabilities & Referral Matching';
    if (path.startsWith('/carebot')) return 'CareBot AI Workflow Coordinator';
    if (path.startsWith('/analytics')) return 'Healthcare Continuity Analytics';
    if (path.startsWith('/settings')) return 'System Preferences & Facility Settings';
    return 'CareLink';
  };

  const title = getPageTitle(location.pathname);

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected App Pages */}
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout title={title}>
            <Dashboard />
          </ProtectedLayout>
        }
      />
      <Route
        path="/referrals"
        element={
          <ProtectedLayout title={title}>
            <Referrals />
          </ProtectedLayout>
        }
      />
      <Route
        path="/referrals/new"
        element={
          <ProtectedLayout title={title}>
            <ReferralCreate />
          </ProtectedLayout>
        }
      />
      <Route
        path="/referrals/:id"
        element={
          <ProtectedLayout title={title}>
            <ReferralDetail />
          </ProtectedLayout>
        }
      />
      <Route
        path="/patients"
        element={
          <ProtectedLayout title={title}>
            <Patients />
          </ProtectedLayout>
        }
      />
      <Route
        path="/patients/:id/timeline"
        element={
          <ProtectedLayout title={title}>
            <PatientTimeline />
          </ProtectedLayout>
        }
      />
      <Route
        path="/diagnostics"
        element={
          <ProtectedLayout title={title}>
            <DiagnosticTracker />
          </ProtectedLayout>
        }
      />
      <Route
        path="/medications"
        element={
          <ProtectedLayout title={title}>
            <MedicationReconcile />
          </ProtectedLayout>
        }
      />
      <Route
        path="/hospitals"
        element={
          <ProtectedLayout title={title}>
            <HospitalMap />
          </ProtectedLayout>
        }
      />
      <Route
        path="/carebot"
        element={
          <ProtectedLayout title={title}>
            <CareBot />
          </ProtectedLayout>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedLayout title={title}>
            <Analytics />
          </ProtectedLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedLayout title={title}>
            <Settings />
          </ProtectedLayout>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
