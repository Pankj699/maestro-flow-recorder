import React, { useState } from 'react';
import { Plus, Trash2, Copy, MoveDown, CheckCircle2, Clock, Play, AlertCircle } from 'lucide-react';
import { InteractionEvent } from '../../store/slices/recordingSlice';

interface VisualFlowEditorProps {
  events: InteractionEvent[];
  onUpdateEvents: (events: InteractionEvent[]) => void;
}

export const VisualFlowEditor: React.FC<VisualFlowEditorProps> = ({
  events,
  onUpdateEvents,
}) => {
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);

  const handleDeleteStep = (id: string) => {
    onUpdateEvents(events.filter((e) => e.id !== id));
  };

  const handleDuplicateStep = (event: InteractionEvent) => {
    const duplicated: InteractionEvent = {
      ...event,
      id: `copy_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now(),
    };
    const index = events.findIndex((e) => e.id === event.id);
    const newEvents = [...events];
    newEvents.splice(index + 1, 0, duplicated);
    onUpdateEvents(newEvents);
  };

  const handleAddAssertionStep = () => {
    const assertStep: InteractionEvent = {
      id: `assert_${Date.now()}`,
      type: 'ASSERT_VISIBLE',
      timestamp: Date.now(),
      selector: { type: 'TEXT', value: 'Welcome', score: 80 },
    };
    onUpdateEvents([...events, assertStep]);
  };

  const handleAddWaitStep = () => {
    const waitStep: InteractionEvent = {
      id: `wait_${Date.now()}`,
      type: 'EXTENDED_WAIT',
      timestamp: Date.now(),
      selector: { type: 'TEXT', value: 'Dashboard', score: 80 },
    };
    onUpdateEvents([...events, waitStep]);
  };

  return (
    <div className="flex flex-col h-full bg-dark-900 border-r border-dark-700">
      {/* Editor Header Toolbar */}
      <div className="p-3 bg-dark-800 border-b border-dark-700 flex justify-between items-center text-xs">
        <span className="font-semibold text-slate-200">Visual Flow Editor ({events.length} Steps)</span>
        <div className="flex gap-2">
          <button
            onClick={handleAddAssertionStep}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/50 hover:bg-emerald-900/50 text-emerald-400 border border-emerald-800/50 text-[11px] font-medium"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> + Assert Step
          </button>

          <button
            onClick={handleAddWaitStep}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/50 hover:bg-amber-900/50 text-amber-400 border border-amber-800/50 text-[11px] font-medium"
          >
            <Clock className="w-3.5 h-3.5" /> + Extended Wait
          </button>
        </div>
      </div>

      {/* Step Cards List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {events.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No steps recorded yet. Start recording or insert a new step above.
          </div>
        ) : (
          events.map((event, index) => {
            const isSelected = selectedStepId === event.id;
            return (
              <div
                key={event.id}
                onClick={() => setSelectedStepId(event.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-dark-800 border-brand-500 ring-2 ring-brand-500/20'
                    : 'bg-dark-800/70 border-dark-700 hover:border-dark-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-dark-700 text-slate-300 font-mono text-[11px] flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <span className="font-semibold text-xs text-brand-cyan tracking-wide">{event.type}</span>
                      <p className="text-xs text-slate-300 font-mono mt-0.5">
                        {event.selector ? `${event.selector.type}: ${event.selector.value}` : event.textValue || event.appId || 'Action'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateStep(event);
                      }}
                      className="p-1 hover:bg-dark-700 rounded text-slate-400 hover:text-slate-200"
                      title="Duplicate Step"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStep(event.id);
                      }}
                      className="p-1 hover:bg-rose-950/50 rounded text-slate-400 hover:text-rose-400"
                      title="Delete Step"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
