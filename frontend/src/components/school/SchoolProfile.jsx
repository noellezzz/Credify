import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchSchoolProfile, 
  updateSchoolProfile,
  clearError 
} from '../../features/school/schoolSlice';
import { 
  selectSchoolProfile, 
  selectSchoolLoading, 
  selectSchoolError 
} from '../../features/school/schoolSelector';
import { formatErrorMessage, getErrorType, getErrorIcon, getErrorColorClass } from '../../utils/errorHandler';
import { FiEdit3, FiSave, FiX, FiMapPin, FiPhone, FiMail, FiGlobe } from 'react-icons/fi';

const SchoolProfile = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectSchoolProfile);
  const loading = useSelector(selectSchoolLoading);
  const error = useSelector(selectSchoolError);
  
  const errorType = getErrorType(error);
  const errorMessage = formatErrorMessage(error);
  const errorIcon = getErrorIcon(errorType);
  const errorColorClass = getErrorColorClass(errorType);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    website: '',
    description: ''
  });

  useEffect(() => {
    dispatch(fetchSchoolProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        address: profile.address || '',
        phone: profile.phone || '',
        website: profile.website || '',
        description: profile.description || ''
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
    await dispatch(updateSchoolProfile(formData));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      email: profile?.email || '',
      address: profile?.address || '',
      phone: profile?.phone || '',
      website: profile?.website || '',
      description: profile?.description || ''
    });
    setIsEditing(false);
  };

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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">School Profile</h1>
        <p className="text-gray-600">Manage your school information and settings</p>
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
                {isEditing ? 'Edit Profile' : profile?.name || 'School Name'}
              </h2>
              <p className="text-[#a8b4a5] mt-1">
                {profile?.verification_status === 'verified' ? '✓ Verified School' : 'Pending Verification'}
              </p>
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
              {/* School Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Name *
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
                  placeholder="Enter your school address..."
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                  placeholder="Tell us about your school..."
                />
              </div>
            </div>
          </form>

          {/* Stats Section */}
          {!isEditing && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">School Statistics</h3>
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
        </div>
      </div>
    </div>
  );
};

export default SchoolProfile; 