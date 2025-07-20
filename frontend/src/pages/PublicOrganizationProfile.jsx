import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FiMapPin, 
  FiPhone, 
  FiMail, 
  FiGlobe, 
  FiShield,
  FiCalendar,
  FiUsers,
  FiAward,
  FiExternalLink,
  FiClock,
  FiCheckCircle,
  FiArrowLeft,
  FiStar,
  FiFileText,
  FiFilter,
  FiSearch
} from 'react-icons/fi';
import publicApi from '../services/publicApi';
import Loader from '../components/layouts/Loader';

const PublicOrganizationProfile = () => {
  const { id } = useParams();
  const [organization, setOrganization] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrganizationData();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'events') {
      fetchOrganizationEvents();
    }
  }, [activeTab, eventTypeFilter, searchTerm]);

  const fetchOrganizationData = async () => {
    try {
      setLoading(true);
      const data = await publicApi.getPublicOrganization(id);
      setOrganization(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching organization:', err);
      setError('Failed to load organization details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizationEvents = async () => {
    try {
      setEventsLoading(true);
      const filters = {
        search: searchTerm || undefined,
        type: eventTypeFilter !== 'all' ? eventTypeFilter : undefined,
        status: 'published'
      };
      
      const data = await publicApi.getPublicOrganizationEvents(id, filters);
      setEvents(data.data || []);
    } catch (err) {
      console.error('Error fetching organization events:', err);
    } finally {
      setEventsLoading(false);
    }
  };

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

  const getEventTypeIcon = (type) => {
    const icons = {
      course: '📚',
      certification: '📜',
      training: '🎯',
      workshop: '🔧',
      conference: '🎤',
      seminar: '💼',
      award: '🏆',
      competition: '🏁'
    };
    return icons[type] || '📅';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isEventUpcoming = (eventDate) => {
    return new Date(eventDate) > new Date();
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !organization) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Organization Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The organization you are looking for does not exist.'}</p>
          <Link
            to="/organizations"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#4a5d23] text-white rounded-lg hover:bg-[#3a4d1a] transition-colors"
          >
            <FiArrowLeft size={16} />
            Back to Organizations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link
              to="/organizations"
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Organization Profile</h1>
          </div>

          {/* Organization Header */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-[#4a5d23] rounded-2xl flex items-center justify-center flex-shrink-0">
                {organization.logo_url ? (
                  <img 
                    src={organization.logo_url} 
                    alt={`${organization.name} logo`}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                  <span className="text-3xl">
                    {getOrganizationTypeIcon(organization.organization_type)}
                  </span>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {organization.name}
                    </h2>
                    <p className="text-lg text-gray-600 mb-2">
                      {getOrganizationTypeName(organization.organization_type)}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        <FiShield size={14} />
                        Verified Organization
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        <FiStar size={14} />
                        Trusted Partner
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {organization.address && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiMapPin size={16} />
                      <span className="truncate">{organization.address}</span>
                    </div>
                  )}
                  {organization.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiPhone size={16} />
                      <span>{organization.phone}</span>
                    </div>
                  )}
                  {organization.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiMail size={16} />
                      <span className="truncate">{organization.email}</span>
                    </div>
                  )}
                  {organization.website && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiGlobe size={16} />
                      <a 
                        href={organization.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#4a5d23] hover:text-[#3a4d1a] truncate flex items-center gap-1"
                      >
                        Visit Website
                        <FiExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('about')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'about'
                    ? 'border-[#4a5d23] text-[#4a5d23]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                About
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'events'
                    ? 'border-[#4a5d23] text-[#4a5d23]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Events & Courses
              </button>
              <button
                onClick={() => setActiveTab('verification')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'verification'
                    ? 'border-[#4a5d23] text-[#4a5d23]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Verification Info
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="space-y-8">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">About {organization.name}</h3>
              {organization.description ? (
                <p className="text-gray-700 leading-relaxed">{organization.description}</p>
              ) : (
                <p className="text-gray-500 italic">No description available.</p>
              )}
            </div>

            {/* Organization Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Organization Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <p className="text-gray-900">{getOrganizationTypeName(organization.organization_type)}</p>
                </div>
                {organization.established_year && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Established</label>
                    <p className="text-gray-900">{organization.established_year}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-500" size={16} />
                    <span className="text-green-800 font-medium">Verified Organization</span>
                  </div>
                </div>
                {organization.verified_at && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Verified Since</label>
                    <p className="text-gray-900">{formatDate(organization.verified_at)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent"
                  />
                </div>
                <select
                  value={eventTypeFilter}
                  onChange={(e) => setEventTypeFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="course">Courses</option>
                  <option value="certification">Certifications</option>
                  <option value="training">Training</option>
                  <option value="workshop">Workshops</option>
                  <option value="conference">Conferences</option>
                  <option value="seminar">Seminars</option>
                  <option value="award">Awards</option>
                  <option value="competition">Competitions</option>
                </select>
                <div className="flex items-center justify-end">
                  <span className="text-sm text-gray-600">
                    {events.length} event{events.length !== 1 ? 's' : ''} found
                  </span>
                </div>
              </div>
            </div>

            {/* Events List */}
            {eventsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a5d23]"></div>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Found</h3>
                <p className="text-gray-600">
                  This organization hasn't published any events yet, or no events match your filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#4a5d23] rounded-lg flex items-center justify-center">
                            <span className="text-xl">{getEventTypeIcon(event.event_type)}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                              {event.title}
                            </h3>
                            <p className="text-sm text-gray-600 capitalize">
                              {event.event_type?.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                        {isEventUpcoming(event.event_date) && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Upcoming
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {event.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FiCalendar size={14} />
                          <span>Event Date: {formatDate(event.event_date)}</span>
                        </div>
                        {event.application_deadline && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiClock size={14} />
                            <span>Deadline: {formatDate(event.application_deadline)}</span>
                          </div>
                        )}
                        {event.requires_verification && (
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <FiFileText size={14} />
                            <span>Certificate verification available</span>
                          </div>
                        )}
                      </div>

                      <Link
                        to={`/events/${event.id}`}
                        className="block w-full bg-[#4a5d23] text-white text-center py-3 px-4 rounded-lg hover:bg-[#3a4d1a] transition-colors font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Verification Tab */}
        {activeTab === 'verification' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Certificate Verification</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">How to Verify Your Certificate</h4>
                  <ol className="space-y-3 text-sm text-gray-600">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#4a5d23] text-white rounded-full flex items-center justify-center text-xs font-medium">1</span>
                      <span>Find the event or course you attended from this organization</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#4a5d23] text-white rounded-full flex items-center justify-center text-xs font-medium">2</span>
                      <span>Click on the event to view its details</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#4a5d23] text-white rounded-full flex items-center justify-center text-xs font-medium">3</span>
                      <span>Submit your certificate for verification if the option is available</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#4a5d23] text-white rounded-full flex items-center justify-center text-xs font-medium">4</span>
                      <span>Wait for the organization to review and verify your certificate</span>
                    </li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Verification Benefits</h4>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-center gap-3">
                      <FiCheckCircle className="text-green-500" size={16} />
                      <span>Official verification from the issuing organization</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <FiShield className="text-green-500" size={16} />
                      <span>Secure and tamper-proof verification record</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <FiAward className="text-green-500" size={16} />
                      <span>Enhanced credibility for your achievements</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <FiUsers className="text-green-500" size={16} />
                      <span>Trusted by employers and institutions</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <FiFileText className="text-blue-600 mt-1" size={20} />
                  <div>
                    <h5 className="font-medium text-blue-900">Need Help?</h5>
                    <p className="text-blue-800 text-sm mt-1">
                      If you're having trouble verifying your certificate, please contact {organization.name} directly 
                      at {organization.email} or visit their website for support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicOrganizationProfile;
