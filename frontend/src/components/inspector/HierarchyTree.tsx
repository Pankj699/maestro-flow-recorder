import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Search, Type, Image as ImageIcon, Box, FileText, TouchpadIcon, Shield, X, Layers } from 'lucide-react';
import { HierarchyNode } from '../../store/slices/recordingSlice';

interface HierarchyTreeProps {
  hierarchy: HierarchyNode | null;
  selectedNode: HierarchyNode | null;
  onSelectNode: (node: HierarchyNode) => void;
}

export const HierarchyTree: React.FC<HierarchyTreeProps> = ({
  hierarchy,
  selectedNode,
  onSelectNode,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({ root_login: true });

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getWidgetIcon = (className: string) => {
    const cls = className.toLowerCase();
    if (cls.includes('button')) return <TouchpadIcon className="w-3.5 h-3.5 text-brand-amber" />;
    if (cls.includes('edittext')) return <Type className="w-3.5 h-3.5 text-brand-cyan" />;
    if (cls.includes('image')) return <ImageIcon className="w-3.5 h-3.5 text-brand-purple" />;
    if (cls.includes('textview')) return <FileText className="w-3.5 h-3.5 text-slate-300" />;
    return <Box className="w-3.5 h-3.5 text-slate-400" />;
  };

  const renderNode = (node: HierarchyNode, depth: number = 0) => {
    const isExpanded = !!expandedIds[node.id];
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode?.id === node.id;
    const widgetName = node.className.split('.').pop() || node.className;
    const cleanId = node.resourceId?.includes(':id/') ? node.resourceId.split(':id/')[1] : node.resourceId;

    // Filter node if search query active
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      const matchText = node.text?.toLowerCase().includes(query);
      const matchId = node.resourceId?.toLowerCase().includes(query);
      const matchClass = node.className.toLowerCase().includes(query);
      if (!matchText && !matchId && !matchClass) {
        return null;
      }
    }

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={() => onSelectNode(node)}
          className={`flex items-center gap-2 py-1 px-2.5 rounded-lg text-xs cursor-pointer transition-all duration-150 ${
            isSelected
              ? 'bg-brand-600/30 text-white font-medium border border-brand-500/50 shadow-sm'
              : 'hover:bg-dark-700/60 text-slate-300 border border-transparent'
          }`}
          style={{ paddingLeft: `${depth * 14 + 10}px` }}
        >
          {hasChildren ? (
            <button
              onClick={(e) => toggleExpand(node.id, e)}
              className="p-0.5 hover:bg-dark-600/80 rounded transition-transform"
            >
              <ChevronRight
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
                  isExpanded ? 'rotate-90 text-brand-cyan' : ''
                }`}
              />
            </button>
          ) : (
            <span className="w-3.5" />
          )}

          {getWidgetIcon(node.className)}

          <span className="font-mono text-[11px] font-semibold text-brand-cyan truncate">
            {widgetName}
          </span>

          {cleanId && (
            <span className="text-[10px] text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-800/40 font-mono shrink-0">
              #{cleanId}
            </span>
          )}

          {node.text && (
            <span className="text-[11px] text-slate-300 font-sans italic truncate max-w-[150px]">
              "{node.text}"
            </span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="border-l border-dark-700/60 ml-3">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-dark-900 border-r border-dark-600">
      {/* Header Bar */}
      <div className="px-4 py-3 border-b border-dark-600 bg-dark-800/50 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-cyan" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
              UI Tree Inspector
            </h2>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-dark-700 text-slate-400 border border-dark-600">
            DevTools Mode
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Filter nodes by ID, Text, or Class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-800 border border-dark-600 rounded-input pl-8 pr-8 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 placeholder-slate-500 shadow-inner"
          />
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 p-2 overflow-y-auto font-mono custom-scrollbar">
        {hierarchy ? (
          renderNode(hierarchy)
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500">
            <Layers className="w-10 h-10 mb-2 text-dark-600 animate-pulse" />
            <p className="text-xs font-medium text-slate-400">No UI Tree Loaded</p>
            <p className="text-[10px] text-slate-500 mt-1">Select a connected Android device to inspect accessibility tree</p>
          </div>
        )}
      </div>
    </div>
  );
};
