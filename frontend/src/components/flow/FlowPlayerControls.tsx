import React from 'react';
import { Play, Pause, SkipForward, FastForward, Square, Circle } from 'lucide-react';

interface FlowPlayerControlsProps {
  status: 'IDLE' | 'RUNNING' | 'PAUSED' | 'PASSED' | 'FAILED';
  currentStepIndex: number;
  totalSteps: number;
  speedMultiplier: number;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStepOver: () => void;
  onChangeSpeed: (speed: number) => void;
}

export const FlowPlayerControls: React.FC<FlowPlayerControlsProps> = ({
  status,
  currentStepIndex,
  totalSteps,
  speedMultiplier,
  onPlay,
  onPause,
  onResume,
  onStepOver,
  onChangeSpeed,
}) => {
  const isRunning = status === 'RUNNING';
  const isPaused = status === 'PAUSED';

  return (
    <div className="h-14 bg-dark-800 border-t border-dark-700 px-6 flex items-center justify-between select-none">
      {/* Status Progress */}
      <div className="flex items-center gap-3">
        <span
          className={`w-3 h-3 rounded-full ${
            isRunning
              ? 'bg-emerald-400 animate-pulse'
              : isPaused
              ? 'bg-amber-400'
              : status === 'PASSED'
              ? 'bg-emerald-500'
              : status === 'FAILED'
              ? 'bg-rose-500'
              : 'bg-slate-600'
          }`}
        />
        <div className="text-xs">
          <span className="font-semibold text-white">Status: {status}</span>
          <span className="text-slate-400 ml-2 font-mono">
            Step {totalSteps > 0 ? currentStepIndex + 1 : 0} of {totalSteps}
          </span>
        </div>
      </div>

      {/* Control Action Buttons */}
      <div className="flex items-center gap-2">
        {!isRunning && !isPaused ? (
          <button
            onClick={onPlay}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-xs shadow-md shadow-emerald-600/20 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Replay Flow</span>
          </button>
        ) : isRunning ? (
          <button
            onClick={onPause}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium text-xs transition-all"
          >
            <Pause className="w-4 h-4 fill-current" />
            <span>Pause Execution</span>
          </button>
        ) : (
          <button
            onClick={onResume}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-xs transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Resume</span>
          </button>
        )}

        <button
          onClick={onStepOver}
          disabled={!isPaused}
          className="flex items-center gap-1.5 px-3 py-2 bg-dark-700 hover:bg-dark-600 disabled:opacity-40 text-slate-300 rounded-lg text-xs font-medium"
        >
          <SkipForward className="w-4 h-4" />
          <span>Step Over</span>
        </button>

        {/* Speed Control Slider */}
        <div className="flex items-center gap-1.5 bg-dark-700 border border-dark-600 px-3 py-1.5 rounded-lg text-xs text-slate-300 ml-3">
          <FastForward className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Speed:</span>
          {[0.5, 1.0, 2.0, 4.0].map((s) => (
            <button
              key={s}
              onClick={() => onChangeSpeed(s)}
              className={`px-1.5 py-0.5 rounded text-[11px] font-mono ${
                speedMultiplier === s
                  ? 'bg-brand-600 text-white font-bold'
                  : 'hover:bg-dark-600 text-slate-400'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
