import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Group, Panel } from 'react-resizable-panels';
import { Layers, FileCode } from 'lucide-react';
import { RootState } from '../store';
import { setDevices, setSelectedDevice } from '../store/slices/deviceSlice';
import {
  startRecording,
  stopRecording,
  addEvent,
  setYamlContent,
  setHierarchy,
  setSelectedNode,
  setInsertionIndex,
} from '../store/slices/recordingSlice';
import { Header } from '../components/layout/Header';
import { DeviceMirror } from '../components/device/DeviceMirror';
import { LiveYamlEditor } from '../components/flow/LiveYamlEditor';
import { WalkthroughTour } from '../components/common/WalkthroughTour';
import { UIInspectorModal } from '../components/inspector/UIInspectorModal';
import { CustomResizeHandle } from '../components/common/CustomResizeHandle';
import { socketService } from '../services/socket';
import { api } from '../services/api';

const LOCAL_STORAGE_KEY = 'maestro_ide_layout_v2';

export const RecorderPage: React.FC = () => {
  const dispatch = useDispatch();
  const { devices, selectedDeviceId } = useSelector((state: RootState) => state.device);
  const { isRecording, appId, events, yamlContent, currentHierarchy, selectedNode, insertionIndex } = useSelector(
    (state: RootState) => state.recording
  );
  const [screenFrame, setScreenFrame] = useState<string | null>(null);
  const [isAutoScraping, setIsAutoScraping] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isInspectorModalOpen, setIsInspectorModalOpen] = useState(false);

  // IDE Layout Panel States (Persisted in localStorage)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved).isSidebarCollapsed || false : false;
    } catch {
      return false;
    }
  });

  const [isEditorCollapsed, setIsEditorCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved).isEditorCollapsed || false : false;
    } catch {
      return false;
    }
  });

  const [isFullscreenEditor, setIsFullscreenEditor] = useState<boolean>(false);

  // Save layout state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          isSidebarCollapsed,
          isEditorCollapsed,
        })
      );
    } catch (e) {
      console.warn('Failed to save IDE layout to localStorage', e);
    }
  }, [isSidebarCollapsed, isEditorCollapsed]);

  // Keyboard Shortcuts Listener (Ctrl+B, Ctrl+Shift+T, Ctrl+Shift+E)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarCollapsed((prev) => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        setIsInspectorModalOpen((prev) => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setIsEditorCollapsed((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    // Fetch connected devices on mount
    api.getDevices().then((res) => {
      if (res.success && res.devices && res.devices.length > 0) {
        dispatch(setDevices(res.devices));
        const activeId = selectedDeviceId || res.devices[0].id;
        socketService.getSocket().emit('select_device', { deviceId: activeId });
      }
    });

    // Socket listener registration
    const socket = socketService.connect();

    socket.on('device_frame', (data) => {
      setScreenFrame(data.screenshot);
    });

    socket.on('auto_scrape_completed', () => {
      setIsAutoScraping(false);
    });

    socket.on('event_captured', (data) => {
      dispatch(addEvent({ event: data.event, yamlContent: data.yamlContent }));
    });

    socket.on('hierarchy_updated', (data) => {
      dispatch(setHierarchy(data.hierarchy));
    });

    return () => {
      socket.off('device_frame');
      socket.off('auto_scrape_completed');
      socket.off('event_captured');
      socket.off('hierarchy_updated');
    };
  }, [dispatch]);

  // Re-emit select_device whenever selectedDeviceId changes
  useEffect(() => {
    if (selectedDeviceId) {
      socketService.getSocket().emit('select_device', { deviceId: selectedDeviceId });
    }
  }, [selectedDeviceId]);

  const handleStartRecording = () => {
    if (!selectedDeviceId) return;
    dispatch(startRecording({ appId }));
    const device = devices.find((d) => d.id === selectedDeviceId);
    socketService.startRecording(selectedDeviceId, appId, device?.platform || 'ANDROID');
  };

  const handleStopRecording = () => {
    if (!selectedDeviceId) return;
    dispatch(stopRecording());
    socketService.stopRecording(selectedDeviceId);
  };

  const handleAIOptimize = async () => {
    const res = await api.optimizeFlow(events);
    if (res.success && res.optimizedEvents) {
      api.createFlow({ title: 'AI Refactored Flow', appId, steps: res.optimizedEvents });
    }
  };

  return (
    <div className="flex flex-col h-full bg-dark-900 overflow-hidden select-none">
      {/* Top Header Controls Bar */}
      <Header
        devices={devices}
        selectedDeviceId={selectedDeviceId}
        onSelectDevice={(id) => {
          dispatch(setSelectedDevice(id));
          socketService.getSocket().emit('select_device', { deviceId: id });
        }}
        isRecording={isRecording}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
        isAutoScraping={isAutoScraping}
        onAutoScrape={() => {
          if (selectedDeviceId) {
            setIsAutoScraping(true);
            socketService.getSocket().emit('auto_scrape_screen', { deviceId: selectedDeviceId });
            setTimeout(() => setIsAutoScraping(false), 3500);
          }
        }}
        onOptimizeFlow={handleAIOptimize}
        onRefreshDevices={() => {
          api.getDevices().then((res) => {
            if (res.success && res.devices) {
              dispatch(setDevices(res.devices));
            }
          });
        }}
        onOpenTour={() => setIsTourOpen(true)}
      />

      {/* Main IDE 2-Panel Resizable Layout (Mobile Mirror Canvas + Live YAML Code Editor) */}
      <div className="flex-1 overflow-hidden relative">
        {isFullscreenEditor ? (
          /* Fullscreen Monaco Code Editor View */
          <div className="w-full h-full animate-fade-in z-30 relative">
            <LiveYamlEditor
              yamlContent={yamlContent}
              onChangeContent={(val) => dispatch(setYamlContent(val))}
              onCursorChange={(line) => dispatch(setInsertionIndex(line))}
              isFullscreen={true}
              onToggleFullscreen={() => setIsFullscreenEditor(false)}
            />
          </div>
        ) : (
          /* 2-Panel Resizable Workspace */
          <Group orientation="horizontal" className="h-full w-full">
            {/* Panel 1: Live Device Screen Mirror Canvas */}
            <Panel defaultSize={48} minSize={30} id="device-panel">
              <div className="h-full w-full flex flex-col bg-dark-900 overflow-hidden relative">
                <DeviceMirror
                  deviceId={selectedDeviceId}
                  resolution="1080x2400"
                  isRecording={isRecording}
                  screenFrame={screenFrame}
                  currentHierarchy={currentHierarchy}
                  selectedNode={selectedNode}
                  onTap={(x, y, mode) => {
                    if (selectedDeviceId) {
                      socketService.getSocket().emit('device_tap', {
                        deviceId: selectedDeviceId,
                        x,
                        y,
                        touchMode: mode,
                        insertIndex: insertionIndex,
                      });
                    }
                  }}
                  onSwipe={(x1, y1, x2, y2) => {
                    if (selectedDeviceId) {
                      socketService.getSocket().emit('device_swipe', {
                        deviceId: selectedDeviceId,
                        x1,
                        y1,
                        x2,
                        y2,
                        durationMs: 300,
                      });
                    }
                  }}
                  onWheelScroll={(direction) => {
                    if (selectedDeviceId) {
                      socketService.getSocket().emit('device_scroll', {
                        deviceId: selectedDeviceId,
                        direction,
                        insertIndex: insertionIndex,
                      });
                    }
                  }}
                  onSendText={(text) => {
                    if (selectedDeviceId) {
                      socketService.getSocket().emit('device_input_text', {
                        deviceId: selectedDeviceId,
                        text,
                        insertIndex: insertionIndex,
                      });
                    }
                  }}
                  onSelectNode={(node) => dispatch(setSelectedNode(node))}
                />

                {/* Floating Layers Dock Button (Tapping opens UI Inspector Dialog) */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
                  <button
                    onClick={() => setIsInspectorModalOpen(true)}
                    className="p-2.5 rounded-xl bg-dark-800/90 border border-brand-500/40 text-brand-cyan hover:bg-dark-700 hover:scale-105 shadow-2xl backdrop-blur-md transition-all group flex items-center gap-1.5"
                    title="Inspect UI Tree & Node Properties (Ctrl+Shift+T)"
                  >
                    <Layers className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </button>
                </div>
              </div>
            </Panel>

            {!isEditorCollapsed && <CustomResizeHandle id="handle-editor" />}

            {/* Panel 2: Live Monaco YAML Code Editor */}
            {!isEditorCollapsed && (
              <Panel defaultSize={52} minSize={25} id="editor-panel">
                <div className="h-full w-full overflow-hidden">
                  <LiveYamlEditor
                    yamlContent={yamlContent}
                    onChangeContent={(val) => dispatch(setYamlContent(val))}
                    onCursorChange={(line) => dispatch(setInsertionIndex(line))}
                    isFullscreen={false}
                    onToggleFullscreen={() => setIsFullscreenEditor(true)}
                  />
                </div>
              </Panel>
            )}
          </Group>
        )}
      </div>

      {/* Feature Walkthrough Tour Modal */}
      <WalkthroughTour isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />

      {/* UI Tree & Properties Inspector Dialog Box Modal */}
      <UIInspectorModal
        isOpen={isInspectorModalOpen}
        onClose={() => setIsInspectorModalOpen(false)}
        hierarchy={currentHierarchy}
        selectedNode={selectedNode}
        onSelectNode={(node) => dispatch(setSelectedNode(node))}
      />
    </div>
  );
};
