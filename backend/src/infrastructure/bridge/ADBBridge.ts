import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Device } from '../../domain/entities/Device';
import { HierarchyNode, NodeBounds } from '../../domain/entities/HierarchyNode';

const execAsync = promisify(exec);

export class ADBBridge {
  private customAdbPath: string | null = null;

  constructor() {
    this.detectAdbBinary();
  }

  private detectAdbBinary(): string {
    if (this.customAdbPath) return this.customAdbPath;

    if (process.env.ADB_PATH && fs.existsSync(process.env.ADB_PATH)) {
      this.customAdbPath = `"${process.env.ADB_PATH}"`;
      return this.customAdbPath;
    }

    if (process.platform === 'win32') {
      const localAppData = process.env.LOCALAPPDATA || '';
      const candidatePaths = [
        'C:\\platform-tools\\adb.exe',
        path.join(localAppData, 'Android', 'Sdk', 'platform-tools', 'adb.exe'),
        'C:\\Android\\platform-tools\\adb.exe',
        'C:\\Program Files\\Android\\platform-tools\\adb.exe',
      ];

      for (const candidate of candidatePaths) {
        if (fs.existsSync(candidate)) {
          this.customAdbPath = `"${candidate}"`;
          return this.customAdbPath;
        }
      }
    }

    return 'adb';
  }

  public setAdbPath(adbPath: string) {
    this.customAdbPath = `"${adbPath}"`;
  }

  public async getConnectedDevices(): Promise<Device[]> {
    const adbCmd = this.detectAdbBinary();
    try {
      const { stdout } = await execAsync(`${adbCmd} devices -l`);
      const lines = stdout.split('\n').slice(1);
      const devices: Device[] = [];

      for (const line of lines) {
        if (!line.trim() || line.includes('offline')) continue;

        const parts = line.trim().split(/\s+/);
        const udid = parts[0];
        const modelMatch = line.match(/model:(\S+)/);
        const modelName = modelMatch ? modelMatch[1].replace(/_/g, ' ') : 'Android Device';

        devices.push({
          id: `adb_${udid}`,
          name: `${modelName} (${udid})`,
          platform: 'ANDROID',
          connectionType: line.includes('product:') ? 'USB' : 'WIRELESS',
          status: 'ONLINE',
          udid,
          resolution: '1080x2400',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      return devices;
    } catch (error: any) {
      console.warn(`[ADBBridge] Failed to execute ADB command using '${adbCmd}':`, error.message);
      return [];
    }
  }

  public async captureScreenshotBase64(udid: string): Promise<string | null> {
    const adbCmd = this.detectAdbBinary();
    try {
      const { stdout } = await execAsync(`${adbCmd} -s ${udid} exec-out screencap -p`, {
        encoding: 'base64',
        maxBuffer: 10 * 1024 * 1024,
      });
      if (stdout && stdout.length > 100) {
        return `data:image/png;base64,${stdout.replace(/\s+/g, '')}`;
      }
    } catch (error) {
      // Ignore frame grab error
    }
    return null;
  }

  public async tap(udid: string, x: number, y: number): Promise<void> {
    const adbCmd = this.detectAdbBinary();
    try {
      await execAsync(`${adbCmd} -s ${udid} shell input tap ${x} ${y}`);
    } catch (error) {
      console.warn(`[ADBBridge] Tap failed on device ${udid}:`, error);
    }
  }

  public async inputText(udid: string, text: string): Promise<void> {
    const adbCmd = this.detectAdbBinary();
    try {
      // Escape spaces and shell characters for ADB shell input text
      const escaped = text.replace(/ /g, '%s').replace(/(["'$`\\&()<>|;])/g, '\\$1');
      await execAsync(`${adbCmd} -s ${udid} shell input text "${escaped}"`);
    } catch (error) {
      console.warn(`[ADBBridge] Input text failed on device ${udid}:`, error);
    }
  }

  public async swipe(udid: string, x1: number, y1: number, x2: number, y2: number, durationMs: number = 300): Promise<void> {
    const adbCmd = this.detectAdbBinary();
    try {
      await execAsync(`${adbCmd} -s ${udid} shell input swipe ${x1} ${y1} ${x2} ${y2} ${durationMs}`);
    } catch (error) {
      console.warn(`[ADBBridge] Swipe failed on device ${udid}:`, error);
    }
  }

  /**
   * Dumps UI Automator accessibility tree XML from physical Android device and parses real nodes
   */
  public async getAccessibilityTree(udid: string): Promise<HierarchyNode | null> {
    const adbCmd = this.detectAdbBinary();
    try {
      await execAsync(`${adbCmd} -s ${udid} shell uiautomator dump`, { timeout: 3000 });
      const { stdout } = await execAsync(`${adbCmd} -s ${udid} shell cat /sdcard/window_dump.xml`, { timeout: 2000 });
      if (stdout && stdout.includes('<hierarchy')) {
        return this.parseXmlToHierarchy(stdout);
      }
    } catch (error) {
      // Suppress temporary uiautomator busy errors
    }
    return null;
  }

  /**
   * Parses Android UIAutomator XML string into a nested tree of HierarchyNode objects
   */
  private parseXmlToHierarchy(xmlString: string): HierarchyNode {
    // Regex matching for node tags
    const nodeRegex = /<node\s+([^>]+)>/g;
    const isClosingNodeRegex = /<\/node>/g;

    const rootNode: HierarchyNode = {
      id: 'android_root',
      className: 'android.widget.FrameLayout',
      bounds: { x: 0, y: 0, width: 1080, height: 2400 },
      xpath: '//hierarchy',
      clickable: false,
      longClickable: false,
      scrollable: false,
      focusable: false,
      focused: false,
      enabled: true,
      selected: false,
      visible: true,
      children: [],
    };

    const nodeMatches: { tag: string; isSelfClosing: boolean; attributes: Record<string, string> }[] = [];
    const fullTagRegex = /<(\/)?node([^>]*?)(\/)?>/g;
    let match;

    while ((match = fullTagRegex.exec(xmlString)) !== null) {
      const isClosing = !!match[1];
      const attrString = match[2];
      const isSelfClosing = !!match[3];

      if (isClosing) {
        nodeMatches.push({ tag: 'CLOSE', isSelfClosing: false, attributes: {} });
      } else {
        const attributes: Record<string, string> = {};
        const attrRegex = /(\S+)=["'](.*?)["']/g;
        let attrMatch;
        while ((attrMatch = attrRegex.exec(attrString)) !== null) {
          attributes[attrMatch[1]] = attrMatch[2];
        }
        nodeMatches.push({ tag: 'OPEN', isSelfClosing, attributes });
      }
    }

    const stack: HierarchyNode[] = [rootNode];

    for (const item of nodeMatches) {
      if (item.tag === 'CLOSE') {
        if (stack.length > 1) {
          stack.pop();
        }
      } else if (item.tag === 'OPEN') {
        const attrs = item.attributes;
        const className = attrs['class'] || 'android.view.View';
        const resourceId = attrs['resource-id'] || null;
        const text = attrs['text'] || null;
        const contentDescription = attrs['content-desc'] || null;
        const packageName = attrs['package'] || null;
        const boundsStr = attrs['bounds'] || '[0,0][1080,2400]';

        const bounds = this.parseBounds(boundsStr);
        const parentNode = stack[stack.length - 1];

        const nodeXPath = `${parentNode.xpath}/${className.split('.').pop()}[@text="${text || ''}"]`;

        const newNode: HierarchyNode = {
          id: uuidv4(),
          className,
          resourceId,
          accessibilityId: resourceId ? (resourceId.includes(':id/') ? resourceId.split(':id/')[1] : resourceId) : undefined,
          text: text && text.trim().length > 0 ? text : undefined,
          contentDescription: contentDescription && contentDescription.trim().length > 0 ? contentDescription : undefined,
          packageName,
          bounds,
          xpath: nodeXPath,
          clickable: attrs['clickable'] === 'true',
          longClickable: attrs['long-clickable'] === 'true',
          scrollable: attrs['scrollable'] === 'true',
          focusable: attrs['focusable'] === 'true',
          focused: attrs['focused'] === 'true',
          enabled: attrs['enabled'] === 'true',
          selected: attrs['selected'] === 'true',
          visible: true,
          children: [],
        };

        parentNode.children.push(newNode);

        if (!item.isSelfClosing) {
          stack.push(newNode);
        }
      }
    }

    return rootNode;
  }

  private parseBounds(boundsStr: string): NodeBounds {
    const match = boundsStr.match(/\[(\d+),(\d+)\]\[(\d+),(\d+)\]/);
    if (match) {
      const x1 = parseInt(match[1], 10);
      const y1 = parseInt(match[2], 10);
      const x2 = parseInt(match[3], 10);
      const y2 = parseInt(match[4], 10);
      return {
        x: x1,
        y: y1,
        width: Math.max(1, x2 - x1),
        height: Math.max(1, y2 - y1),
      };
    }
    return { x: 0, y: 0, width: 1080, height: 2400 };
  }
}
