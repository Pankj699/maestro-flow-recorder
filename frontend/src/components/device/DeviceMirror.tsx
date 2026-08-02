import React, { useRef, useState } from 'react';
import { Sparkles, TouchpadIcon, Eye, Zap, Keyboard, Smartphone } from 'lucide-react';
import { HierarchyNode } from '../../store/slices/recordingSlice';

export type TouchActionMode = 'SMART' | 'TAP' | 'ASSERT';

interface DeviceMirrorProps {
  deviceId?: string | null;
  resolution?: string;
  isRecording?: boolean;
  screenFrame?: string | null;
  currentHierarchy?: HierarchyNode | null;
  hierarchy?: HierarchyNode | null;
  selectedNode?: HierarchyNode | null;
  onTap?: (x: number, y: number, mode: TouchActionMode) => void;
  onSwipe?: (x1: number, y1: number, x2: number, y2: number) => void;
  onWheelScroll?: (direction: 'UP' | 'DOWN') => void;
  onSendText?: (text: string) => void;
  onAction?: (action: string) => void;
  onSelectNode?: (node: HierarchyNode | null) => void;
}

export const DeviceMirror: React.FC<DeviceMirrorProps> = ({
  deviceId,
  isRecording = false,
  screenFrame = null,
  currentHierarchy = null,
  hierarchy = null,
  onTap,
  onSwipe,
  onWheelScroll,
  onSendText,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchMode, setTouchMode] = useState<TouchActionMode>('SMART');
  const [swipeStart, setSwipeStart] = useState<{ x: number; y: number } | null>(null);
  const lastWheelTime = useRef<number>(0);

  const activeHierarchy = currentHierarchy || hierarchy;

  // Detect if an input field is currently active or focused
  const isInputActive = React.useMemo(() => {
    if (!activeHierarchy) return false;
    let isActive = false;
    const checkNode = (node: HierarchyNode) => {
      const cls = (node.className || '').toLowerCase();
      if (node.focused || cls.includes('edittext') || cls.includes('inputmethod') || cls.includes('keyboard')) {
        isActive = true;
      }
      if (node.children && !isActive) {
        for (const child of node.children) checkNode(child);
      }
    };
    checkNode(activeHierarchy);
    return isActive;
  }, [activeHierarchy]);

  const getRelativeCoordinates = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return { x: 0, y: 0 };

    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const deviceWidth = 1080;
    const deviceHeight = 2400;

    const scaleX = deviceWidth / rect.width;
    const scaleY = deviceHeight / rect.height;

    const realX = Math.round(clickX * scaleX);
    const realY = Math.round(clickY * scaleY);

    return { x: realX, y: realY };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const coords = getRelativeCoordinates(e);
    setSwipeStart(coords);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!swipeStart) return;
    const endCoords = getRelativeCoordinates(e);

    const distance = Math.hypot(endCoords.x - swipeStart.x, endCoords.y - swipeStart.y);

    if (distance > 40 && onSwipe) {
      onSwipe(swipeStart.x, swipeStart.y, endCoords.x, endCoords.y);
    } else if (onTap) {
      onTap(endCoords.x, endCoords.y, touchMode);
    }

    setSwipeStart(null);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 350) return;
    lastWheelTime.current = now;

    const direction = e.deltaY > 0 ? 'DOWN' : 'UP';
    if (onWheelScroll) {
      onWheelScroll(direction);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between p-2 sm:p-3 w-full h-full select-none overflow-hidden">
      {/* Floating Touch Action Mode Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-dark-800/90 border border-dark-600/90 rounded-xl shadow-lg backdrop-blur-md shrink-0 mb-1 z-20">
        <button
          onClick={() => setTouchMode('SMART')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
            touchMode === 'SMART'
              ? 'bg-brand-500/20 text-brand-cyan border border-brand-500/40 shadow-sm font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-dark-700/60'
          }`}
          title="Auto-detects: Taps on buttons/controls, Assertions on text/labels"
        >
          <Zap className="w-3 h-3" />
          <span>⚡ Smart Auto</span>
        </button>

        <button
          onClick={() => setTouchMode('TAP')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
            touchMode === 'TAP'
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-sm font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-dark-700/60'
          }`}
          title="Force every touch to record a Tap (- tapOn:)"
        >
          <TouchpadIcon className="w-3 h-3" />
          <span>👆 Force Tap</span>
        </button>

        <button
          onClick={() => setTouchMode('ASSERT')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
            touchMode === 'ASSERT'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-dark-700/60'
          }`}
          title="Force every touch to record a Visibility Assertion (- assertVisible:)"
        >
          <Eye className="w-3 h-3" />
          <span>👁️ Force Assert</span>
        </button>
      </div>

      {/* Realistic Enterprise Phone Bezel Wrapper (Dynamic Height Scaling for 14" Laptops & 4K) */}
      <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden my-auto min-h-0">
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          className={`relative h-full max-h-[calc(100vh-170px)] aspect-[9/19.5] bg-dark-950 rounded-[2.2rem] border-[8px] border-dark-800 shadow-ide-lg overflow-hidden cursor-pointer group transition-all duration-300 ${
            isRecording
              ? 'ring-4 ring-brand-recording/50 shadow-glow-rec'
              : 'ring-1 ring-white/10 hover:ring-brand-500/30'
          }`}
        >
          {/* Hardware Speaker Notch Pill */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-dark-900 rounded-full z-20 flex items-center justify-center border border-dark-700/80 pointer-events-none">
            <div className="w-6 h-0.5 bg-dark-600 rounded-full" />
          </div>

          {/* Device Screen Image */}
          {screenFrame ? (
            <img
              src={screenFrame}
              alt="Physical Device Mirror"
              className="w-full h-full object-cover rounded-[1.8rem] pointer-events-none"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-slate-500 bg-gradient-to-b from-dark-900 to-dark-950">
              <Smartphone className="w-10 h-10 mb-2 text-brand-cyan/40 animate-pulse" />
              <p className="text-xs font-semibold text-slate-300">
                {deviceId ? 'Connecting low-latency stream...' : 'Select device from toolbar to stream'}
              </p>
              <p className="text-[9px] text-slate-400 font-mono mt-1">250ms Screen Sync Engine</p>
            </div>
          )}

          {/* Subtle Ambient Glass Glare Surface */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.06] pointer-events-none" />
        </div>
      </div>

      {/* Conditional Send Text Input Bar */}
      {isInputActive && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const inputEl = e.currentTarget.elements.namedItem('inputText') as HTMLInputElement;
            if (inputEl && inputEl.value.trim() && onSendText) {
              onSendText(inputEl.value.trim());
              inputEl.value = '';
            }
          }}
          className="flex items-center gap-2 w-full max-w-[320px] animate-fade-in mt-1 shrink-0 z-20"
        >
          <div className="relative flex-1">
            <input
              name="inputText"
              type="text"
              placeholder="Type input text for physical phone..."
              autoFocus
              className="w-full bg-dark-800 border border-brand-500/60 rounded-input pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 placeholder-slate-500 shadow-ide"
            />
            <Keyboard className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-cyan" />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-btn text-xs font-semibold transition-all shadow-md flex items-center gap-1 active:scale-95 shrink-0"
          >
            <span>Send</span>
            <span>↵</span>
          </button>
        </form>
      )}
    </div>
  );
};
