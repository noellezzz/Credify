import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllCertificates,
  fetchCertificateStats,
  loadMoreCertificates,
  clearError,
  setFilters,
  revokeCertificate,
  clearRevokeError,
} from "../../features/certificates/allCertificatesSlice";
import {
  selectAllCertificates,
  selectAllCertificatesLoading,
  selectAllCertificatesError,
  selectAllCertificatesTotalCount,
  selectAllCertificatesFilters,
  selectHasMoreCertificates,
  selectCertificateStats,
  selectCurrentPage,
  selectTotalPages,
  selectRevokeError,
  selectRevokeLoading,
} from "../../features/certificates/allCertificatesSelector";
// Using FontAwesome icons for better compatibility
import {
  FaFile,
  FaEye,
  FaDownload,
  FaCalendarAlt,
  FaHashtag,
  FaFilter,
  FaChartPie,
  FaSync,
  FaBan,
  FaExclamationTriangle,
} from "react-icons/fa";

const AllCertificatesList = () => {
  const dispatch = useDispatch();
  const certificates = useSelector(selectAllCertificates);
  const isLoading = useSelector(selectAllCertificatesLoading);
  const error = useSelector(selectAllCertificatesError);
  const totalCount = useSelector(selectAllCertificatesTotalCount);
  const filters = useSelector(selectAllCertificatesFilters);
  const hasMore = useSelector(selectHasMoreCertificates);
  const stats = useSelector(selectCertificateStats);
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  const revokeError = useSelector(selectRevokeError);
  const revokeLoading = useSelector(selectRevokeLoading); // Get all revoking states at once

  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [revokeConfirm, setRevokeConfirm] = useState(null);

  useEffect(() => {
    dispatch(fetchAllCertificates(filters));
    dispatch(fetchCertificateStats());
  }, [dispatch]);

  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCertificate(null);
  };

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
    dispatch(fetchAllCertificates({ ...filters, ...newFilters }));
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      dispatch(loadMoreCertificates());
    }
  };

  const handleRefresh = () => {
    dispatch(fetchAllCertificates(filters));
    dispatch(fetchCertificateStats());
  };

  const handleRevokeClick = (certificate) => {
    setRevokeConfirm(certificate);
  };

  const handleRevokeConfirm = async () => {
    if (revokeConfirm) {
      try {
        await dispatch(revokeCertificate(revokeConfirm.id)).unwrap();
        setRevokeConfirm(null);
        // Optionally show success message
      } catch (error) {
        console.error("Failed to revoke certificate:", error);
      }
    }
  };

  const handleRevokeCancel = () => {
    setRevokeConfirm(null);
    dispatch(clearRevokeError());
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const truncateHash = (hash) => {
    if (!hash) return "N/A";
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  // Helper function to check if a certificate is being revoked
  const isRevokingCertificate = (certificateId) => {
    return revokeLoading[certificateId] || false;
  };

  return (
    <div className="bg-[var(--primary-color)] p-4 sm:p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-b pb-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                All Certificates
              </h1>
              <p className="text-gray-600 mt-2">
                {totalCount > 0
                  ? `${totalCount} certificate${
                      totalCount !== 1 ? "s" : ""
                    } found`
                  : "No certificates found"}
              </p>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <button
                onClick={() => setShowStats(!showStats)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <FaChartPie className="w-4 h-4 mr-2" />
                Stats
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <FaFilter className="w-4 h-4 mr-2" />
                Filters
              </button>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                disabled={isLoading}
              >
                <FaSync
                  className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Panel */}
        {showStats && stats && (
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">
              Certificate Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.total}
                </div>
                <div className="text-sm text-gray-600">Total Certificates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatFileSize(stats.totalFileSize)}
                </div>
                <div className="text-sm text-gray-600">Total Storage</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Object.keys(stats.byFileType).length}
                </div>
                <div className="text-sm text-gray-600">File Types</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {stats.byVerificationStatus.verified || 0}
                </div>
                <div className="text-sm text-gray-600">Verified</div>
              </div>
            </div>
          </div>
        )}

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Type
                </label>
                <select
                  value={filters.fileType}
                  onChange={(e) =>
                    handleFilterChange({ fileType: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="image">Image</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.verificationStatus}
                  onChange={(e) =>
                    handleFilterChange({ verificationStatus: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    handleFilterChange({ sortBy: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="created_at">Date Created</option>
                  <option value="certificate_name">Name</option>
                  <option value="file_size">File Size</option>
                  <option value="file_type">File Type</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) =>
                    handleFilterChange({ sortOrder: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Error Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-600 text-sm">
                <strong>Error:</strong> {error}
              </div>
              <button
                onClick={() => dispatch(clearError())}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {revokeError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-600 text-sm">
                <strong>Revoke Error:</strong> {revokeError}
              </div>
              <button
                onClick={() => dispatch(clearRevokeError())}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && certificates.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading certificates...</p>
            </div>
          </div>
        )}

        {/* Certificates Grid */}
        {certificates.length > 0 && (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {certificates.map((certificate) => {
                const isRevokingThis = isRevokingCertificate(certificate.id);
                return (
                  <div
                    key={certificate.id}
                    className={`bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200 ${
                      certificate.revoked ? "opacity-75 border-red-300" : ""
                    }`}
                  >
                    {/* Certificate Image */}
                    <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden relative">
                      {certificate.image_url ? (
                        <img
                          src={certificate.image_url}
                          alt={certificate.certificate_name || "Certificate"}
                          className={`w-full h-full object-cover ${
                            certificate.revoked ? "grayscale" : ""
                          }`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaFile className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      {certificate.revoked && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                          REVOKED
                        </div>
                      )}
                    </div>

                    {/* Certificate Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 truncate">
                        {certificate.certificate_name || "Untitled Certificate"}
                      </h3>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <FaCalendarAlt className="w-4 h-4 mr-2" />
                          <span>{formatDate(certificate.created_at)}</span>
                        </div>

                        <div className="flex items-center">
                          <FaFile className="w-4 h-4 mr-2" />
                          <span className="capitalize">
                            {certificate.file_type || "Unknown"}
                          </span>
                          {certificate.file_size && (
                            <span className="ml-2">
                              ({formatFileSize(certificate.file_size)})
                            </span>
                          )}
                        </div>

                        {certificate.file_hash && (
                          <div className="flex items-center">
                            <FaHashtag className="w-4 h-4 mr-2" />
                            <span className="font-mono text-xs">
                              {truncateHash(certificate.file_hash)}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              certificate.verification_status === "verified"
                                ? "bg-green-100 text-green-800"
                                : certificate.verification_status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {certificate.verification_status || "Unknown"}
                          </span>
                        </div>

                        {certificate.revoked && certificate.revoked_at && (
                          <div className="text-red-600 text-xs">
                            Revoked: {formatDate(certificate.revoked_at)}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleViewCertificate(certificate)}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"
                        >
                          <FaEye className="w-4 h-4 mr-2" />
                          View
                        </button>
                        {certificate.image_url && (
                          <a
                            href={certificate.image_url}
                            download
                            className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center justify-center"
                          >
                            <FaDownload className="w-4 h-4" />
                          </a>
                        )}
                        {!certificate.revoked && (
                          <button
                            onClick={() => handleRevokeClick(certificate)}
                            disabled={isRevokingThis}
                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isRevokingThis ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <FaBan className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between">
              <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                Showing {certificates.length} of {totalCount} certificates
                {totalPages > 1 && (
                  <span className="ml-2">
                    (Page {currentPage} of {totalPages})
                  </span>
                )}
              </div>

              {hasMore && (
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : null}
                  Load More
                </button>
              )}
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && certificates.length === 0 && (
          <div className="text-center py-12">
            <FaFile className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No certificates found
            </h3>
            <p className="text-gray-600">
              {Object.values(filters).some((f) => f)
                ? "Try adjusting your filters to see more results."
                : "No certificates have been uploaded yet."}
            </p>
          </div>
        )}

        {/* Revoke Confirmation Modal */}
        {revokeConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <FaExclamationTriangle className="w-6 h-6 text-red-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Revoke Certificate
                </h3>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to revoke the certificate "
                {revokeConfirm.certificate_name || "Untitled Certificate"}"?
                This action cannot be undone and will mark the certificate as
                invalid.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleRevokeCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRevokeConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Revoke Certificate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for viewing certificate details */}
        {showModal && selectedCertificate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedCertificate.certificate_name ||
                        "Certificate Details"}
                    </h2>
                    {selectedCertificate.revoked && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-2">
                        <FaBan className="w-3 h-3 mr-1" />
                        REVOKED
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* Certificate Image */}
                {selectedCertificate.image_url && (
                  <div className="mb-6">
                    <img
                      src={selectedCertificate.image_url}
                      alt="Certificate"
                      className={`w-full rounded-lg border ${
                        selectedCertificate.revoked ? "grayscale" : ""
                      }`}
                    />
                  </div>
                )}

                {/* Certificate Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Certificate Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">ID:</span>{" "}
                        {selectedCertificate.id}
                      </div>
                      <div>
                        <span className="font-medium">Type:</span>{" "}
                        {selectedCertificate.file_type}
                      </div>
                      <div>
                        <span className="font-medium">Size:</span>{" "}
                        {formatFileSize(selectedCertificate.file_size)}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span>{" "}
                        {selectedCertificate.verification_status}
                      </div>
                      <div>
                        <span className="font-medium">Created:</span>{" "}
                        {formatDate(selectedCertificate.created_at)}
                      </div>
                      {selectedCertificate.revoked &&
                        selectedCertificate.revoked_at && (
                          <div>
                            <span className="font-medium text-red-600">
                              Revoked:
                            </span>{" "}
                            {formatDate(selectedCertificate.revoked_at)}
                          </div>
                        )}
                      {selectedCertificate.user_id && (
                        <div>
                          <span className="font-medium">User ID:</span>{" "}
                          {selectedCertificate.user_id}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Security Hashes
                    </h3>
                    <div className="space-y-2 text-sm">
                      {selectedCertificate.file_hash && (
                        <div>
                          <span className="font-medium">File Hash:</span>
                          <div className="font-mono text-xs break-all mt-1 p-2 bg-gray-100 rounded">
                            {selectedCertificate.file_hash}
                          </div>
                        </div>
                      )}
                      {selectedCertificate.content_hash && (
                        <div>
                          <span className="font-medium">Content Hash:</span>
                          <div className="font-mono text-xs break-all mt-1 p-2 bg-gray-100 rounded">
                            {selectedCertificate.content_hash}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* OCR Content */}
                {selectedCertificate.ocr_content && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Extracted Text Content
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm max-h-40 overflow-y-auto">
                      <pre className="whitespace-pre-wrap">
                        {selectedCertificate.ocr_content}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCertificatesList;
