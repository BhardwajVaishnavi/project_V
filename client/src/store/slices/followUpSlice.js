import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import followUpService from '../../services/followUpService';

const initialState = {
  followUps: [],
  currentFollowUp: null,
  upcomingFollowUps: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
  },
  filters: {
    search: '',
    status: '',
    patientId: '',
    dateFrom: '',
    dateTo: '',
  },
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

export const getFollowUps = createAsyncThunk(
  'followUp/getAll',
  async (params, thunkAPI) => {
    try {
      return await followUpService.getFollowUps(params);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getFollowUpById = createAsyncThunk(
  'followUp/getById',
  async (id, thunkAPI) => {
    try {
      return await followUpService.getFollowUpById(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createFollowUp = createAsyncThunk(
  'followUp/create',
  async (followUpData, thunkAPI) => {
    try {
      return await followUpService.createFollowUp(followUpData);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateFollowUp = createAsyncThunk(
  'followUp/update',
  async ({ id, followUpData }, thunkAPI) => {
    try {
      return await followUpService.updateFollowUp(id, followUpData);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteFollowUp = createAsyncThunk(
  'followUp/delete',
  async (id, thunkAPI) => {
    try {
      await followUpService.deleteFollowUp(id);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUpcomingFollowUps = createAsyncThunk(
  'followUp/getUpcoming',
  async (days, thunkAPI) => {
    try {
      return await followUpService.getUpcomingFollowUps(days);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const followUpSlice = createSlice({
  name: 'followUp',
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
    clearCurrentFollowUp: (state) => {
      state.currentFollowUp = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFollowUps.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFollowUps.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.followUps = action.payload.followUps;
        state.pagination = action.payload.pagination;
      })
      .addCase(getFollowUps.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getFollowUpById.fulfilled, (state, action) => {
        state.currentFollowUp = action.payload.followUp;
      })
      .addCase(createFollowUp.fulfilled, (state, action) => {
        state.followUps.unshift(action.payload.followUp);
      })
      .addCase(updateFollowUp.fulfilled, (state, action) => {
        const index = state.followUps.findIndex(
          (followUp) => followUp.id === action.payload.followUp.id
        );
        if (index !== -1) {
          state.followUps[index] = action.payload.followUp;
        }
      })
      .addCase(deleteFollowUp.fulfilled, (state, action) => {
        state.followUps = state.followUps.filter(
          (followUp) => followUp.id !== action.payload
        );
      })
      .addCase(getUpcomingFollowUps.fulfilled, (state, action) => {
        state.upcomingFollowUps = action.payload.upcomingFollowUps;
      });
  },
});

export const { reset, clearError, setFilters, clearCurrentFollowUp } = followUpSlice.actions;
export default followUpSlice.reducer;
