import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Flow {
  id: string;
  title: string;
  appId: string;
  description?: string;
  yamlContent: string;
  steps: any[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface FlowState {
  flows: Flow[];
  activeFlow: Flow | null;
  loading: boolean;
}

const initialState: FlowState = {
  flows: [],
  activeFlow: null,
  loading: false,
};

const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    setFlows(state, action: PayloadAction<Flow[]>) {
      state.flows = action.payload;
    },
    setActiveFlow(state, action: PayloadAction<Flow | null>) {
      state.activeFlow = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setFlows, setActiveFlow, setLoading } = flowSlice.actions;
export default flowSlice.reducer;
