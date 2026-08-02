import { Selector } from './Selector';
import { HierarchyNode } from '../entities/HierarchyNode';

export type EventType =
  | 'TAP'
  | 'LONG_PRESS'
  | 'DOUBLE_TAP'
  | 'SWIPE'
  | 'SCROLL'
  | 'SCROLL_UNTIL_VISIBLE'
  | 'INPUT_TEXT'
  | 'BACK'
  | 'HIDE_KEYBOARD'
  | 'LAUNCH_APP'
  | 'STOP_APP'
  | 'OPEN_LINK'
  | 'ASSERT_VISIBLE'
  | 'EXTENDED_WAIT';

export interface InteractionEvent {
  id: string;
  type: EventType;
  timestamp: number;
  selector?: Selector;
  fallbackSelectors?: Selector[];
  textValue?: string;
  swipeDirection?: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  appId?: string;
  url?: string;
  durationMs?: number;
  targetNode?: HierarchyNode;
  windowHierarchy?: HierarchyNode;
  metadata?: Record<string, any>;
}
