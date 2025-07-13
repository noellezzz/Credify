import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "@/utils/axios";
import { selectUser } from "@/features/user/userSelector";
import Swal from "sweetalert2";

const SchoolReview = () => {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("Pending");
  const [isProcessing, setIsProcessing] = useState(false);
  const user = useSelector(selectUser);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/schools");
      setSchools(response.data.data || []);
    } catch (error) {
      console.error("Error fetching schools:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch schools. Please try again.",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (
    schoolId,
    newStatus,
    rejectionReason = null
  ) => {
    try {
      setIsProcessing(true);

      const payload = {
        status: newStatus,
        verified_by: user.auth_id,
        rejection_reason: rejectionReason,
      };

      const response = await axios.put(`/schools/${schoolId}/`, payload);

      if (response.data.success) {
        // Update local state
        setSchools(
          schools.map((school) =>
            school.id === schoolId
              ? { ...school, status: newStatus, verified_by: user.auth_id }
              : school
          )
        );

        // Close modal if open
        setSelectedSchool(null);

        Swal.fire({
          title: "Success",
          text: `School ${newStatus.toLowerCase()} successfully`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        // Refresh the list
        fetchSchools();
      }
    } catch (error) {
      console.error("Error updating school status:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.error || "Failed to update school status",
        icon: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprove = (schoolId) => {
    Swal.fire({
      title: "Approve School",
      text: "Are you sure you want to approve this school?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        handleStatusUpdate(schoolId, "Verified");
      }
    });
  };

  const handleReject = (schoolId) => {
    Swal.fire({
      title: "Reject School",
      text: "Please provide a reason for rejection:",
      input: "textarea",
      inputPlaceholder: "Enter rejection reason...",
      inputValidator: (value) => {
        if (!value) {
          return "Rejection reason is required";
        }
      },
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Reject",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        handleStatusUpdate(schoolId, "Rejected", result.value);
      }
    });
  };

  const openModal = (school) => {
    setSelectedSchool(school);
  };

  const closeModal = () => {
    setSelectedSchool(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Pending: "bg-yellow-100 text-yellow-800",
      Verified: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
      >
        {status}
      </span>
    );
  };

  // Filter schools based on selected filter
  const filteredSchools = schools.filter((school) => school.status === filter);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              School Review Dashboard
            </h1>
            <div className="flex space-x-2">
              {["Pending", "Verified", "Rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === status
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status} (
                  {schools.filter((school) => school.status === status).length})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Schools List */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredSchools.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No {filter.toLowerCase()} schools found
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      School Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSchools.map((school) => (
                    <tr key={school.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {school.school_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {school.school_type} • Est.{" "}
                            {school.established_year}
                          </div>
                          <div className="text-sm text-gray-500">
                            {school.city}, {school.province}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {school.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {school.phone_number}
                        </div>
                        <div className="text-sm text-gray-500">
                          Principal: {school.principal_name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(school.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(school.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal(school)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            Review
                          </button>
                          {school.status === "Pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(school.id)}
                                disabled={isProcessing}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(school.id)}
                                disabled={isProcessing}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal for detailed review */}
      {selectedSchool && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Review: {selectedSchool.school_name}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* School Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    School Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        School Name
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedSchool.school_name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Type
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedSchool.school_type}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Address
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedSchool.address}, {selectedSchool.city},{" "}
                        {selectedSchool.province} {selectedSchool.zip_code}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Established
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedSchool.established_year}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Student Capacity
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedSchool.student_capacity}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Email
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedSchool.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Phone
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedSchool.phone_number}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Principal
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedSchool.principal_name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Principal Email
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedSchool.principal_email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Principal Phone
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedSchool.principal_phone}
                      </p>
                    </div>
                    {selectedSchool.website_or_facebook && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Website/Facebook
                        </label>
                        <Link
                          to={selectedSchool.website_or_facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 underline block"
                        >
                          {selectedSchool.website_or_facebook}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Required Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      label: "DepEd/CHED/TESDA Certificate",
                      url: selectedSchool.deped_certificate_url,
                    },
                    {
                      label: "SEC Certificate",
                      url: selectedSchool.sec_certificate_url,
                    },
                    {
                      label: "BIR Certificate",
                      url: selectedSchool.bir_certificate_url,
                    },
                    {
                      label: "Business Permit",
                      url: selectedSchool.business_permit_url,
                    },
                    {
                      label: "Letterhead Sample",
                      url: selectedSchool.letterhead_sample_url,
                    },
                    {
                      label: "Principal ID",
                      url: selectedSchool.principal_id_url,
                    },
                  ].map((doc, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <label className="text-sm font-medium text-gray-700">
                        {doc.label}
                      </label>
                      {doc.url ? (
                        <Link
                          to={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block mt-1 text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          View Document
                        </Link>
                      ) : (
                        <p className="text-sm text-red-500 mt-1">
                          No document uploaded
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              {selectedSchool.status === "Pending" && (
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleReject(selectedSchool.id)}
                    disabled={isProcessing}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedSchool.id)}
                    disabled={isProcessing}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
                  >
                    Approve
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

export default SchoolReview;
