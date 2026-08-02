import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { ExecutionReportView } from '../components/reports/ExecutionReportView';

export const ReportsPage: React.FC = () => {
  const { currentReport } = useSelector((state: RootState) => state.report);

  // Fallback demo report if no live test run has occurred yet
  const report = currentReport || {
    id: 'run_8f92a10c',
    flowId: 'flow_login_01',
    flowTitle: 'User Login & Dashboard Verification',
    deviceId: 'virt_android_01',
    deviceName: 'Pixel 8 Pro (Virtual Emulator)',
    status: 'PASSED' as const,
    durationMs: 4250,
    passedSteps: 5,
    failedSteps: 0,
    totalSteps: 5,
    stepResults: [
      { stepId: '1', stepIndex: 0, description: 'LAUNCH_APP -> com.maestro.demoapp', status: 'PASSED' as const, durationMs: 1200 },
      { stepId: '2', stepIndex: 1, description: 'TAP -> id: emailField', status: 'PASSED' as const, durationMs: 450 },
      { stepId: '3', stepIndex: 2, description: 'INPUT_TEXT -> "admin@gmail.com"', status: 'PASSED' as const, durationMs: 800 },
      { stepId: '4', stepIndex: 3, description: 'TAP -> id: loginBtn', status: 'PASSED' as const, durationMs: 950 },
      { stepId: '5', stepIndex: 4, description: 'ASSERT_VISIBLE -> text: "Welcome"', status: 'PASSED' as const, durationMs: 850 },
    ],
    logs: [
      '[00:00.00] Connected to device emulator-5554',
      '[00:01.20] App com.maestro.demoapp launched successfully',
      '[00:01.65] Element id: emailField tapped',
      '[00:02.45] Input text "admin@gmail.com" typed',
      '[00:03.40] Button id: loginBtn clicked',
      '[00:04.25] Assertion passed: "Welcome" is visible',
      '[00:04.25] Test execution finished with status PASSED',
    ],
  };

  return <ExecutionReportView report={report} />;
};
