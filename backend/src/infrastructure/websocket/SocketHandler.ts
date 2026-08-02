import { Server as SocketIOServer, Socket } from 'socket.io';
import { RecordingService } from '../../application/services/RecordingService';
import { VirtualDeviceBridge } from '../bridge/VirtualDeviceBridge';
import { ADBBridge } from '../bridge/ADBBridge';

export class SocketHandler {
  private io: SocketIOServer;
  private recordingService: RecordingService;
  private virtualBridge: VirtualDeviceBridge;
  private adbBridge: ADBBridge;
  private activeStreamIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor(
    io: SocketIOServer,
    recordingService: RecordingService,
    virtualBridge: VirtualDeviceBridge,
    adbBridge: ADBBridge
  ) {
    this.io = io;
    this.recordingService = recordingService;
    this.virtualBridge = virtualBridge;
    this.adbBridge = adbBridge;
    this.initialize();
  }

  private startDeviceStreaming(deviceId: string) {
    if (!deviceId || !deviceId.startsWith('adb_')) return;
    const udid = deviceId.replace('adb_', '');

    // Stop existing streaming loop if running
    if (this.activeStreamIntervals.has(deviceId)) {
      clearInterval(this.activeStreamIntervals.get(deviceId)!);
    }

    // Immediately push initial frame & accessibility hierarchy
    this.adbBridge.captureScreenshotBase64(udid).then((screenshot) => {
      if (screenshot) this.io.emit('device_frame', { deviceId, screenshot });
    });

    this.adbBridge.getAccessibilityTree(udid).then((hierarchy) => {
      if (hierarchy) {
        this.recordingService.updateHierarchy(deviceId, hierarchy);
        this.io.emit('hierarchy_updated', { deviceId, hierarchy });
      }
    });

    // Start continuous 250ms screen mirror frame loop
    const interval = setInterval(async () => {
      const screenshot = await this.adbBridge.captureScreenshotBase64(udid);
      if (screenshot) {
        this.io.emit('device_frame', { deviceId, screenshot });
      }
    }, 250);

    this.activeStreamIntervals.set(deviceId, interval);
  }

  private stopDeviceStreaming(deviceId: string) {
    if (this.activeStreamIntervals.has(deviceId)) {
      clearInterval(this.activeStreamIntervals.get(deviceId)!);
      this.activeStreamIntervals.delete(deviceId);
    }
  }

  private initialize() {
    // Listen for events captured by recording service and broadcast to all socket clients
    this.recordingService.on('event_captured', ({ session, event, yamlContent }) => {
      this.io.emit('event_captured', {
        deviceId: session.deviceId,
        event,
        yamlContent: yamlContent || session.yamlContent,
        session,
      });
    });

    this.io.on('connection', (socket: Socket) => {
      console.log(`[Socket.IO] Client connected: ${socket.id}`);

      socket.on('select_device', ({ deviceId }) => {
        if (deviceId) {
          this.startDeviceStreaming(deviceId);
        }
      });

      socket.on('start_recording', async ({ deviceId, appId, platform }) => {
        const session = this.recordingService.startRecording(deviceId, appId || 'com.example.app', platform || 'ANDROID');
        this.startDeviceStreaming(deviceId);
        socket.emit('recording_started', session);
      });

      socket.on('auto_scrape_screen', async ({ deviceId }) => {
        if (deviceId.startsWith('adb_')) {
          const udid = deviceId.replace('adb_', '');
          const realHierarchy = await this.adbBridge.getAccessibilityTree(udid);
          if (realHierarchy) {
            this.recordingService.updateHierarchy(deviceId, realHierarchy);
            this.io.emit('hierarchy_updated', { deviceId, hierarchy: realHierarchy });
          }
        }

        const added = this.recordingService.autoScrapeScreen(deviceId);
        const session = this.recordingService.getSession(deviceId);
        
        if (session) {
          this.io.emit('event_captured', {
            deviceId,
            yamlContent: session.yamlContent,
            session,
          });
        }

        socket.emit('auto_scrape_completed', { deviceId, addedCount: added.length });
      });

      socket.on('stop_recording', ({ deviceId }) => {
        const session = this.recordingService.stopRecording(deviceId);
        socket.emit('recording_stopped', session);
      });

      socket.on('device_tap', async ({ deviceId, x, y, eventType, touchMode, insertIndex }) => {
        if (deviceId.startsWith('adb_')) {
          const udid = deviceId.replace('adb_', '');
          
          await this.adbBridge.tap(udid, x, y);

          setTimeout(async () => {
            const [screenshot, realHierarchy] = await Promise.all([
              this.adbBridge.captureScreenshotBase64(udid),
              this.adbBridge.getAccessibilityTree(udid),
            ]);

            if (screenshot) {
              this.io.emit('device_frame', { deviceId, screenshot });
            }

            if (realHierarchy) {
              this.recordingService.updateHierarchy(deviceId, realHierarchy);
              this.io.emit('hierarchy_updated', { deviceId, hierarchy: realHierarchy });
              
              const event = this.recordingService.processTouchEvent(deviceId, x, y, eventType || 'TAP', realHierarchy, touchMode, insertIndex);
              if (event) {
                socket.emit('tap_acknowledged', { x, y, event });
              }
            } else {
              const event = this.recordingService.processTouchEvent(deviceId, x, y, eventType || 'TAP', undefined, touchMode, insertIndex);
              if (event) {
                socket.emit('tap_acknowledged', { x, y, event });
              }
            }
          }, 150);
        } else {
          const hierarchy = this.virtualBridge.getHierarchy('LOGIN');
          const event = this.recordingService.processTouchEvent(deviceId, x, y, eventType || 'TAP', hierarchy, touchMode, insertIndex);
          if (event) {
            socket.emit('tap_acknowledged', { x, y, event });
          }
        }
      });

      socket.on('device_swipe', async ({ deviceId, x1, y1, x2, y2, durationMs }) => {
        if (deviceId.startsWith('adb_')) {
          const udid = deviceId.replace('adb_', '');
          await this.adbBridge.swipe(udid, x1, y1, x2, y2, durationMs || 300);

          setTimeout(async () => {
            const screenshot = await this.adbBridge.captureScreenshotBase64(udid);
            if (screenshot) this.io.emit('device_frame', { deviceId, screenshot });
          }, 200);
        }
      });

      socket.on('device_scroll', async ({ deviceId, direction, insertIndex }) => {
        if (deviceId.startsWith('adb_')) {
          const udid = deviceId.replace('adb_', '');
          const y1 = direction === 'DOWN' ? 1700 : 600;
          const y2 = direction === 'DOWN' ? 600 : 1700;

          await this.adbBridge.swipe(udid, 540, y1, 540, y2, 300);

          setTimeout(async () => {
            const screenshot = await this.adbBridge.captureScreenshotBase64(udid);
            if (screenshot) this.io.emit('device_frame', { deviceId, screenshot });
          }, 200);
        }

        const event = this.recordingService.processSwipeEvent(deviceId, direction === 'DOWN' ? 'DOWN' : 'UP', insertIndex);
        if (event) {
          socket.emit('scroll_acknowledged', { direction, event });
        }
      });

      socket.on('device_input_text', async ({ deviceId, text, insertIndex }) => {
        if (deviceId.startsWith('adb_')) {
          const udid = deviceId.replace('adb_', '');
          await this.adbBridge.inputText(udid, text);

          setTimeout(async () => {
            const screenshot = await this.adbBridge.captureScreenshotBase64(udid);
            if (screenshot) this.io.emit('device_frame', { deviceId, screenshot });
          }, 200);
        }

        const event = this.recordingService.processTextInputEvent(deviceId, text, insertIndex);
        if (event) {
          socket.emit('text_acknowledged', { text, event });
        }
      });

      socket.on('disconnect', () => {
        console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
      });
    });
  }
}
