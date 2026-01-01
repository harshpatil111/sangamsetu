import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import MissingPersonForm from './components/missing/MissingPersonForm';
import MissingPersonList from './components/missing/MissingPersonList';
import FoundPersonForm from './components/found/FoundPersonForm';
import FoundPersonList from './components/found/FoundPersonList';
import MatchSuggestions from './components/matches/MatchSuggestions';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />

        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Missing Person Registration - Only POLICE and ADMIN (Parents report to police) */}
          <Route
            path="/missing-person/register"
            element={
              <ProtectedRoute allowedRoles={['POLICE', 'ADMIN']}>
                <MissingPersonForm />
              </ProtectedRoute>
            }
          />

          {/* Found Person Registration - VOLUNTEER, POLICE, and ADMIN (Volunteers find kids) */}
          <Route
            path="/found-person/register"
            element={
              <ProtectedRoute allowedRoles={['VOLUNTEER', 'POLICE', 'ADMIN']}>
                <FoundPersonForm />
              </ProtectedRoute>
            }
          />

          {/* View Matches - VOLUNTEER, POLICE, and ADMIN (All can see matches) */}
          <Route
            path="/matches"
            element={
              <ProtectedRoute allowedRoles={['VOLUNTEER', 'POLICE', 'ADMIN']}>
                <MatchSuggestions />
              </ProtectedRoute>
            }
          />

          {/* View All Missing Persons - POLICE and ADMIN */}
          <Route
            path="/missing-persons"
            element={
              <ProtectedRoute allowedRoles={['POLICE', 'ADMIN']}>
                <MissingPersonList />
              </ProtectedRoute>
            }
          />

          {/* View All Found Persons - POLICE and ADMIN */}
          <Route
            path="/found-persons"
            element={
              <ProtectedRoute allowedRoles={['POLICE', 'ADMIN']}>
                <FoundPersonList />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
