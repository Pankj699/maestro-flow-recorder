import React from 'react';
import { Copy, Check, Info, ShieldCheck, Tag, Target, Box, Activity } from 'lucide-react';
import { HierarchyNode } from '../../store/slices/recordingSlice';

interface NodeInspectorProps {
  node: HierarchyNode | null;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({ node }) => {
  const [copied, setCopied] = React.useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!node) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-slate-500 text-xs text-center bg-dark-900">
        <Info className="w-8 h-8 mb-2 text-slate-600 animate-pulse" />
        <p className="font-medium text-slate-400">No Node Selected</p>
        <p className="text-[10px] text-slate-500 mt-1 max-w-[200px]">
          Click an element on the screen mirror or UI tree inspector to view properties.
        </p>
      </div>
    );
  }

  const sections = [
    {
      title: 'General Properties',
      icon: <Tag className="w-3.5 h-3.5 text-brand-cyan" />,
      items: [
        { label: 'Resource ID', value: node.resourceId || 'N/A' },
        { label: 'Text', value: node.text || 'N/A' },
        { label: 'Class Name', value: node.className },
      ],
    },
    {
      title: 'Selectors & Locators',
      icon: <Target className="w-3.5 h-3.5 text-brand-purple" />,
      items: [
        { label: 'Accessibility ID', value: node.accessibilityId || 'N/A' },
        { label: 'Content Description', value: node.contentDescription || 'N/A' },
        { label: 'XPath', value: node.xpath },
      ],
    },
    {
      title: 'Screen Coordinates & Bounds',
      icon: <Box className="w-3.5 h-3.5 text-amber-400" />,
      items: [
        {
          label: 'Bounds Rect',
          value: `[${node.bounds.x}, ${node.bounds.y}][${node.bounds.x + node.bounds.width}, ${
            node.bounds.y + node.bounds.height
          }] (${node.bounds.width}x${node.bounds.height})`,
        },
      ],
    },
  ];

  const flags = [
    { label: 'Clickable', value: node.clickable },
    { label: 'Focusable', value: node.focusable },
    { label: 'Scrollable', value: node.scrollable },
    { label: 'Enabled', value: node.enabled },
    { label: 'Selected', value: node.selected },
    { label: 'Visible', value: node.visible },
  ];

  return (
    <div className="flex flex-col h-full bg-dark-900 border-r border-dark-600 overflow-y-auto custom-scrollbar select-none">
      {/* Title Header */}
      <div className="px-4 py-3 bg-dark-800/80 border-b border-dark-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-brand-cyan" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
            Properties Inspector
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
          Active Node
        </span>
      </div>

      <div className="p-4 space-y-4 text-xs">
        {/* Section Property Cards */}
        {sections.map((section) => (
          <div key={section.title} className="bg-dark-700/50 rounded-card p-3 border border-dark-600/70 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 font-mono">
              {section.icon}
              <span>{section.title}</span>
            </div>

            <div className="space-y-2">
              {section.items.map((attr) => (
                <div key={attr.label} className="bg-dark-900/60 p-2.5 rounded-xl border border-dark-600/60">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                    <span>{attr.label}</span>
                    {attr.value !== 'N/A' && (
                      <button
                        onClick={() => handleCopy(attr.value, attr.label)}
                        className="hover:text-brand-cyan transition-colors"
                        title="Copy to Clipboard"
                      >
                        {copied === attr.label ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-400 hover:text-slate-200" />
                        )}
                      </button>
                    )}
                  </div>
                  <div className="font-mono text-[11px] text-slate-200 break-all select-all">
                    {attr.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* State Flags Grid Card */}
        <div className="bg-dark-700/50 rounded-card p-3 border border-dark-600/70 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Accessibility & States</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {flags.map((flag) => (
              <div
                key={flag.label}
                className={`p-2 rounded-xl border text-center font-mono text-[10px] transition-all ${
                  flag.value
                    ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300 font-semibold'
                    : 'bg-dark-900/60 border-dark-600/60 text-slate-500'
                }`}
              >
                {flag.label}: <strong>{flag.value ? 'TRUE' : 'FALSE'}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
