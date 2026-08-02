import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StepResult {
  stepId: string;
  stepIndex: number;
  description: string;
  status: 'PASSED' | 'FAILED' | 'SKIPPED';
  durationMs: number;
}

export interface TestReport {
  id: string;
  flowId: string;
  flowTitle: string;
  deviceId: string;
  deviceName: string;
  status: 'PASSED' | 'FAILED' | 'RUNNING' | 'PAUSED';
  durationMs: number;
  passedSteps: number;
  failedSteps: number;
  totalSteps: number;
  stepResults: StepResult[];
  logs: string[];
}

interface ReportState {
  currentReport: TestReport | null;
  runnerStatus: 'IDLE' | 'RUNNING' | 'PAUSED' | 'PASSED' | 'FAILED';
  currentStepIndex: number;
  totalSteps: number;
  logs: string[];
}

const initialState: ReportState = {
  currentReport: null,
  runnerStatus: 'IDLE',
  currentStepIndex: 0,
  totalSteps: 0,
  logs: [],
};

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    setRunnerState(state, action: PayloadAction<any>) {
      state.runnerStatus = action.payload.status;
      state.currentStepIndex = action.payload.currentStepIndex;
      state.totalSteps = action.payload.totalSteps;
      state.logs = action.payload.logs;
    },
    setCurrentReport(state, action: PayloadAction<TestReport | null>) {
      state.currentReport = action.payload;
    },
    addLog(state, action: PayloadAction<string>) {
      state.logs.push(action.payload);
    },
  },
});

export const { setRunnerState, setCurrentReport, addLog } = reportSlice.actions;
export default reportSlice.reducer;
