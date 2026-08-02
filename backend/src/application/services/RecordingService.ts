import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { HierarchyNode } from '../../domain/entities/HierarchyNode';
import { InteractionEvent } from '../../domain/valueObjects/InteractionEvent';
import { SmartSelectorEngine } from './SmartSelectorEngine';
import { YAMLGenerator } from './YAMLGenerator';

export interface RecordingSession {
  id: string;
  deviceId: string;
  appId: string;
  platform: 'ANDROID' | 'IOS';
  isRecording: boolean;
  events: InteractionEvent[];
  yamlContent: string;
  currentHierarchy: HierarchyNode | null;
  createdAt: Date;
  updatedAt: Date;
}

export class RecordingService extends EventEmitter {
  private activeSessions: Map<string, RecordingSession> = new Map();
  private selectorEngine: SmartSelectorEngine;
  private yamlGenerator: YAMLGenerator;

  constructor() {
    super();
    this.selectorEngine = new SmartSelectorEngine();
    this.yamlGenerator = new YAMLGenerator();
  }

  public startRecording(deviceId: string, appId: string, platform: 'ANDROID' | 'IOS'): RecordingSession {
    let session = this.activeSessions.get(deviceId);
    if (!session) {
      session = {
        id: uuidv4(),
        deviceId,
        appId,
        platform,
        isRecording: true,
        events: [],
        yamlContent: '',
        currentHierarchy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.activeSessions.set(deviceId, session);
    } else {
      session.isRecording = true;
      session.events = []; // Reset events on new recording start
    }

    session.yamlContent = this.yamlGenerator.generate(session.appId, session.events);
    this.emit('recording_started', session);
    return session;
  }

  public stopRecording(deviceId: string): RecordingSession | undefined {
    const session = this.activeSessions.get(deviceId);
    if (session) {
      session.isRecording = false;
      this.emit('recording_stopped', session);
    }
    return session;
  }

  public getSession(deviceId: string): RecordingSession | undefined {
    return this.activeSessions.get(deviceId);
  }

  public processTouchEvent(
    deviceId: string,
    x: number,
    y: number,
    eventType: 'TAP' | 'LONG_PRESS' | 'DOUBLE_TAP' = 'TAP',
    hierarchyOverride?: HierarchyNode,
    touchMode: 'SMART' | 'TAP' | 'ASSERT' = 'SMART',
    insertIndex?: number | null
  ): InteractionEvent | null {
    const session = this.activeSessions.get(deviceId);
    // Strict Guard: ONLY record when isRecording is true
    if (!session || !session.isRecording) return null;

    const targetHierarchy = hierarchyOverride || session.currentHierarchy;
    let selectorResult;
    let matchingNode: HierarchyNode | null = null;

    if (targetHierarchy) {
      matchingNode = this.selectorEngine.findBestMatchingNode(targetHierarchy, x, y);
    }

    // Ignore soft keyboard key taps
    if (this.isKeyboardElement(matchingNode, y)) {
      return null;
    }

    if (matchingNode) {
      selectorResult = this.selectorEngine.generateSelectors(matchingNode);
    } else {
      selectorResult = {
        primarySelector: {
          type: 'POINT' as const,
          value: `${x}, ${y}`,
          point: { x, y },
          score: 10,
        },
        fallbackSelectors: [],
        confidence: 0.1,
      };
    }

    let finalEventType: 'TAP' | 'ASSERT_VISIBLE' | 'LONG_PRESS' | 'DOUBLE_TAP' = eventType;
    if (eventType === 'TAP') {
      if (touchMode === 'TAP') {
        finalEventType = 'TAP';
      } else if (touchMode === 'ASSERT') {
        finalEventType = 'ASSERT_VISIBLE';
      } else if (matchingNode) {
        const isInteractive = this.isInteractiveElement(matchingNode);
        if (!isInteractive) {
          finalEventType = 'ASSERT_VISIBLE';
        }
      }
    }

    const event: InteractionEvent = {
      id: uuidv4(),
      type: finalEventType as any,
      timestamp: Date.now(),
      selector: selectorResult.primarySelector,
    };

    if (typeof insertIndex === 'number' && insertIndex >= 0 && insertIndex <= session.events.length) {
      session.events.splice(insertIndex, 0, event);
    } else {
      session.events.push(event);
    }

    session.yamlContent = this.yamlGenerator.generate(session.appId, session.events);
    this.emit('event_captured', { session, event, yamlContent: session.yamlContent });
    return event;
  }

  public processSwipeEvent(
    deviceId: string,
    direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT',
    insertIndex?: number | null
  ): InteractionEvent | null {
    const session = this.activeSessions.get(deviceId);
    if (!session || !session.isRecording) return null;

    const event: InteractionEvent = {
      id: uuidv4(),
      type: 'SWIPE',
      timestamp: Date.now(),
      swipeDirection: direction,
    };

    if (typeof insertIndex === 'number' && insertIndex >= 0 && insertIndex <= session.events.length) {
      session.events.splice(insertIndex, 0, event);
    } else {
      session.events.push(event);
    }

    session.yamlContent = this.yamlGenerator.generate(session.appId, session.events);
    this.emit('event_captured', { session, event, yamlContent: session.yamlContent });
    return event;
  }

  private isKeyboardElement(node: HierarchyNode | null, y: number): boolean {
    if (!node) {
      // Lower 35% of screen when keyboard is open is soft keyboard
      return y > 1550;
    }

    const pkg = (node.packageName || '').toLowerCase();
    const id = (node.resourceId || node.id || '').toLowerCase();

    if (
      pkg.includes('inputmethod') ||
      pkg.includes('keyboard') ||
      pkg.includes('gboard') ||
      pkg.includes('swiftkey') ||
      id.includes('action_bar_root') ||
      id.includes('keyboard') ||
      id.includes('key_')
    ) {
      return true;
    }

    return false;
  }

  private isInteractiveElement(node: HierarchyNode): boolean {
    if (!node) return false;

    const cls = (node.className || '').toLowerCase();

    if (
      cls.includes('button') ||
      cls.includes('checkbox') ||
      cls.includes('radio') ||
      cls.includes('switch') ||
      cls.includes('edittext') ||
      cls.includes('seekbar') ||
      cls.includes('spinner')
    ) {
      return true;
    }

    if (cls.includes('textview') || cls.includes('statictext')) {
      return false;
    }

    if (node.clickable && (cls.includes('layout') || cls.includes('viewgroup') || cls.includes('cardview'))) {
      return true;
    }

    return node.clickable || false;
  }

  public processTextInputEvent(deviceId: string, text: string, insertIndex?: number | null): InteractionEvent | null {
    const session = this.activeSessions.get(deviceId);
    if (!session || !session.isRecording) return null;

    const focusedInput = this.getFocusedInputNode(session.currentHierarchy);
    const lastEvent = session.events[session.events.length - 1];
    const selector = focusedInput
      ? this.selectorEngine.generateSelectors(focusedInput).primarySelector
      : lastEvent?.selector;

    const event: InteractionEvent = {
      id: uuidv4(),
      type: 'INPUT_TEXT',
      timestamp: Date.now(),
      selector,
      textValue: text,
    };

    if (typeof insertIndex === 'number' && insertIndex >= 0 && insertIndex <= session.events.length) {
      session.events.splice(insertIndex, 0, event);
    } else {
      session.events.push(event);
    }

    session.yamlContent = this.yamlGenerator.generate(session.appId, session.events);
    this.emit('event_captured', { session, event, yamlContent: session.yamlContent });
    return event;
  }

  private getFocusedInputNode(tree: HierarchyNode | null): HierarchyNode | null {
    if (!tree) return null;
    let found: HierarchyNode | null = null;
    const traverse = (node: HierarchyNode) => {
      const cls = (node.className || '').toLowerCase();
      if ((node.focused || cls.includes('edittext')) && (node.resourceId || node.accessibilityId || node.text)) {
        found = node;
      }
      if (node.children && !found) {
        for (const child of node.children) traverse(child);
      }
    };
    traverse(tree);
    return found;
  }

  public autoScrapeScreen(deviceId: string): InteractionEvent[] {
    const session = this.activeSessions.get(deviceId);
    if (!session || !session.isRecording || !session.currentHierarchy) return [];

    const { mainScreenTitle, selectors } = this.selectorEngine.autoScrapeScreenElements(session.currentHierarchy);
    const addedEvents: InteractionEvent[] = [];

    for (const selector of selectors) {
      const exists = session.events.some((e) => e.type === 'ASSERT_VISIBLE' && e.selector?.value === selector.value);
      if (!exists) {
        const assertEvent: InteractionEvent = {
          id: uuidv4(),
          type: 'ASSERT_VISIBLE',
          timestamp: Date.now(),
          selector,
        };
        session.events.push(assertEvent);
        addedEvents.push(assertEvent);
      }
    }

    session.yamlContent = this.yamlGenerator.generate(session.appId, session.events, mainScreenTitle);
    this.emit('screen_scraped', { session, addedEvents });
    return addedEvents;
  }

  public updateHierarchy(deviceId: string, hierarchy: HierarchyNode): void {
    const session = this.activeSessions.get(deviceId);
    if (session) {
      session.currentHierarchy = hierarchy;
      this.emit('hierarchy_updated', { deviceId, hierarchy });
    }
  }
}
