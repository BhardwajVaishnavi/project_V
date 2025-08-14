import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import patientService from '../../services/patientService';

const initialState = {
  patients: [],
  currentPatient: null,
  searchSuggestions: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
  },
  filters: {
    search: '',
    sex: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Get all patients
export const getPatients = createAsyncThunk(
  'patients/getAll',
  async (params, thunkAPI) => {
    try {
      return await patientService.getPatients(params);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get patient by ID
export const getPatientById = createAsyncThunk(
  'patients/getById',
  async (id, thunkAPI) => {
    try {
      return await patientService.getPatientById(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create patient
export const createPatient = createAsyncThunk(
  'patients/create',
  async (patientData, thunkAPI) => {
    try {
      return await patientService.createPatient(patientData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update patient
export const updatePatient = createAsyncThunk(
  'patients/update',
  async ({ id, patientData }, thunkAPI) => {
    try {
      return await patientService.updatePatient(id, patientData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete patient
export const deletePatient = createAsyncThunk(
  'patients/delete',
  async (id, thunkAPI) => {
    try {
      await patientService.deletePatient(id);
      return id;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get search suggestions
export const getSearchSuggestions = createAsyncThunk(
  'patients/getSearchSuggestions',
  async (query, thunkAPI) => {
    try {
      return await patientService.getSearchSuggestions(query);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const patientSlice = createSlice({
  name: 'patients',
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
    clearCurrentPatient: (state) => {
      state.currentPatient = null;
    },
    clearSearchSuggestions: (state) => {
      state.searchSuggestions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPatients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPatients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.patients = action.payload.patients;
        state.pagination = action.payload.pagination;
      })
      .addCase(getPatients.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPatientById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPatientById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentPatient = action.payload.patient;
      })
      .addCase(getPatientById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createPatient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.patients.unshift(action.payload.patient);
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updatePatient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.patients.findIndex(
          (patient) => patient.id === action.payload.patient.id
        );
        if (index !== -1) {
          state.patients[index] = action.payload.patient;
        }
        if (state.currentPatient?.id === action.payload.patient.id) {
          state.currentPatient = action.payload.patient;
        }
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deletePatient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.patients = state.patients.filter(
          (patient) => patient.id !== action.payload
        );
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getSearchSuggestions.fulfilled, (state, action) => {
        state.searchSuggestions = action.payload.suggestions;
      });
  },
});

export const {
  reset,
  clearError,
  setFilters,
  clearCurrentPatient,
  clearSearchSuggestions,
} = patientSlice.actions;
export default patientSlice.reducer;
