import { Request, Response } from 'express';
import { ADBBridge } from '../../infrastructure/bridge/ADBBridge';
import { WDABridge } from '../../infrastructure/bridge/WDABridge';
import { VirtualDeviceBridge } from '../../infrastructure/bridge/VirtualDeviceBridge';

export class DeviceController {
  private adbBridge = new ADBBridge();
  private wdaBridge = new WDABridge();
  private virtualBridge = new VirtualDeviceBridge();

  public getDevices = async (req: Request, res: Response): Promise<void> => {
    try {
      const adbDevices = await this.adbBridge.getConnectedDevices();
      const wdaDevices = await this.wdaBridge.getConnectedDevices();

      const connectedDevices = [...adbDevices, ...wdaDevices];

      // If user specifically requests real connected devices only
      res.json({ success: true, count: connectedDevices.length, devices: connectedDevices });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
}
