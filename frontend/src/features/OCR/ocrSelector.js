// src/features/ocr/ocrSelector.js
export const selectIsLoading = (state) => state.ocr.isLoading;
export const selectError = (state) => state.ocr.error;
export const selectSuccessMessage = (state) => state.ocr.successMessage;
export const selectUploadedImageUrl = (state) => state.ocr.uploadedImageUrl;

