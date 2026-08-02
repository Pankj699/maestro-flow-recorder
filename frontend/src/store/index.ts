import { configureStore } from '@reduxjs/toolkit';
import deviceReducer from './slices/deviceSlice';
import recordingReducer from './slices/recordingSlice';
import flowReducer from './slices/flowSlice';
import reportReducer from './slices/reportSlice';

export const store = configureStore({
  reducer: {
    device: deviceReducer,
    recording: recordingReducer,
    flow: flowReducer,
    report: reportReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
