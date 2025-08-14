import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import liverTransplantService from '../../services/liverTransplantService';

const initialState = {
  evaluations: [],
  currentEvaluation: null,
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

export const getEvaluations = createAsyncThunk(
  'liverTransplant/getAll',
  async (params, thunkAPI) => {
    try {
      return await liverTransplantService.getEvaluations(params);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getEvaluationById = createAsyncThunk(
  'liverTransplant/getById',
  async (id, thunkAPI) => {
    try {
      return await liverTransplantService.getEvaluationById(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createEvaluation = createAsyncThunk(
  'liverTransplant/create',
  async (evaluationData, thunkAPI) => {
    try {
      return await liverTransplantService.createEvaluation(evaluationData);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateEvaluation = createAsyncThunk(
  'liverTransplant/update',
  async ({ id, evaluationData }, thunkAPI) => {
    try {
      return await liverTransplantService.updateEvaluation(id, evaluationData);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateViralMarkers = createAsyncThunk(
  'liverTransplant/updateViralMarkers',
  async ({ id, viralMarkersData }, thunkAPI) => {
    try {
      return await liverTransplantService.updateViralMarkers(id, viralMarkersData);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateClearances = createAsyncThunk(
  'liverTransplant/updateClearances',
  async ({ id, clearancesData }, thunkAPI) => {
    try {
      return await liverTransplantService.updateClearances(id, clearancesData);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getEvaluationProgress = createAsyncThunk(
  'liverTransplant/getProgress',
  async (id, thunkAPI) => {
    try {
      return await liverTransplantService.getEvaluationProgress(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const liverTransplantSlice = createSlice({
  name: 'liverTransplant',
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
    clearCurrentEvaluation: (state) => {
      state.currentEvaluation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEvaluations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEvaluations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.evaluations = action.payload.evaluations;
        state.pagination = action.payload.pagination;
      })
      .addCase(getEvaluations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getEvaluationById.fulfilled, (state, action) => {
        state.currentEvaluation = action.payload.evaluation;
      })
      .addCase(createEvaluation.fulfilled, (state, action) => {
        state.evaluations.unshift(action.payload.evaluation);
      })
      .addCase(updateEvaluation.fulfilled, (state, action) => {
        const index = state.evaluations.findIndex(
          (evaluation) => evaluation.id === action.payload.evaluation.id
        );
        if (index !== -1) {
          state.evaluations[index] = action.payload.evaluation;
        }
        if (state.currentEvaluation?.id === action.payload.evaluation.id) {
          state.currentEvaluation = action.payload.evaluation;
        }
      });
  },
});

export const { reset, clearError, setFilters, clearCurrentEvaluation } = liverTransplantSlice.actions;
export default liverTransplantSlice.reducer;
