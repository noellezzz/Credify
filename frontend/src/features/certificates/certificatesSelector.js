// src/features/ocr/ocrSelector.js
export const selectIsLoading = (state) => state.certificates.isLoading;
export const selectError = (state) => state.certificates.error;
export const selectSuccessMessage = (state) =>
  state.certificates.successMessage;
export const selectUploadedImageUrl = (state) =>
  state.certificates.uploadedImageUrl;
