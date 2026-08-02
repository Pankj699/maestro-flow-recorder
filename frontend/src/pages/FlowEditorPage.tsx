import React, { useState } from 'react';
import { Save, Sparkles } from 'lucide-react';
import { VisualFlowEditor } from '../components/flow/VisualFlowEditor';
import { LiveYamlEditor } from '../components/flow/LiveYamlEditor';
import { InteractionEvent } from '../store/slices/recordingSlice';
import { api } from '../services/api';

interface FlowEditorPageProps {
  initialFlow?: any;
}

export const FlowEditorPage: React.FC<FlowEditorPageProps> = ({ initialFlow }) => {
  const [title, setTitle] = useState(initialFlow?.title || 'New Maestro Flow');
  const [appId, setAppId] = useState(initialFlow?.appId || 'com.maestro.demoapp');
  const [events, setEvents] = useState<InteractionEvent[]>(initialFlow?.steps || []);
  const [yamlContent, setYamlContent] = useState(initialFlow?.yamlContent || `appId: ${appId}\n---\n- launchApp`);

  const handleSave = async () => {
    if (initialFlow?.id) {
      await api.updateFlow(initialFlow.id, { title, appId, steps: events, yamlContent });
      alert('Flow updated successfully!');
    } else {
      await api.createFlow({ title, appId, steps: events, yamlContent });
      alert('Flow created successfully!');
    }
  };

  const handleAIRefactor = async () => {
    const res = await api.optimizeFlow(events);
    if (res.success && res.optimizedEvents) {
      setEvents(res.optimizedEvents);
      alert(`AI Refactor Complete! Applied ${res.suggestions.length} optimizations.`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-dark-900 select-none">
      {/* Editor Header Bar */}
      <div className="h-14 bg-dark-800 border-b border-dark-700 px-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent font-bold text-base text-white focus:outline-none focus:border-b focus:border-brand-500"
          />
          <span className="text-xs text-slate-500 font-mono">App: {appId}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAIRefactor}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> AI Refactor
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-medium shadow-md shadow-brand-600/25"
          >
            <Save className="w-3.5 h-3.5" /> Save Flow
          </button>
        </div>
      </div>

      {/* Dual Panel Layout */}
      <div className="flex-1 grid grid-cols-2 overflow-hidden">
        <VisualFlowEditor events={events} onUpdateEvents={setEvents} />
        <LiveYamlEditor yamlContent={yamlContent} onChangeContent={setYamlContent} />
      </div>
    </div>
  );
};
