import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HierarchyNode {
  id: string;
  resourceId?: string | null;
  accessibilityId?: string | null;
  contentDescription?: string | null;
  text?: string | null;
  className: string;
  packageName?: string | null;
  bounds: { x: number; y: number; width: number; height: number };
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

export interface InteractionEvent {
  id: string;
  type: string;
  timestamp: number;
  selector?: { type: string; value: string; score: number };
  textValue?: string;
  swipeDirection?: string;
  appId?: string;
  url?: string;
}

interface RecordingState {
  isRecording: boolean;
  appId: string;
  platform: 'ANDROID' | 'IOS';
  events: InteractionEvent[];
  yamlContent: string;
  currentHierarchy: HierarchyNode | null;
  selectedNode: HierarchyNode | null;
  insertionIndex: number | null;
  activeTab: 'YAML' | 'LOGS' | 'TREE' | 'INSPECTOR';
}

const initialState: RecordingState = {
  isRecording: false,
  appId: 'com.example.app',
  platform: 'ANDROID',
  events: [],
  yamlContent: '',
  currentHierarchy: null,
  selectedNode: null,
  insertionIndex: null,
  activeTab: 'YAML',
};

const recordingSlice = createSlice({
  name: 'recording',
  initialState,
  reducers: {
    startRecording(state, action: PayloadAction<{ appId: string }>) {
      state.isRecording = true;
      state.appId = action.payload.appId;
      state.events = [];
      state.yamlContent = `appId: ${action.payload.appId}\n---\n- launchApp`;
    },
    stopRecording(state) {
      state.isRecording = false;
    },
    setAppId(state, action: PayloadAction<string>) {
      state.appId = action.payload;
    },
    addEvent(state, action: PayloadAction<{ event: InteractionEvent; yamlContent: string }>) {
      state.events.push(action.payload.event);
      state.yamlContent = action.payload.yamlContent;
    },
    setYamlContent(state, action: PayloadAction<string>) {
      state.yamlContent = action.payload;
    },
    setHierarchy(state, action: PayloadAction<HierarchyNode>) {
      state.currentHierarchy = action.payload;
    },
    setSelectedNode: (state, action: PayloadAction<HierarchyNode | null>) => {
      state.selectedNode = action.payload;
    },
    setInsertionIndex: (state, action: PayloadAction<number | null>) => {
      state.insertionIndex = action.payload;
    },
    setActiveTab(state, action: PayloadAction<'YAML' | 'LOGS' | 'TREE' | 'INSPECTOR'>) {
      state.activeTab = action.payload;
    },
  },
});

export const {
  startRecording,
  stopRecording,
  setAppId,
  addEvent,
  setYamlContent,
  setHierarchy,
  setSelectedNode,
  setInsertionIndex,
  setActiveTab,
} = recordingSlice.actions;

export default recordingSlice.reducer;
