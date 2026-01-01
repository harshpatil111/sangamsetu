import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { foundPersonAPI } from '../../services/api';

const FoundPersonList = () => {
  const navigate = useNavigate();
  const [foundPersons, setFoundPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFoundPersons();
  }, []);

  const loadFoundPersons = async () => {
    try {
      setLoading(true);
      const data = await foundPersonAPI.list();
      setFoundPersons(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Error loading found persons:', err);
      setError('Failed to load found persons');
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
              <h1 className="text-3xl font-bold text-gray-800">All Found Persons</h1>
              <p className="text-gray-600 mt-2">Browse all registered found person cases</p>
            </div>
            <button
              onClick={loadFoundPersons}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading found persons...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {/* Found Persons List */}
        {!loading && !error && (
          <div className="space-y-6">
            {foundPersons.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg">No found persons found</p>
              </div>
            ) : (
              foundPersons.map((person) => (
                <div key={person.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h2 className="text-2xl font-bold text-gray-800">
                          Case ID: {person.id}
                        </h2>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                          ✓ Found
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Registered: {formatDate(person.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Basic Information</h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Approximate Age:</dt>
                          <dd className="text-gray-900">{person.approximate_age || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Gender:</dt>
                          <dd className="text-gray-900">{person.gender || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Found Date:</dt>
                          <dd className="text-gray-900">{formatDate(person.found_date)}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Found Location:</dt>
                          <dd className="text-gray-900">{person.found_location || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Current Location:</dt>
                          <dd className="text-gray-900">{person.current_location || 'N/A'}</dd>
                        </div>
                        {person.mental_state && (
                          <div>
                            <dt className="text-sm font-medium text-gray-600">Mental State:</dt>
                            <dd className="text-gray-900">{person.mental_state || 'N/A'}</dd>
                          </div>
                        )}
                      </dl>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Finder Information</h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Finder Name:</dt>
                          <dd className="text-gray-900">{person.finder_name || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Finder Phone:</dt>
                          <dd className="text-gray-900">{person.finder_phone || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Finder Email:</dt>
                          <dd className="text-gray-900">{person.finder_email || 'N/A'}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  {(person.physical_description || person.clothing_description || person.distinctive_features) && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Physical Description</h3>
                      <div className="space-y-3">
                        {person.physical_description && (
                          <div>
                            <dt className="text-sm font-medium text-gray-600">Physical Description:</dt>
                            <dd className="text-gray-900 mt-1">{person.physical_description}</dd>
                          </div>
                        )}
                        {person.clothing_description && (
                          <div>
                            <dt className="text-sm font-medium text-gray-600">Clothing:</dt>
                            <dd className="text-gray-900 mt-1">{person.clothing_description}</dd>
                          </div>
                        )}
                        {person.distinctive_features && (
                          <div>
                            <dt className="text-sm font-medium text-gray-600">Distinctive Features:</dt>
                            <dd className="text-gray-900 mt-1">{person.distinctive_features}</dd>
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

export default FoundPersonList;

