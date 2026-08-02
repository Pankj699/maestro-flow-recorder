import React from 'react';
import { X, Layers, Activity } from 'lucide-react';
import { HierarchyTree } from './HierarchyTree';
import { NodeInspector } from './NodeInspector';
import { HierarchyNode } from '../../store/slices/recordingSlice';

interface UIInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  hierarchy: HierarchyNode | null;
  selectedNode: HierarchyNode | null;
  onSelectNode: (node: HierarchyNode) => void;
}

export const UIInspectorModal: React.FC<UIInspectorModalProps> = ({
  isOpen,
  onClose,
  hierarchy,
  selectedNode,
  onSelectNode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md animate-fade-in p-4 lg:p-8 select-none">
      <div className="bg-dark-800 border border-dark-600 rounded-panel max-w-5xl w-full h-[85vh] shadow-ide-lg overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-3.5 bg-dark-900 border-b border-dark-600 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-cyan">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>UI Element Tree & Properties Inspector</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                  Live Hierarchy
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Inspect accessibility nodes, resource IDs, bounds & attributes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-dark-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content: 2-Column Inspector Split View */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
          {/* Column 1: UI Tree Hierarchy */}
          <div className="h-full overflow-hidden border-r border-dark-600">
            <HierarchyTree
              hierarchy={hierarchy}
              selectedNode={selectedNode}
              onSelectNode={onSelectNode}
            />
          </div>

          {/* Column 2: Node Inspector Properties */}
          <div className="h-full overflow-hidden">
            <NodeInspector node={selectedNode} />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-dark-900 border-t border-dark-600 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Click any element to inspect properties & copy selectors</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-btn text-xs transition-all shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
