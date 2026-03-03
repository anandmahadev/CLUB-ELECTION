/**
 * App.jsx
 * Root component — sets up React Router and Auth Providers
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AdminAuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

// Student pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import VotingPage from './pages/VotingPage';
import SuccessPage from './pages/SuccessPage';
import AlreadyVotedPage from './pages/AlreadyVotedPage';

// Admin pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCandidatesPage from './pages/admin/AdminCandidatesPage';
import AdminStudentsPage from './pages/admin/AdminStudentsPage';
import AdminResultsPage from './pages/admin/AdminResultsPage';

export default function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            {/* ---- Student Routes ---- */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/vote"
              element={
                <ProtectedRoute>
                  <VotingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/success"
              element={
                <ProtectedRoute>
                  <SuccessPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/already-voted"
              element={
                <ProtectedRoute>
                  <AlreadyVotedPage />
                </ProtectedRoute>
              }
            />

            {/* ---- Admin Routes ---- */}
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/candidates"
              element={
                <AdminProtectedRoute>
                  <AdminCandidatesPage />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <AdminProtectedRoute>
                  <AdminStudentsPage />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/results"
              element={
                <AdminProtectedRoute>
                  <AdminResultsPage />
                </AdminProtectedRoute>
              }
            />

            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </AuthProvider>
  );
}
