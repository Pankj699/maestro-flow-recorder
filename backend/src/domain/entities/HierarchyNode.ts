export interface NodeBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface HierarchyNode {
  id: string;
  resourceId?: string | null;
  accessibilityId?: string | null;
  contentDescription?: string | null;
  text?: string | null;
  className: string;
  packageName?: string | null;
  bounds: NodeBounds;
  xpath: string;
  clickable: boolean;
  longClickable: boolean;
  scrollable: boolean;
  focusable: boolean;
  focused: boolean;
  enabled: boolean;
  selected: boolean;
  visible: boolean;
  children: HierarchyNode[];
}
