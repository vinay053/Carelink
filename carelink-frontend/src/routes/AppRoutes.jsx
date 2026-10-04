import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import PublicRoute from '../components/common/PublicRoute';

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

export default function AppRoutes() {
  return (
    <Routes>
      {/* Landing page */}
      <Route path="/" element={<Landing />} />

      {/* Public Pages wrapped in PublicRoute */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected App Pages wrapped in ProtectedRoute */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/referrals"
        element={
          <ProtectedRoute>
            <Referrals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/referrals/new"
        element={
          <ProtectedRoute>
            <ReferralCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/referrals/:id"
        element={
          <ProtectedRoute>
            <ReferralDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients"
        element={
          <ProtectedRoute>
            <Patients />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients/:id/timeline"
        element={
          <ProtectedRoute>
            <PatientTimeline />
          </ProtectedRoute>
        }
      />
      <Route
        path="/diagnostics"
        element={
          <ProtectedRoute>
            <DiagnosticTracker />
          </ProtectedRoute>
        }
      />
      <Route
        path="/medications"
        element={
          <ProtectedRoute>
            <MedicationReconcile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hospitals"
        element={
          <ProtectedRoute>
            <HospitalMap />
          </ProtectedRoute>
        }
      />
      <Route
        path="/carebot"
        element={
          <ProtectedRoute>
            <CareBot />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
