import { Device } from '../../domain/entities/Device';
import { HierarchyNode } from '../../domain/entities/HierarchyNode';

export class WDABridge {
  private defaultWdaUrl = 'http://localhost:8100';

  /**
   * Probes local WebDriverAgent status endpoint to detect connected iOS simulators/devices
   */
  public async getConnectedDevices(): Promise<Device[]> {
    try {
      const response = await fetch(`${this.defaultWdaUrl}/status`, { signal: AbortSignal.timeout(1000) });
      if (response.ok) {
        const data = await response.json();
        return [
          {
            id: 'wda_ios_01',
            name: data.value?.device || 'iOS Device (WDA)',
            platform: 'IOS',
            connectionType: 'USB',
            status: 'ONLINE',
            udid: data.value?.ios?.simulatorVersion ? 'simulator-wda' : 'physical-wda',
            resolution: '1179x2556',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];
      }
    } catch (error) {
      // WDA not running
    }
    return [];
  }

  /**
   * Fetches accessibility XML tree from WebDriverAgent
   */
  public async getSource(): Promise<HierarchyNode | null> {
    try {
      const response = await fetch(`${this.defaultWdaUrl}/source`);
      if (response.ok) {
        const text = await response.text();
        return this.parseWdaSource(text);
      }
    } catch (error) {
      // Ignore
    }
    return null;
  }

  public async tap(x: number, y: number): Promise<void> {
    try {
      await fetch(`${this.defaultWdaUrl}/wda/tap/0`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x, y }),
      });
    } catch (error) {
      console.warn('WDA Tap failed:', error);
    }
  }

  private parseWdaSource(sourceXml: string): HierarchyNode {
    return {
      id: 'ios_root',
      className: 'XCUIElementTypeApplication',
      bounds: { x: 0, y: 0, width: 1179, height: 2556 },
      xpath: '//XCUIElementTypeApplication',
      clickable: true,
      longClickable: false,
      scrollable: false,
      focusable: true,
      focused: false,
      enabled: true,
      selected: false,
      visible: true,
      children: [],
    };
  }
}
