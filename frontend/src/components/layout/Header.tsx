import React from 'react';
import {
  Play,
  Square,
  Sparkles,
  RefreshCw,
  Loader2,
  HelpCircle,
} from 'lucide-react';
import { DeviceSelector } from '../device/DeviceSelector';
import { Device } from '../../store/slices/deviceSlice';

interface HeaderProps {
  devices: Device[];
  selectedDeviceId: string | null;
  onSelectDevice: (id: string) => void;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onAutoScrape?: () => void;
  isAutoScraping?: boolean;
  onOptimizeFlow?: () => void;
  onRefreshDevices?: () => void;
  onOpenTour?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  devices,
  selectedDeviceId,
  onSelectDevice,
  isRecording,
  onStartRecording,
  onStopRecording,
  onAutoScrape,
  isAutoScraping = false,
  onOptimizeFlow,
  onRefreshDevices,
  onOpenTour,
}) => {
  return (
    <header className="h-14 bg-dark-800/95 border-b border-dark-600 px-3 sm:px-4 flex items-center justify-between select-none backdrop-blur-md z-30 flex-shrink-0 gap-2 overflow-x-auto custom-scrollbar">
      {/* Left: Device Selector */}
      <div className="flex items-center gap-2 shrink-0">
        <DeviceSelector
          devices={devices}
          selectedDeviceId={selectedDeviceId}
          onSelectDevice={onSelectDevice}
        />

        {onRefreshDevices && (
          <button
            onClick={onRefreshDevices}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-700/80 hover:bg-dark-700 border border-dark-600/80 text-slate-200 text-xs font-medium transition-all shrink-0"
            title="Refresh Connected Devices"
          >
            <RefreshCw className="w-3.5 h-3.5 text-brand-cyan" />
            <span className="hidden md:inline">Refresh</span>
          </button>
        )}
      </div>

      {/* Right: Actions, AI Refactor & Recording CTA */}
      <div className="flex items-center gap-2 shrink-0 ml-auto">
        {/* IDE Tour Button */}
        {onOpenTour && (
          <button
            onClick={onOpenTour}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-700 hover:bg-dark-600 border border-dark-600 text-slate-200 text-xs font-medium transition-all shrink-0"
            title="Interactive Feature Walkthrough Tour"
          >
            <HelpCircle className="w-3.5 h-3.5 text-brand-cyan" />
            <span>IDE Tour</span>
          </button>
        )}

        {/* AI Refactor Button (Sleek borderless glass style) */}
        {onOptimizeFlow && (
          <button
            onClick={onOptimizeFlow}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/20 text-xs font-semibold transition-all shadow-sm shrink-0"
            title="AI Flow Refactor & Assertion Generator"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Refactor</span>
          </button>
        )}

        {/* Auto-Assert Button */}
        {onAutoScrape && isRecording && (
          <button
            onClick={onAutoScrape}
            disabled={isAutoScraping}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shrink-0 ${
              isAutoScraping
                ? 'bg-amber-950/80 text-amber-300 border-amber-600/60 cursor-wait animate-pulse'
                : 'bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border-emerald-700/50 shadow-sm'
            }`}
            title="Automatically capture assertions for all visible screen elements"
          >
            {isAutoScraping ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Auto-Assert</span>
              </>
            )}
          </button>
        )}

        {/* Primary Recording Action CTA Button */}
        {!isRecording ? (
          <button
            onClick={onStartRecording}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-brand-rose hover:from-rose-500 hover:to-rose-400 text-white font-semibold text-xs shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition-all duration-200 active:scale-95 shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>START RECORDING</span>
          </button>
        ) : (
          <button
            onClick={onStopRecording}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-recording text-white font-semibold text-xs shadow-lg shadow-brand-recording/40 glow-badge-rec animate-pulse transition-all duration-200 active:scale-95 shrink-0"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>STOP RECORDING</span>
          </button>
        )}
      </div>
    </header>
  );
};
