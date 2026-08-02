export type ExecutionStatus = 'PASSED' | 'FAILED' | 'RUNNING' | 'PAUSED';

export interface StepResult {
  stepId: string;
  stepIndex: number;
  description: string;
  status: 'PASSED' | 'FAILED' | 'SKIPPED';
  durationMs: number;
  errorMessage?: string;
  screenshotPath?: string;
}

export interface TestReport {
  id: string;
  flowId: string;
  flowTitle: string;
  deviceId: string;
  deviceName: string;
  status: ExecutionStatus;
  startTime: Date;
  endTime?: Date;
  durationMs: number;
  passedSteps: number;
  failedSteps: number;
  totalSteps: number;
  stepResults: StepResult[];
  logs: string[];
  htmlReportPath?: string;
  jsonReportPath?: string;
  junitXmlPath?: string;
}
