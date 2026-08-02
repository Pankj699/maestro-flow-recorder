import React from 'react';
import { Smartphone, Monitor, Wifi, Usb, AlertCircle } from 'lucide-react';
import { Device } from '../../store/slices/deviceSlice';

interface DeviceSelectorProps {
  devices: Device[];
  selectedDeviceId: string | null;
  onSelectDevice: (id: string) => void;
}

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  devices,
  selectedDeviceId,
  onSelectDevice,
}) => {
  const selectedDevice = devices.find((d) => d.id === selectedDeviceId);

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <select
          value={selectedDeviceId || ''}
          onChange={(e) => onSelectDevice(e.target.value)}
          className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-medium focus:outline-none focus:border-brand-500 pr-8 appearance-none cursor-pointer"
        >
          {devices.length === 0 ? (
            <option value="">No Connected Devices Found</option>
          ) : (
            devices.map((device) => (
              <option key={device.id} value={device.id}>
                {device.name} ({device.platform})
              </option>
            ))
          )}
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <Smartphone className="w-3.5 h-3.5" />
        </div>
      </div>

      {devices.length === 0 ? (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-1 rounded bg-amber-950/40 text-amber-400 border border-amber-800/40">
          <AlertCircle className="w-3 h-3" />
          <span>Connect Device via USB & Refresh</span>
        </span>
      ) : (
        selectedDevice && (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-1 rounded bg-dark-700 text-slate-300 border border-dark-600">
            {selectedDevice.connectionType === 'USB' && <Usb className="w-3 h-3 text-brand-cyan" />}
            {selectedDevice.connectionType === 'WIRELESS' && <Wifi className="w-3 h-3 text-emerald-400" />}
            <span>{selectedDevice.connectionType}</span>
          </span>
        )
      )}
    </div>
  );
};
