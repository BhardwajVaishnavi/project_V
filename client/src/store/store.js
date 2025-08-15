import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import patientSlice from './slices/patientSlice';
import investigationSlice from './slices/investigationSlice';
import treatmentSlice from './slices/treatmentSlice';
import surgerySlice from './slices/surgerySlice';
import liverTransplantSlice from './slices/liverTransplantSlice';
import followUpSlice from './slices/followUpSlice';
import fileSlice from './slices/fileSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    patients: patientSlice,
    investigations: investigationSlice,
    treatments: treatmentSlice,
    surgery: surgerySlice,
    liverTransplant: liverTransplantSlice,
    followUp: followUpSlice,
    files: fileSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
