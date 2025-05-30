import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadCertificateBase64, clearStatus } from "../features/OCR/ocrSlice";
import {
  selectIsLoading,
  selectError,
  selectSuccessMessage,
  selectUploadedImageUrl,
} from "../features/OCR/ocrSelector";

const CertificateUpload = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const successMessage = useSelector(selectSuccessMessage);
  const uploadedImageUrl = useSelector(selectUploadedImageUrl);

  const [file, setFile] = useState(null);

  // Convert file to base64 string
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
      dispatch(uploadCertificateBase64({ fileData: base64Data, userId: null }));
    } catch {
      alert("Failed to read file.");
    }
  };

  return (
    <div className="bg-[var(--primary-color)] p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 min-h-screen max-w-xl mx-auto">
      {/* Header */}
      <div className="border-b pb-3 sm:pb-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 text-center">
          Upload Certificate
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 text-center">
          Upload your certificate file below
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--quaternary-color)] rounded-lg border p-4 sm:p-6 space-y-6"
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isLoading}
          className={`block w-full rounded-lg border-2 border-dashed p-6 text-center cursor-pointer
            ${
              file
                ? "border-green-400 bg-green-50"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }
            ${isLoading ? "opacity-60 cursor-not-allowed" : ""}
          `}
        />
        {file && (
          <div className="text-green-600 font-medium text-center text-sm sm:text-base break-all">
            ✓ File Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{" "}
            MB)
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2.5 bg-[var(--secondary-color)] text-white rounded-lg hover:bg-[var(--quaternary-color)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base font-medium shadow-sm"
        >
          {isLoading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {/* Messages */}
      {error && (
        <p className="text-red-600 mt-3 text-center text-sm sm:text-base">
          {error}
        </p>
      )}
      {successMessage && (
        <p className="text-green-600 mt-3 text-center text-sm sm:text-base">
          {successMessage}
        </p>
      )}
      {uploadedImageUrl && (
        <div className="mt-6 flex justify-center">
          <img
            src={uploadedImageUrl}
            alt="Uploaded certificate"
            className="max-w-full rounded shadow"
          />
        </div>
      )}
    </div>
  );
};

export default CertificateUpload;
