import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { statsAPI } from '../../services/api';

const Dashboard = () => {
  const { user, hasRole, hasAnyRole } = useAuth();
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, [user]);

  // Reload stats when navigating back from form submission
  useEffect(() => {
    if (location.state?.refresh) {
      loadStats();
      // Clear the refresh flag
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Reload stats when component becomes visible (e.g., returning from form submission)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadStats();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', loadStats);
    
    // Auto-refresh stats every 30 seconds when on dashboard
    const interval = setInterval(() => {
      if (!document.hidden) {
        loadStats();
      }
    }, 30000);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', loadStats);
      clearInterval(interval);
    };
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await statsAPI.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
      setError('Unable to load statistics. Please try refreshing the page.');
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">SangamSetu Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.first_name || user?.username} ({user?.role})
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Welcome, {user?.first_name || user?.username}!
          </h2>
          <p className="text-gray-600">
            You are logged in as <span className="font-semibold">{user?.role}</span>
          </p>
        </div>

        {/* Statistics Cards - Only for Admin and Police */}
        {hasAnyRole(['ADMIN', 'POLICE']) && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Statistics</h2>
              <button
                onClick={loadStats}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span>🔄</span>
                <span>{loading ? 'Loading...' : 'Refresh'}</span>
              </button>
            </div>
            {stats ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                      <span className="text-2xl">👤</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Missing Persons</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.missing_count ?? 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                      <span className="text-2xl">✅</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Found Persons</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.found_count ?? 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                      <span className="text-2xl">🔗</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Matches</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.match_count ?? 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : loading ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-600">Loading statistics...</p>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">Unable to load statistics. Click refresh to try again.</p>
              </div>
            )}
          </div>
        )}

        {/* Action Cards - Kumbh Mela Workflow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Register Missing Person - POLICE and ADMIN only (Parents report to police) */}
          {(hasRole('POLICE') || hasRole('ADMIN')) && (
            <Link
              to="/missing-person/register"
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 block"
            >
              <div className="flex items-center mb-4">
                <div className="bg-red-100 rounded-full p-3">
                  <span className="text-3xl">👤</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Register Missing Person
              </h3>
              <p className="text-gray-600 text-sm">
                Parents report lost child → Police fills information
              </p>
            </Link>
          )}

          {/* Register Found Person - VOLUNTEER, POLICE, and ADMIN (Volunteers find kids in Godavari) */}
          {(hasRole('VOLUNTEER') || hasRole('POLICE') || hasRole('ADMIN')) && (
            <Link
              to="/found-person/register"
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 block"
            >
              <div className="flex items-center mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <span className="text-3xl">✅</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Register Found Person
              </h3>
              <p className="text-gray-600 text-sm">
                Volunteer finds child in Godavari → Fill details (clothes, location)
              </p>
            </Link>
          )}

          {/* View Matches - VOLUNTEER, POLICE, and ADMIN (All can see matches) */}
          {(hasRole('VOLUNTEER') || hasRole('POLICE') || hasRole('ADMIN')) && (
            <Link
              to="/matches"
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 block"
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <span className="text-3xl">🔗</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                View Match Suggestions
              </h3>
              <p className="text-gray-600 text-sm">
                See matched cases (e.g., Match ID 1) - Reunite child with parents
              </p>
            </Link>
          )}

          {/* View All Missing Persons - POLICE and ADMIN */}
          {(hasRole('POLICE') || hasRole('ADMIN')) && (
            <Link
              to="/missing-persons"
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 block"
            >
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 rounded-full p-3">
                  <span className="text-3xl">📋</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                View All Missing Persons
              </h3>
              <p className="text-gray-600 text-sm">
                Browse all missing person reports
              </p>
            </Link>
          )}

          {/* View All Found Persons - POLICE and ADMIN */}
          {(hasRole('POLICE') || hasRole('ADMIN')) && (
            <Link
              to="/found-persons"
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 block"
            >
              <div className="flex items-center mb-4">
                <div className="bg-teal-100 rounded-full p-3">
                  <span className="text-3xl">📄</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                View All Found Persons
              </h3>
              <p className="text-gray-600 text-sm">
                Browse all found person reports
              </p>
            </Link>
          )}

          {/* Admin Reports - ADMIN only */}
          {hasRole('ADMIN') && (
            <Link
              to="/admin/reports"
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 block"
            >
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 rounded-full p-3">
                  <span className="text-3xl">📊</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Admin Reports
              </h3>
              <p className="text-gray-600 text-sm">
                View detailed analytics and reports
              </p>
            </Link>
          )}

          {/* Debug: Show if no cards are visible */}
          {!hasRole('POLICE') && !hasRole('VOLUNTEER') && !hasRole('ADMIN') && (
            <div className="col-span-full bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                <strong>No actions available.</strong> Your role: <code>{user?.role || 'Unknown'}</code>
                <br />
                Please contact administrator to set your role (POLICE, VOLUNTEER, or ADMIN).
              </p>
            </div>
          )}
        </div>

        {/* Error Message (if any) */}
        {error && hasAnyRole(['ADMIN', 'POLICE']) && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
