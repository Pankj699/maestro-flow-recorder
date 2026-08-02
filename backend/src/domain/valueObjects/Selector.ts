export type SelectorType = 'SMART_PAIR' | 'ACCESSIBILITY_ID' | 'RESOURCE_ID' | 'TEXT' | 'REGEX' | 'XPATH' | 'POINT';

export interface Selector {
  type: SelectorType;
  value: string;
  score: number;
  id?: string;
  text?: string;
  point?: { x: number; y: number };
  description?: string;
  sectionName?: string;
}

export interface SmartSelectorResult {
  primarySelector: Selector;
  fallbackSelectors: Selector[];
  confidence: number;
}
