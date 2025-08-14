import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import surgeryService from '../../services/surgeryService';

const initialState = {
  surgeries: [],
  currentSurgery: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
  },
  filters: {
    search: '',
    patientId: '',
  },
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

export const getSurgeries = createAsyncThunk(
  'surgery/getAll',
  async (params, thunkAPI) => {
    try {
      return await surgeryService.getSurgeries(params);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getSurgeryById = createAsyncThunk(
  'surgery/getById',
  async (id, thunkAPI) => {
    try {
      return await surgeryService.getSurgeryById(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createSurgery = createAsyncThunk(
  'surgery/create',
  async (surgeryData, thunkAPI) => {
    try {
      return await surgeryService.createSurgery(surgeryData);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateSurgery = createAsyncThunk(
  'surgery/update',
  async ({ id, surgeryData }, thunkAPI) => {
    try {
      return await surgeryService.updateSurgery(id, surgeryData);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteSurgery = createAsyncThunk(
  'surgery/delete',
  async (id, thunkAPI) => {
    try {
      await surgeryService.deleteSurgery(id);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const surgerySlice = createSlice({
  name: 'surgery',
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
    clearCurrentSurgery: (state) => {
      state.currentSurgery = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSurgeries.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSurgeries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.surgeries = action.payload.surgeries;
        state.pagination = action.payload.pagination;
      })
      .addCase(getSurgeries.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getSurgeryById.fulfilled, (state, action) => {
        state.currentSurgery = action.payload.surgery;
      })
      .addCase(createSurgery.fulfilled, (state, action) => {
        state.surgeries.unshift(action.payload.surgery);
      })
      .addCase(updateSurgery.fulfilled, (state, action) => {
        const index = state.surgeries.findIndex(
          (surgery) => surgery.id === action.payload.surgery.id
        );
        if (index !== -1) {
          state.surgeries[index] = action.payload.surgery;
        }
      })
      .addCase(deleteSurgery.fulfilled, (state, action) => {
        state.surgeries = state.surgeries.filter(
          (surgery) => surgery.id !== action.payload
        );
      });
  },
});

export const { reset, clearError, setFilters, clearCurrentSurgery } = surgerySlice.actions;
export default surgerySlice.reducer;
