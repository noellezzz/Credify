import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios"; // same pattern as your login example

const initialState = {
  isLoading: false,
  error: null,
  uploadedImageUrl: "",
  successMessage: "",
};

export const uploadCertificateBase64 = createAsyncThunk(
  "certificates/uploadCertificateBase64",
  async ({ fileData, userId }, { rejectWithValue }) => {
    try {
      const res = await axios.post("/certificates/upload-base64", {
        fileData,
        userId,
        mode: "process",
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const certificatesSlice = createSlice({
  name: "certificates",
  initialState,
  reducers: {
    clearStatus(state) {
      state.error = null;
      state.successMessage = "";
      state.uploadedImageUrl = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadCertificateBase64.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = "";
        state.uploadedImageUrl = "";
      })
      .addCase(uploadCertificateBase64.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
        state.uploadedImageUrl = action.payload.imageUrl;
      })
      .addCase(uploadCertificateBase64.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Upload failed";
      });
  },
});

export const { clearStatus } = certificatesSlice.actions;
export default certificatesSlice.reducer;
