import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setRunnerState, setCurrentReport } from '../store/slices/reportSlice';
import { FlowPlayerControls } from '../components/flow/FlowPlayerControls';
import { DeviceMirror } from '../components/device/DeviceMirror';
import { LiveYamlEditor } from '../components/flow/LiveYamlEditor';
import { socketService } from '../services/socket';

interface PlayerPageProps {
  flowToPlay?: any;
}

export const PlayerPage: React.FC<PlayerPageProps> = ({ flowToPlay }) => {
  const dispatch = useDispatch();
  const { runnerStatus, currentStepIndex, totalSteps, logs } = useSelector((state: RootState) => state.report);
  const { selectedDeviceId, devices } = useSelector((state: RootState) => state.device);

  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);

  const sampleFlow = flowToPlay || {
    id: 'demo_flow',
    title: 'Demo Authentication Flow',
    appId: 'com.maestro.demoapp',
    yamlContent: `appId: com.maestro.demoapp\n---\n- launchApp\n- tapOn:\n    id: "emailField"\n- inputText: "admin@gmail.com"\n- tapOn:\n    id: "loginBtn"\n- assertVisible:\n    text: "Welcome"`,
    steps: [
      { id: '1', type: 'LAUNCH_APP', appId: 'com.maestro.demoapp' },
      { id: '2', type: 'TAP', selector: { type: 'RESOURCE_ID', value: 'emailField' } },
      { id: '3', type: 'INPUT_TEXT', textValue: 'admin@gmail.com' },
      { id: '4', type: 'TAP', selector: { type: 'RESOURCE_ID', value: 'loginBtn' } },
      { id: '5', type: 'ASSERT_VISIBLE', selector: { type: 'TEXT', value: 'Welcome' } },
    ],
  };

  useEffect(() => {
    const socket = socketService.connect();

    socket.on('runner_state_changed', (state) => {
      setActiveRunId(state.runId);
      dispatch(setRunnerState(state));
    });

    socket.on('runner_completed', (report) => {
      dispatch(setCurrentReport(report));
    });

    return () => {
      socket.off('runner_state_changed');
      socket.off('runner_completed');
    };
  }, [dispatch]);

  const handlePlay = () => {
    const device = devices.find((d) => d.id === selectedDeviceId);
    socketService.startReplay(sampleFlow.id, selectedDeviceId || 'virt_android_01', device?.name, speedMultiplier);
  };

  const handlePause = () => {
    if (activeRunId) socketService.pauseReplay(activeRunId);
  };

  const handleResume = () => {
    if (activeRunId) socketService.resumeReplay(activeRunId);
  };

  return (
    <div className="flex flex-col h-full bg-dark-900">
      {/* 2-Column Workspace */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Left Column: Device View (5 Cols) */}
        <div className="col-span-5 border-r border-dark-700 h-full overflow-hidden">
          <DeviceMirror
            hierarchy={null}
            selectedNode={null}
            onTap={() => {}}
            onSwipe={() => {}}
            onSendText={() => {}}
            onAction={() => {}}
            onSelectNode={() => {}}
          />
        </div>

        {/* Right Column: Code & Step Timeline (7 Cols) */}
        <div className="col-span-7 h-full flex flex-col overflow-hidden">
          <LiveYamlEditor yamlContent={sampleFlow.yamlContent} readOnly={true} />

          {/* Real-time Logs Terminal */}
          <div className="h-48 bg-black p-4 font-mono text-xs text-emerald-400 overflow-y-auto border-t border-dark-700">
            <div className="text-slate-500 pb-1 border-b border-slate-800 mb-2">Replay Logs Terminal</div>
            {logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Execution Controls Toolbar */}
      <FlowPlayerControls
        status={runnerStatus}
        currentStepIndex={currentStepIndex}
        totalSteps={totalSteps || sampleFlow.steps.length}
        speedMultiplier={speedMultiplier}
        onPlay={handlePlay}
        onPause={handlePause}
        onResume={handleResume}
        onStepOver={handleResume}
        onChangeSpeed={setSpeedMultiplier}
      />
    </div>
  );
};
