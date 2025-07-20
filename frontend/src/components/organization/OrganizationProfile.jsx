import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchOrganizationProfile, 
  updateOrganizationProfile,
  clearError 
} from '../../features/organization/organizationSlice';
import { 
  selectOrganizationProfile, 
  selectOrganizationLoading, 
  selectOrganizationError 
} from '../../features/organization/organizationSelector';
import { formatErrorMessage, getErrorType, getErrorIcon, getErrorColorClass } from '../../utils/errorHandler';
import { FiEdit3, FiSave, FiX, FiMapPin, FiPhone, FiMail, FiGlobe, FiShield, FiUpload } from 'react-icons/fi';

const OrganizationProfile = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectOrganizationProfile);
  const loading = useSelector(selectOrganizationLoading);
  const error = useSelector(selectOrganizationError);
  
  const errorType = getErrorType(error);
  const errorMessage = formatErrorMessage(error);
  const errorIcon = getErrorIcon(errorType);
  const errorColorClass = getErrorColorClass(errorType);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    address: '',
    phone: '',
    organization_type: 'university',
    description: '',
    logo_url: ''
  });

  useEffect(() => {
    dispatch(fetchOrganizationProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        website: profile.website || '',
        address: profile.address || '',
        phone: profile.phone || '',
        organization_type: profile.organization_type || 'university',
        description: profile.description || '',
        logo_url: profile.logo_url || ''
      });
    }
  }, [profile]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateOrganizationProfile(formData));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      email: profile?.email || '',
      website: profile?.website || '',
      address: profile?.address || '',
      phone: profile?.phone || '',
      organization_type: profile?.organization_type || 'university',
      description: profile?.description || '',
      logo_url: profile?.logo_url || ''
    });
    setIsEditing(false);
  };

  const getVerificationStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
            <FiShield className="w-4 h-4" />
            Verified Organization
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
            <FiShield className="w-4 h-4" />
            Verification Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
            <FiShield className="w-4 h-4" />
            Verification Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
            <FiShield className="w-4 h-4" />
            Not Verified
          </span>
        );
    }
  };

  const organizationTypes = [
    { value: 'university', label: 'University' },
    { value: 'college', label: 'College' },
    { value: 'training_center', label: 'Training Center' },
    { value: 'certification_body', label: 'Certification Body' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'government', label: 'Government' },
    { value: 'nonprofit', label: 'Non-profit' }
  ];

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a5d23]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Organization Profile</h1>
        <p className="text-gray-600">Manage your organization information and verification status</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className={`mb-6 p-4 border rounded-lg ${errorColorClass}`}>
          <div className="flex items-center gap-3">
            <span className="text-lg">{errorIcon}</span>
            <div className="flex-1">
              <p className="font-medium">{errorMessage}</p>
              <p className="text-sm opacity-75 mt-1">
                Please try again or contact support if the problem persists.
              </p>
            </div>
            <button
              onClick={() => dispatch(clearError())}
              className="p-1 hover:bg-black/10 rounded transition-colors"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header with Edit Button */}
        <div className="bg-gradient-to-r from-[#4a5d23] to-[#6b7c3a] p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold">
                {isEditing ? 'Edit Profile' : profile?.name || 'Organization Name'}
              </h2>
              <div className="mt-2">
                {getVerificationStatusBadge(profile?.verification_status)}
              </div>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <FiEdit3 size={18} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors disabled:opacity-50"
                >
                  <FiSave size={18} />
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <FiX size={18} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Organization Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiMail className="inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiPhone className="inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiGlobe className="inline mr-2" />
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="https://example.com"
                />
              </div>

              {/* Organization Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Type *
                </label>
                <select
                  name="organization_type"
                  value={formData.organization_type}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  required
                >
                  {organizationTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Logo URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiUpload className="inline mr-2" />
                  Logo URL
                </label>
                <input
                  type="url"
                  name="logo_url"
                  value={formData.logo_url}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiMapPin className="inline mr-2" />
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                  placeholder="Enter your organization address..."
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                  placeholder="Tell us about your organization..."
                />
              </div>
            </div>
          </form>

          {/* Stats Section */}
          {!isEditing && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Organization Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#4a5d23]">0</div>
                  <div className="text-sm text-gray-600">Total Events</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#4a5d23]">0</div>
                  <div className="text-sm text-gray-600">Published</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#4a5d23]">0</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#4a5d23]">0</div>
                  <div className="text-sm text-gray-600">Verifications</div>
                </div>
              </div>
            </div>
          )}

          {/* Verification Section */}
          {!isEditing && profile?.verification_status !== 'verified' && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Organization Verification</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 mb-2">
                  Get your organization verified to publish events and build trust with users.
                </p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Submit Verification Documents
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationProfile;
