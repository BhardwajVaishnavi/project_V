import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import investigationService from '../../services/investigationService';

const initialState = {
  investigations: [],
  currentInvestigation: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
  },
  filters: {
    search: '',
    investigationType: '',
    status: '',
    patientId: '',
  },
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Get all investigations
export const getInvestigations = createAsyncThunk(
  'investigations/getAll',
  async (params, thunkAPI) => {
    try {
      return await investigationService.getInvestigations(params);
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

// Get investigation by ID
export const getInvestigationById = createAsyncThunk(
  'investigations/getById',
  async (id, thunkAPI) => {
    try {
      return await investigationService.getInvestigationById(id);
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

// Create investigation
export const createInvestigation = createAsyncThunk(
  'investigations/create',
  async (investigationData, thunkAPI) => {
    try {
      return await investigationService.createInvestigation(investigationData);
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

// Update investigation
export const updateInvestigation = createAsyncThunk(
  'investigations/update',
  async ({ id, investigationData }, thunkAPI) => {
    try {
      return await investigationService.updateInvestigation(id, investigationData);
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

// Delete investigation
export const deleteInvestigation = createAsyncThunk(
  'investigations/delete',
  async (id, thunkAPI) => {
    try {
      await investigationService.deleteInvestigation(id);
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

export const investigationSlice = createSlice({
  name: 'investigations',
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
    clearCurrentInvestigation: (state) => {
      state.currentInvestigation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getInvestigations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInvestigations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.investigations = action.payload.investigations;
        state.pagination = action.payload.pagination;
      })
      .addCase(getInvestigations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getInvestigationById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInvestigationById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentInvestigation = action.payload.investigation;
      })
      .addCase(getInvestigationById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createInvestigation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createInvestigation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.investigations.unshift(action.payload.investigation);
      })
      .addCase(createInvestigation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateInvestigation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateInvestigation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.investigations.findIndex(
          (investigation) => investigation.id === action.payload.investigation.id
        );
        if (index !== -1) {
          state.investigations[index] = action.payload.investigation;
        }
        if (state.currentInvestigation?.id === action.payload.investigation.id) {
          state.currentInvestigation = action.payload.investigation;
        }
      })
      .addCase(updateInvestigation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteInvestigation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteInvestigation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.investigations = state.investigations.filter(
          (investigation) => investigation.id !== action.payload
        );
      })
      .addCase(deleteInvestigation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const {
  reset,
  clearError,
  setFilters,
  clearCurrentInvestigation,
} = investigationSlice.actions;
export default investigationSlice.reducer;
