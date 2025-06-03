import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserCertificates, clearError } from "../features/certificates/userCertificatesSlice";
import {
  selectUserCertificates,
  selectUserCertificatesLoading,
  selectUserCertificatesError,
  selectUserCertificatesTotalCount,
} from "../features/certificates/userCertificatesSelector";
import { selectUserId } from "../features/user/userSelector";
import { LuFileText, LuEye, LuDownload, LuCalendar, LuHash } from "react-icons/lu";

const CertificatesList = () => {
  const dispatch = useDispatch();
  const certificates = useSelector(selectUserCertificates);
  const isLoading = useSelector(selectUserCertificatesLoading);
  const error = useSelector(selectUserCertificatesError);
  const totalCount = useSelector(selectUserCertificatesTotalCount);
  const userId = useSelector(selectUserId);

  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserCertificates({ userId }));
    }
  }, [dispatch, userId]);

  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCertificate(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const truncateHash = (hash) => {
    if (!hash) return 'N/A';
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  if (isLoading) {
    return (
      <div className="bg-[var(--primary-color)] p-4 sm:p-6 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading certificates...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--primary-color)] p-4 sm:p-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="border-b pb-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Certificates</h1>
          <p className="text-gray-600 mt-2">
            {totalCount > 0 ? `${totalCount} certificate${totalCount !== 1 ? 's' : ''} found` : 'No certificates uploaded yet'}
          </p>
        </div>

        {/* Error Message */}
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

        {/* Certificates Grid */}
        {certificates.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((certificate) => (
              <div
                key={certificate.id}
                className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {/* Certificate Image */}
                <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                  {certificate.image_url ? (
                    <img
                      src={certificate.image_url}
                      alt={certificate.certificate_name || 'Certificate'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <LuFileText className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Certificate Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 truncate">
                    {certificate.certificate_name || 'Untitled Certificate'}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <LuCalendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(certificate.created_at)}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <LuFileText className="w-4 h-4 mr-2" />
                      <span className="capitalize">{certificate.file_type || 'Unknown'}</span>
                      {certificate.file_size && (
                        <span className="ml-2">({formatFileSize(certificate.file_size)})</span>
                      )}
                    </div>

                    {certificate.file_hash && (
                      <div className="flex items-center">
                        <LuHash className="w-4 h-4 mr-2" />
                        <span className="font-mono text-xs">{truncateHash(certificate.file_hash)}</span>
                      </div>
                    )}

                    <div className="flex items-center">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        certificate.verification_status === 'verified' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {certificate.verification_status || 'Unknown'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleViewCertificate(certificate)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"
                    >
                      <LuEye className="w-4 h-4 mr-2" />
                      View
                    </button>
                    {certificate.image_url && (
                      <a
                        href={certificate.image_url}
                        download
                        className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center justify-center"
                      >
                        <LuDownload className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !isLoading && (
          <div className="text-center py-12">
            <LuFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates found</h3>
            <p className="text-gray-600">
              You haven't uploaded any certificates yet. Start by uploading your first certificate.
            </p>
          </div>
        )}

        {/* Modal for viewing certificate details */}
        {showModal && selectedCertificate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedCertificate.certificate_name || 'Certificate Details'}
                  </h2>
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
                      className="w-full rounded-lg border"
                    />
                  </div>
                )}

                {/* Certificate Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Certificate Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">ID:</span> {selectedCertificate.id}
                      </div>
                      <div>
                        <span className="font-medium">Type:</span> {selectedCertificate.file_type}
                      </div>
                      <div>
                        <span className="font-medium">Size:</span> {formatFileSize(selectedCertificate.file_size)}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span> {selectedCertificate.verification_status}
                      </div>
                      <div>
                        <span className="font-medium">Created:</span> {formatDate(selectedCertificate.created_at)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Security Hashes</h3>
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
                    <h3 className="font-semibold text-gray-900 mb-3">Extracted Text Content</h3>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm max-h-40 overflow-y-auto">
                      <pre className="whitespace-pre-wrap">{selectedCertificate.ocr_content}</pre>
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

export default CertificatesList;