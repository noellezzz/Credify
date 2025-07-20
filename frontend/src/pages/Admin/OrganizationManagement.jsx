import React, { useState, useEffect } from 'react';
import { 
  FiEye, 
  FiCheck, 
  FiX, 
  FiSearch, 
  FiFilter,
  FiDownload,
  FiShield,
  FiClock,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import axios from '../../utils/axios';
import Swal from 'sweetalert2';

const OrganizationManagement = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an admin endpoint
      const response = await axios.get('/admin/organizations');
      setOrganizations(response.data.data || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to fetch organizations',
        icon: 'error',
        confirmButtonColor: '#4a5d23',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOrganization = async (organizationId) => {
    try {
      const result = await Swal.fire({
        title: 'Verify Organization',
        text: 'Are you sure you want to verify this organization?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#4a5d23',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, verify it!'
      });

      if (result.isConfirmed) {
        await axios.put(`/admin/organizations/${organizationId}/verify`);
        
        Swal.fire({
          title: 'Verified!',
          text: 'Organization has been successfully verified.',
          icon: 'success',
          confirmButtonColor: '#4a5d23',
        });

        fetchOrganizations(); // Refresh the list
      }
    } catch (error) {
      console.error('Error verifying organization:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to verify organization',
        icon: 'error',
        confirmButtonColor: '#4a5d23',
      });
    }
  };

  const handleRejectOrganization = async (organizationId) => {
    try {
      const { value: reason } = await Swal.fire({
        title: 'Reject Organization',
        input: 'textarea',
        inputLabel: 'Rejection Reason',
        inputPlaceholder: 'Please provide a reason for rejection...',
        inputAttributes: {
          'aria-label': 'Rejection reason'
        },
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Reject',
        inputValidator: (value) => {
          if (!value) {
            return 'You need to provide a reason for rejection!'
          }
        }
      });

      if (reason) {
        await axios.put(`/admin/organizations/${organizationId}/reject`, {
          reason: reason
        });
        
        Swal.fire({
          title: 'Rejected!',
          text: 'Organization has been rejected.',
          icon: 'success',
          confirmButtonColor: '#4a5d23',
        });

        fetchOrganizations(); // Refresh the list
      }
    } catch (error) {
      console.error('Error rejecting organization:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to reject organization',
        icon: 'error',
        confirmButtonColor: '#4a5d23',
      });
    }
  };

  const handleViewDetails = (organization) => {
    setSelectedOrganization(organization);
    setIsModalOpen(true);
  };

  const downloadDocument = async (documentUrl, filename) => {
    try {
      const response = await axios.get(documentUrl, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to download document',
        icon: 'error',
        confirmButtonColor: '#4a5d23',
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <FiCheckCircle className="text-green-500" size={16} />;
      case 'pending':
        return <FiClock className="text-yellow-500" size={16} />;
      case 'rejected':
        return <FiAlertCircle className="text-red-500" size={16} />;
      default:
        return <FiShield className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
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

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = 
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || org.verification_status === statusFilter;
    const matchesType = typeFilter === 'all' || org.organization_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a5d23]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Organization Management</h1>
        <p className="text-gray-600">Review and manage organization verification requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Organizations</p>
              <p className="text-3xl font-bold text-gray-800">{organizations.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiShield className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Verified</p>
              <p className="text-3xl font-bold text-green-600">
                {organizations.filter(org => org.verification_status === 'verified').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FiCheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-3xl font-bold text-yellow-600">
                {organizations.filter(org => org.verification_status === 'pending').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FiClock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-3xl font-bold text-red-600">
                {organizations.filter(org => org.verification_status === 'rejected').length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <FiAlertCircle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="university">University</option>
            <option value="college">College</option>
            <option value="training_center">Training Center</option>
            <option value="certification_body">Certification Body</option>
            <option value="corporate">Corporate</option>
            <option value="government">Government</option>
            <option value="nonprofit">Non-Profit</option>
            <option value="other">Other</option>
          </select>

          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-600">
              {filteredOrganizations.length} of {organizations.length} organizations
            </span>
          </div>
        </div>
      </div>

      {/* Organizations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-gray-700">Organization</th>
                <th className="px-6 py-4 text-left font-medium text-gray-700">Type</th>
                <th className="px-6 py-4 text-left font-medium text-gray-700">Status</th>
                <th className="px-6 py-4 text-left font-medium text-gray-700">Submitted</th>
                <th className="px-6 py-4 text-center font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrganizations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <div className="text-4xl mb-2">🏢</div>
                    <p className="text-lg font-medium">No organizations found</p>
                    <p className="text-sm">Try adjusting your filters</p>
                  </td>
                </tr>
              ) : (
                filteredOrganizations.map((organization) => (
                  <tr key={organization.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#4a5d23] rounded-lg flex items-center justify-center">
                          {organization.logo_url ? (
                            <img 
                              src={organization.logo_url} 
                              alt="Logo" 
                              className="w-full h-full rounded-lg object-cover"
                            />
                          ) : (
                            <span className="text-lg">
                              {getTypeIcon(organization.organization_type)}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{organization.name}</h3>
                          <p className="text-sm text-gray-600">{organization.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTypeIcon(organization.organization_type)}</span>
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {organization.organization_type?.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(organization.verification_status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(organization.verification_status)}`}>
                          {organization.verification_status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(organization.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewDetails(organization)}
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FiEye size={16} />
                        </button>
                        {organization.verification_status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleVerifyOrganization(organization.id)}
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                              title="Verify"
                            >
                              <FiCheck size={16} />
                            </button>
                            <button
                              onClick={() => handleRejectOrganization(organization.id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <FiX size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Organization Details Modal */}
      {isModalOpen && selectedOrganization && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Organization Details</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                    <p className="text-gray-900">{selectedOrganization.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedOrganization.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <p className="text-gray-900 capitalize">{selectedOrganization.organization_type?.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <p className="text-gray-900">{selectedOrganization.website || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-gray-900">{selectedOrganization.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Established</label>
                    <p className="text-gray-900">{selectedOrganization.established_year || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Address</h3>
                <p className="text-gray-900">{selectedOrganization.address || 'Not provided'}</p>
              </div>

              {/* Description */}
              {selectedOrganization.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Description</h3>
                  <p className="text-gray-900">{selectedOrganization.description}</p>
                </div>
              )}

              {/* Verification Documents */}
              {selectedOrganization.verification_documents && selectedOrganization.verification_documents.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Verification Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedOrganization.verification_documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <span className="text-sm text-gray-700">Document {index + 1}</span>
                        <button
                          onClick={() => downloadDocument(doc, `document-${index + 1}`)}
                          className="flex items-center gap-2 px-3 py-1 text-sm text-[#4a5d23] hover:text-[#3a4d1a] transition-colors"
                        >
                          <FiDownload size={14} />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedOrganization.verification_status === 'pending' && (
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      handleRejectOrganization(selectedOrganization.id);
                    }}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      handleVerifyOrganization(selectedOrganization.id);
                    }}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Verify Organization
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationManagement;
