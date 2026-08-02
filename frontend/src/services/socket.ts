import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  public connect(): Socket {
    if (!this.socket) {
      this.socket = io(window.location.origin, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        console.log('[SocketService] Connected to backend websocket engine');
      });

      this.socket.on('disconnect', () => {
        console.log('[SocketService] Disconnected from backend engine');
      });
    }

    return this.socket;
  }

  public getSocket(): Socket {
    if (!this.socket) {
      return this.connect();
    }
    return this.socket;
  }

  public startRecording(deviceId: string, appId: string, platform: 'ANDROID' | 'IOS') {
    this.getSocket().emit('start_recording', { deviceId, appId, platform });
  }

  public stopRecording(deviceId: string) {
    this.getSocket().emit('stop_recording', { deviceId });
  }

  public sendTap(deviceId: string, x: number, y: number, eventType: string = 'TAP') {
    this.getSocket().emit('device_tap', { deviceId, x, y, eventType });
  }

  public sendInputText(deviceId: string, text: string) {
    this.getSocket().emit('device_input_text', { deviceId, text });
  }

  public sendSwipe(deviceId: string, direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') {
    this.getSocket().emit('device_swipe', { deviceId, direction });
  }

  public sendAction(deviceId: string, action: 'BACK' | 'HIDE_KEYBOARD' | 'LAUNCH_APP' | 'STOP_APP', appId?: string) {
    this.getSocket().emit('device_action', { deviceId, action, appId });
  }

  public startReplay(flowId: string, deviceId: string, deviceName?: string, speedMultiplier: number = 1.0) {
    this.getSocket().emit('start_replay', { flowId, deviceId, deviceName, speedMultiplier });
  }

  public pauseReplay(runId: string) {
    this.getSocket().emit('pause_replay', { runId });
  }

  public resumeReplay(runId: string) {
    this.getSocket().emit('resume_replay', { runId });
  }
}

export const socketService = new SocketService();
