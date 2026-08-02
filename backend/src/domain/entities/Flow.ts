import { InteractionEvent } from '../valueObjects/InteractionEvent';

export interface SessionVariable {
  id: string;
  flowId: string;
  key: string;
  defaultValue: string;
  description?: string;
}

export interface Flow {
  id: string;
  title: string;
  appId: string;
  description?: string;
  yamlContent: string;
  steps: InteractionEvent[];
  tags: string[];
  sessionVariables?: SessionVariable[];
  createdAt: Date;
  updatedAt: Date;
}
