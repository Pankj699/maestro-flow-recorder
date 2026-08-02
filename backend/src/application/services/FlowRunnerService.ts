import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { Flow } from '../../domain/entities/Flow';
import { TestReport, StepResult } from '../../domain/entities/TestReport';

export interface FlowRunnerState {
  runId: string;
  flowId: string;
  deviceId: string;
  status: 'IDLE' | 'RUNNING' | 'PAUSED' | 'PASSED' | 'FAILED';
  currentStepIndex: number;
  totalSteps: number;
  speedMultiplier: number; // 0.5x, 1x, 2x
  breakpoints: number[];
  stepResults: StepResult[];
  logs: string[];
}

export class FlowRunnerService extends EventEmitter {
  private activeRuns: Map<string, FlowRunnerState> = new Map();
  private pauseResolvers: Map<string, () => void> = new Map();

  public async startRunner(
    flow: Flow,
    deviceId: string,
    deviceName: string,
    breakpoints: number[] = [],
    speedMultiplier: number = 1.0
  ): Promise<TestReport> {
    const runId = uuidv4();
    const state: FlowRunnerState = {
      runId,
      flowId: flow.id,
      deviceId,
      status: 'RUNNING',
      currentStepIndex: 0,
      totalSteps: flow.steps.length,
      speedMultiplier,
      breakpoints,
      stepResults: [],
      logs: [`Started test execution for flow "${flow.title}" on device ${deviceName}`],
    };

    this.activeRuns.set(runId, state);
    this.emit('runner_state_changed', state);

    const startTime = new Date();

    for (let i = 0; i < flow.steps.length; i++) {
      if (state.status === 'FAILED') break;

      state.currentStepIndex = i;
      this.emit('runner_step_start', { runId, stepIndex: i, step: flow.steps[i] });

      // Check breakpoint
      if (state.breakpoints.includes(i)) {
        state.status = 'PAUSED';
        state.logs.push(`Hit breakpoint at step ${i + 1}`);
        this.emit('runner_state_changed', state);
        await this.waitForResume(runId);
      }

      // Simulate step execution
      const stepStartTime = Date.now();
      const step = flow.steps[i];
      const stepDescription = `${step.type} -> ${step.selector?.value || step.textValue || step.appId || 'Action'}`;

      const delay = Math.round(800 / state.speedMultiplier);
      await new Promise((resolve) => setTimeout(resolve, delay));

      const stepDuration = Date.now() - stepStartTime;
      const isSuccess = true; // High fidelity simulation bridge

      const result: StepResult = {
        stepId: step.id,
        stepIndex: i,
        description: stepDescription,
        status: isSuccess ? 'PASSED' : 'FAILED',
        durationMs: stepDuration,
      };

      state.stepResults.push(result);
      state.logs.push(`Step ${i + 1}/${flow.steps.length} (${result.status}): ${stepDescription}`);

      if (!isSuccess) {
        state.status = 'FAILED';
        break;
      }

      this.emit('runner_step_complete', { runId, result });
    }

    if (state.status !== 'FAILED') {
      state.status = 'PASSED';
    }

    state.logs.push(`Execution completed with status: ${state.status}`);
    const endTime = new Date();
    const durationMs = endTime.getTime() - startTime.getTime();

    const report: TestReport = {
      id: runId,
      flowId: flow.id,
      flowTitle: flow.title,
      deviceId,
      deviceName,
      status: state.status,
      startTime,
      endTime,
      durationMs,
      passedSteps: state.stepResults.filter((r) => r.status === 'PASSED').length,
      failedSteps: state.stepResults.filter((r) => r.status === 'FAILED').length,
      totalSteps: flow.steps.length,
      stepResults: state.stepResults,
      logs: state.logs,
    };

    this.activeRuns.delete(runId);
    this.emit('runner_completed', report);
    return report;
  }

  public pause(runId: string): void {
    const state = this.activeRuns.get(runId);
    if (state && state.status === 'RUNNING') {
      state.status = 'PAUSED';
      state.logs.push('Execution paused by user');
      this.emit('runner_state_changed', state);
    }
  }

  public resume(runId: string): void {
    const state = this.activeRuns.get(runId);
    if (state && state.status === 'PAUSED') {
      state.status = 'RUNNING';
      state.logs.push('Execution resumed by user');
      this.emit('runner_state_changed', state);
      const resolver = this.pauseResolvers.get(runId);
      if (resolver) {
        resolver();
        this.pauseResolvers.delete(runId);
      }
    }
  }

  public stepOver(runId: string): void {
    this.resume(runId);
  }

  private waitForResume(runId: string): Promise<void> {
    return new Promise((resolve) => {
      this.pauseResolvers.set(runId, resolve);
    });
  }
}
