import React, { useEffect, useState } from 'react';
import { FileCode, Play, Trash2, Edit3, Plus, Tag } from 'lucide-react';
import { api } from '../services/api';

interface Flow {
  id: string;
  title: string;
  appId: string;
  description?: string;
  yamlContent: string;
  steps: any[];
  tags: string[];
  updatedAt: string;
}

interface FlowsPageProps {
  onSelectFlowToPlay: (flow: Flow) => void;
  onSelectFlowToEdit: (flow: Flow) => void;
}

export const FlowsPage: React.FC<FlowsPageProps> = ({
  onSelectFlowToPlay,
  onSelectFlowToEdit,
}) => {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFlows = async () => {
    setLoading(true);
    const res = await api.getFlows();
    if (res.success && res.flows) {
      setFlows(res.flows);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFlows();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this Maestro flow?')) {
      await api.deleteFlow(id);
      fetchFlows();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-dark-900 overflow-y-auto p-8 select-none">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8 border-b border-dark-700 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Maestro Test Flows</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage recorded test automation flows, edit steps, and replay on devices.
          </p>
        </div>
      </div>

      {/* Flows Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 text-xs">Loading recorded flows...</div>
      ) : flows.length === 0 ? (
        <div className="text-center py-16 bg-dark-800/40 border border-dark-700 rounded-2xl p-8">
          <FileCode className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No Maestro flows created yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Switch to the Recorder tab to record live interactions from a connected mobile device.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {flows.map((flow) => (
            <div
              key={flow.id}
              className="bg-dark-800 border border-dark-700 hover:border-dark-600 rounded-xl p-5 flex flex-col justify-between shadow-lg transition-all group"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-600/20 text-brand-cyan border border-brand-500/30">
                    {flow.appId}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectFlowToEdit(flow);
                      }}
                      className="p-1.5 hover:bg-dark-700 rounded text-slate-400 hover:text-slate-200"
                      title="Edit Flow"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(flow.id, e)}
                      className="p-1.5 hover:bg-rose-950/50 rounded text-slate-400 hover:text-rose-400"
                      title="Delete Flow"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-white group-hover:text-brand-cyan transition-colors">
                  {flow.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{flow.description || 'No description provided.'}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-dark-700 flex justify-between items-center">
                <span className="text-[11px] text-slate-500 font-mono">
                  {flow.steps.length} Steps
                </span>

                <button
                  onClick={() => onSelectFlowToPlay(flow)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-md shadow-emerald-600/20"
                >
                  <Play className="w-3 h-3 fill-current" /> Replay Flow
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
