import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Device {
  id: string;
  name: string;
  platform: 'ANDROID' | 'IOS';
  connectionType: 'USB' | 'WIRELESS' | 'REMOTE' | 'VIRTUAL';
  status: 'ONLINE' | 'OFFLINE' | 'RECORDING' | 'BUSY';
  udid: string;
  resolution?: string;
  ipAddress?: string;
}

interface DeviceState {
  devices: Device[];
  selectedDeviceId: string | null;
  loading: boolean;
}

const initialState: DeviceState = {
  devices: [],
  selectedDeviceId: null,
  loading: false,
};

const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    setDevices(state, action: PayloadAction<Device[]>) {
      state.devices = action.payload;
      if (!state.selectedDeviceId && action.payload.length > 0) {
        state.selectedDeviceId = action.payload[0].id;
      }
    },
    setSelectedDevice(state, action: PayloadAction<string>) {
      state.selectedDeviceId = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setDevices, setSelectedDevice, setLoading } = deviceSlice.actions;
export default deviceSlice.reducer;
