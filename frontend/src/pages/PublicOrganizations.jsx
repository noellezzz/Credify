import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiSearch, 
  FiFilter, 
  FiMapPin, 
  FiExternalLink,
  FiShield,
  FiCalendar,
  FiUsers,
  FiStar,
  FiPhone,
  FiMail,
  FiGlobe
} from 'react-icons/fi';
import publicApi from '../services/publicApi';
import Loader from '../components/layouts/Loader';

const PublicOrganizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const filters = {
        search: searchTerm,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        location: locationFilter || undefined,
      };
      
      const data = await publicApi.getPublicOrganizations(filters);
      setOrganizations(data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching organizations:', err);
      setError('Failed to load organizations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchOrganizations();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, typeFilter, locationFilter]);

  const getOrganizationTypeIcon = (type) => {
    const icons = {
      university: '🎓',
      college: '🏫',
      training_center: '💪',
      certification_body: '📜',
      corporate: '🏢',
      government: '🏛️',
      nonprofit: '❤️',
      other: '🏢'
    };
    return icons[type] || '🏢';
  };

  const getOrganizationTypeName = (type) => {
    const names = {
      university: 'University',
      college: 'College',
      training_center: 'Training Center',
      certification_body: 'Certification Body',
      corporate: 'Corporate',
      government: 'Government',
      nonprofit: 'Non-Profit',
      other: 'Other'
    };
    return names[type] || 'Organization';
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Verified Organizations
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover trusted organizations offering certificate verification services for courses, training, and events.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="university">Universities</option>
                <option value="college">Colleges</option>
                <option value="training_center">Training Centers</option>
                <option value="certification_body">Certification Bodies</option>
                <option value="corporate">Corporate</option>
                <option value="government">Government</option>
                <option value="nonprofit">Non-Profit</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Location Filter */}
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Filter by location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent"
              />
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-end">
              <span className="text-sm text-gray-600">
                {organizations.length} organization{organizations.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="text-red-600">⚠️</div>
              <div>
                <h3 className="font-semibold text-red-900">Error Loading Organizations</h3>
                <p className="text-red-800">{error}</p>
                <button 
                  onClick={fetchOrganizations}
                  className="mt-2 text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Organizations Grid */}
        {organizations.length === 0 && !loading && !error ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Organizations Found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters to find organizations.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((organization) => (
              <div key={organization.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Organization Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-[#4a5d23] rounded-xl flex items-center justify-center flex-shrink-0">
                      {organization.logo_url ? (
                        <img 
                          src={organization.logo_url} 
                          alt={`${organization.name} logo`}
                          className="w-full h-full rounded-xl object-cover"
                        />
                      ) : (
                        <span className="text-2xl">
                          {getOrganizationTypeIcon(organization.organization_type)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                            {organization.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {getOrganizationTypeName(organization.organization_type)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          <FiShield size={12} />
                          Verified
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Organization Content */}
                <div className="p-6">
                  {/* Description */}
                  {organization.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {truncateText(organization.description, 120)}
                    </p>
                  )}

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    {organization.address && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiMapPin size={14} />
                        <span className="truncate">{organization.address}</span>
                      </div>
                    )}
                    {organization.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiPhone size={14} />
                        <span>{organization.phone}</span>
                      </div>
                    )}
                    {organization.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiMail size={14} />
                        <span className="truncate">{organization.email}</span>
                      </div>
                    )}
                    {organization.website && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiGlobe size={14} />
                        <a 
                          href={organization.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#4a5d23] hover:text-[#3a4d1a] truncate"
                        >
                          {organization.website}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <FiCalendar size={14} />
                      <span>Est. {organization.established_year || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiUsers size={14} />
                      <span>Active Events</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Link
                      to={`/organizations/${organization.id}`}
                      className="flex-1 bg-[#4a5d23] text-white text-center py-3 px-4 rounded-lg hover:bg-[#3a4d1a] transition-colors font-medium"
                    >
                      View Profile
                    </Link>
                    <Link
                      to={`/organizations/${organization.id}`}
                      className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      title="View Events"
                    >
                      <FiCalendar size={16} />
                    </Link>
                  </div>
                </div>

                {/* Verification Badge */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Verified Organization</span>
                    <div className="flex items-center gap-1">
                      <FiStar size={12} className="text-yellow-500" />
                      <span>Trusted Partner</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicOrganizations;
