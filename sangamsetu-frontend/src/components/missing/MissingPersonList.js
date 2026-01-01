import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { missingPersonAPI } from '../../services/api';

const MissingPersonList = () => {
  const navigate = useNavigate();
  const [missingPersons, setMissingPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMissingPersons();
  }, []);

  const loadMissingPersons = async () => {
    try {
      setLoading(true);
      const data = await missingPersonAPI.list();
      setMissingPersons(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Error loading missing persons:', err);
      setError('Failed to load missing persons');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
          >
            ← Back to Dashboard
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">All Missing Persons</h1>
              <p className="text-gray-600 mt-2">Browse all registered missing person cases</p>
            </div>
            <button
              onClick={loadMissingPersons}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading missing persons...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {/* Missing Persons List */}
        {!loading && !error && (
          <div className="space-y-6">
            {missingPersons.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg">No missing persons found</p>
              </div>
            ) : (
              missingPersons.map((person) => (
                <div key={person.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h2 className="text-2xl font-bold text-gray-800">{person.name}</h2>
                        {person.is_found && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                            ✓ Found
                          </span>
                        )}
                        {!person.is_found && (
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                            Missing
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        Case ID: {person.id} | Registered: {formatDate(person.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Age:</dt>
                          <dd className="text-gray-900">{person.age || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Gender:</dt>
                          <dd className="text-gray-900">{person.gender || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Last Seen Date:</dt>
                          <dd className="text-gray-900">{formatDate(person.last_seen_date)}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Last Seen Location:</dt>
                          <dd className="text-gray-900">{person.last_seen_location || 'N/A'}</dd>
                        </div>
                      </dl>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact Information</h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Contact Name:</dt>
                          <dd className="text-gray-900">{person.contact_name || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Contact Phone:</dt>
                          <dd className="text-gray-900">{person.contact_phone || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Contact Email:</dt>
                          <dd className="text-gray-900">{person.contact_email || 'N/A'}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  {(person.description || person.clothing || person.identifying_marks) && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Physical Description</h3>
                      <div className="space-y-3">
                        {person.description && (
                          <div>
                            <dt className="text-sm font-medium text-gray-600">Description:</dt>
                            <dd className="text-gray-900 mt-1">{person.description}</dd>
                          </div>
                        )}
                        {person.clothing && (
                          <div>
                            <dt className="text-sm font-medium text-gray-600">Clothing:</dt>
                            <dd className="text-gray-900 mt-1">{person.clothing}</dd>
                          </div>
                        )}
                        {person.identifying_marks && (
                          <div>
                            <dt className="text-sm font-medium text-gray-600">Identifying Marks:</dt>
                            <dd className="text-gray-900 mt-1">{person.identifying_marks}</dd>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MissingPersonList;

