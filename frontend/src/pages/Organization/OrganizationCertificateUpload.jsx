import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaLock } from "react-icons/fa";

// Correct imports from slice and selectors
import { 
  uploadCertificateBase64, 
  clearStatus 
} from "../../features/certificates/certificatesSlice";
import {
  selectIsLoading,
  selectError,
  selectSuccessMessage,
  selectUploadedImageUrl,
} from "../../features/certificates/certificatesSelector";
import { 
  selectCurrentOrganization,
  selectIsOrganizationVerified
} from "../../features/organizationAuth/organizationAuthSelectors";

const OrganizationCertificateUpload = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selectors from certificates feature
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const successMessage = useSelector(selectSuccessMessage);
  const uploadedImageUrl = useSelector(selectUploadedImageUrl);

  // Selectors from organization auth
  const organization = useSelector(selectCurrentOrganization);
  const isVerified = useSelector(selectIsOrganizationVerified);

  const [file, setFile] = useState(null);
  const [eventId, setEventId] = useState("");

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  const handleFileChange = (e) => {
    dispatch(clearStatus());
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    try {
      const base64Data = await fileToBase64(file);
      dispatch(uploadCertificateBase64({ 
        fileData: base64Data, 
        userId: organization.id,
        organizationId: organization.id,
        eventId: eventId 
      }));
    } catch {
      alert("Failed to read file.");
    }
  };

  if (!isVerified) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-2xl mx-auto mt-8">
        <div className="text-center py-12">
          <FaLock className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Verified Organization Required
          </h3>
          <p className="text-gray-600 mb-4">
            Only verified organizations can upload certificates.
          </p>
          <button
            onClick={() => navigate("/organization/profile")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Complete Verification
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-2xl mx-auto mt-8">
      <div className="border-b pb-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center">
          <FaUpload className="w-6 h-6 mr-3" />
          Organization Certificate Upload
        </h1>
        <p className="text-sm text-gray-600 mt-2 text-center">
          Upload certificates for your organization's events
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event ID (Optional)
          </label>
          <input
            type="text"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            placeholder="Enter event ID if applicable"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Certificate File
          </label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            disabled={isLoading}
            className={`block w-full rounded-lg border-2 border-dashed p-6 text-center cursor-pointer
              ${file ? "border-green-400 bg-green-50" : "border-gray-300"}
              ${isLoading ? "opacity-60 cursor-not-allowed" : ""}
            `}
          />
          {file && (
            <div className="text-green-600 font-medium text-center text-sm mt-2">
              ✓ File Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <FaUpload className="inline mr-2" />
          {isLoading ? "Uploading..." : "Upload Certificate"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mt-4 p-4 bg-green-50 text-green-600 rounded-lg">
          {successMessage}
        </div>
      )}
      {uploadedImageUrl && (
        <div className="mt-6 border rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2">Preview:</h3>
          {uploadedImageUrl.endsWith('.pdf') ? (
            <iframe 
              src={uploadedImageUrl} 
              className="w-full h-96 border-0"
              title="Certificate Preview"
            />
          ) : (
            <img 
              src={uploadedImageUrl} 
              alt="Uploaded certificate" 
              className="max-w-full max-h-96 mx-auto"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default OrganizationCertificateUpload;