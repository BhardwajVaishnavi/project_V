import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import treatmentService from '../../services/treatmentService';

const initialState = {
  treatments: [],
  currentTreatment: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
  },
  filters: {
    search: '',
    primaryTreatmentPlan: '',
    patientId: '',
  },
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Async thunks
export const getTreatments = createAsyncThunk(
  'treatments/getAll',
  async (params, thunkAPI) => {
    try {
      return await treatmentService.getTreatments(params);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getTreatmentById = createAsyncThunk(
  'treatments/getById',
  async (id, thunkAPI) => {
    try {
      return await treatmentService.getTreatmentById(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createTreatment = createAsyncThunk(
  'treatments/create',
  async (treatmentData, thunkAPI) => {
    try {
      return await treatmentService.createTreatment(treatmentData);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateTreatment = createAsyncThunk(
  'treatments/update',
  async ({ id, treatmentData }, thunkAPI) => {
    try {
      return await treatmentService.updateTreatment(id, treatmentData);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteTreatment = createAsyncThunk(
  'treatments/delete',
  async (id, thunkAPI) => {
    try {
      await treatmentService.deleteTreatment(id);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const treatmentSlice = createSlice({
  name: 'treatments',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearError: (state) => {
      state.isError = false;
      state.message = '';
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentTreatment: (state) => {
      state.currentTreatment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTreatments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTreatments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.treatments = action.payload.treatments;
        state.pagination = action.payload.pagination;
      })
      .addCase(getTreatments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTreatmentById.fulfilled, (state, action) => {
        state.currentTreatment = action.payload.treatment;
      })
      .addCase(createTreatment.fulfilled, (state, action) => {
        state.treatments.unshift(action.payload.treatment);
      })
      .addCase(updateTreatment.fulfilled, (state, action) => {
        const index = state.treatments.findIndex(
          (treatment) => treatment.id === action.payload.treatment.id
        );
        if (index !== -1) {
          state.treatments[index] = action.payload.treatment;
        }
      })
      .addCase(deleteTreatment.fulfilled, (state, action) => {
        state.treatments = state.treatments.filter(
          (treatment) => treatment.id !== action.payload
        );
      });
  },
});

export const { reset, clearError, setFilters, clearCurrentTreatment } = treatmentSlice.actions;
export default treatmentSlice.reducer;
