export type PlatformType = 'ANDROID' | 'IOS';
export type ConnectionType = 'USB' | 'WIRELESS' | 'REMOTE' | 'VIRTUAL';
export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'RECORDING' | 'BUSY';

export interface Device {
  id: string;
  name: string;
  platform: PlatformType;
  connectionType: ConnectionType;
  status: DeviceStatus;
  udid: string;
  resolution?: string;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}
