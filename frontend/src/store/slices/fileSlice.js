import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fileService from '../../services/fileService';

const initialState = {
  files: [],
  uploadProgress: 0,
  isUploading: false,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

export const uploadFile = createAsyncThunk(
  'files/upload',
  async (fileData, thunkAPI) => {
    try {
      return await fileService.uploadFile(fileData);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const uploadMultipleFiles = createAsyncThunk(
  'files/uploadMultiple',
  async (fileData, thunkAPI) => {
    try {
      return await fileService.uploadMultipleFiles(fileData);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getPatientFiles = createAsyncThunk(
  'files/getPatientFiles',
  async ({ patientId, documentType, category }, thunkAPI) => {
    try {
      return await fileService.getPatientFiles(patientId, documentType, category);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getDownloadUrl = createAsyncThunk(
  'files/getDownloadUrl',
  async (fileId, thunkAPI) => {
    try {
      return await fileService.getDownloadUrl(fileId);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteFile = createAsyncThunk(
  'files/delete',
  async (fileId, thunkAPI) => {
    try {
      await fileService.deleteFile(fileId);
      return fileId;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.isUploading = false;
      state.uploadProgress = 0;
    },
    clearError: (state) => {
      state.isError = false;
      state.message = '';
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    clearFiles: (state) => {
      state.files = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.isUploading = true;
        state.uploadProgress = 0;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.isUploading = false;
        state.isSuccess = true;
        state.uploadProgress = 100;
        state.files.unshift(action.payload.document);
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.isUploading = false;
        state.isError = true;
        state.message = action.payload;
        state.uploadProgress = 0;
      })
      .addCase(uploadMultipleFiles.pending, (state) => {
        state.isUploading = true;
        state.uploadProgress = 0;
      })
      .addCase(uploadMultipleFiles.fulfilled, (state, action) => {
        state.isUploading = false;
        state.isSuccess = true;
        state.uploadProgress = 100;
        state.files.unshift(...action.payload.documents);
      })
      .addCase(uploadMultipleFiles.rejected, (state, action) => {
        state.isUploading = false;
        state.isError = true;
        state.message = action.payload;
        state.uploadProgress = 0;
      })
      .addCase(getPatientFiles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPatientFiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.files = action.payload.documents;
      })
      .addCase(getPatientFiles.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.files = state.files.filter(
          (file) => file.id !== action.payload
        );
      });
  },
});

export const { reset, clearError, setUploadProgress, clearFiles } = fileSlice.actions;
export default fileSlice.reducer;
