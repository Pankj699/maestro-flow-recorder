import React from 'react';
import { Separator } from 'react-resizable-panels';
import { GripVertical } from 'lucide-react';

interface CustomResizeHandleProps {
  id?: string;
  onReset?: () => void;
}

export const CustomResizeHandle: React.FC<CustomResizeHandleProps> = ({ id, onReset }) => {
  return (
    <Separator
      id={id}
      className="w-1.5 hover:w-2 bg-dark-900 border-x border-dark-600/60 hover:bg-brand-500/80 transition-all duration-150 relative group cursor-col-resize flex items-center justify-center select-none z-10"
      title="Drag to resize panel | Double-click to reset size"
    >
      <div className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded bg-brand-600 text-white shadow-glow">
        <GripVertical className="w-3 h-3" />
      </div>
    </Separator>
  );
};
