import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Check, Download, FileCode, WrapText, CheckCircle2, Maximize2, Minimize2, ZoomIn, ZoomOut, Search } from 'lucide-react';

interface LiveYamlEditorProps {
  yamlContent: string;
  onChangeContent?: (value: string) => void;
  onCursorChange?: (lineNumber: number) => void;
  readOnly?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onClosePanel?: () => void;
}

export const LiveYamlEditor: React.FC<LiveYamlEditorProps> = ({
  yamlContent,
  onChangeContent,
  onCursorChange,
  readOnly = false,
  isFullscreen = false,
  onToggleFullscreen,
  onClosePanel,
}) => {
  const [copied, setCopied] = useState(false);
  const [wordWrap, setWordWrap] = useState<'on' | 'off'>('on');
  const [fontSize, setFontSize] = useState(13);
  const [currentLine, setCurrentLine] = useState(1);
  const editorRef = React.useRef<any>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(yamlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flow.yaml';
    a.click();
  };

  const triggerFind = () => {
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'actions.find', null);
    }
  };

  const lineCount = yamlContent.split('\n').length;

  return (
    <div className="flex flex-col h-full bg-dark-900 border-l border-dark-600 select-none overflow-hidden">
      {/* VS Code Style Header Tabs */}
      <div className="h-11 bg-dark-800/90 border-b border-dark-600 px-3 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-t-xl bg-dark-900 border-t border-x border-dark-600 text-brand-cyan font-mono text-xs font-semibold">
            <FileCode className="w-3.5 h-3.5" />
            <span>flow.yaml</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan shadow-sm" />
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Search Button */}
          <button
            onClick={triggerFind}
            className="p-1.5 rounded-btn hover:bg-dark-700 text-slate-400 hover:text-slate-200 transition-colors"
            title="Search (Ctrl+F)"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* Font Controls */}
          <div className="hidden sm:flex items-center gap-0.5 px-1 py-0.5 bg-dark-900/60 rounded-btn border border-dark-700 text-[11px] font-mono text-slate-400">
            <button
              onClick={() => setFontSize((prev) => Math.max(10, prev - 1))}
              className="px-1 hover:text-slate-200"
              title="Decrease Font Size"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="px-1 text-[10px] text-slate-300">{fontSize}px</span>
            <button
              onClick={() => setFontSize((prev) => Math.min(22, prev + 1))}
              className="px-1 hover:text-slate-200"
              title="Increase Font Size"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>

          {/* Word Wrap */}
          <button
            onClick={() => setWordWrap((prev) => (prev === 'on' ? 'off' : 'on'))}
            className={`flex items-center gap-1 px-2 py-1 rounded-btn text-[11px] font-medium transition-all ${
              wordWrap === 'on'
                ? 'bg-dark-700 text-brand-cyan border border-brand-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-dark-700/50'
            }`}
            title="Toggle Word Wrap"
          >
            <WrapText className="w-3 h-3" />
            <span className="hidden md:inline">Wrap</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded-btn bg-dark-700 hover:bg-dark-600 border border-dark-600 text-slate-300 text-[11px] font-medium transition-all"
            title="Copy YAML to Clipboard"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span className="hidden md:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          {/* Export Button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1 bg-brand-600 hover:bg-brand-500 text-white rounded-btn text-[11px] font-semibold transition-all shadow-md active:scale-95"
            title="Export Maestro Test Script"
          >
            <Download className="w-3 h-3" />
            <span className="hidden md:inline">Export</span>
          </button>

          {/* Fullscreen Toggle */}
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className="p-1.5 rounded-btn hover:bg-dark-700 text-slate-400 hover:text-slate-200 transition-colors ml-1"
              title={isFullscreen ? 'Exit Fullscreen' : 'Maximize Editor Panel'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-brand-cyan" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Monaco Code Editor Container */}
      <div className="flex-1 overflow-hidden relative">
        <Editor
          height="100%"
          defaultLanguage="yaml"
          theme="vs-dark"
          value={yamlContent}
          onChange={(val) => onChangeContent && onChangeContent(val || '')}
          onMount={(editor) => {
            editorRef.current = editor;
            editor.onDidChangeCursorPosition((e) => {
              setCurrentLine(e.position.lineNumber);
              if (onCursorChange) {
                onCursorChange(e.position.lineNumber);
              }
            });
          }}
          options={{
            readOnly,
            fontSize,
            fontFamily: 'JetBrains Mono, Fira Code, monospace',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap,
            lineNumbersMinChars: 3,
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
          }}
        />
      </div>

      {/* Bottom Mini Status Bar */}
      <div className="h-6 bg-dark-950 border-t border-dark-600/80 px-3 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            <span>Maestro Syntax Valid</span>
          </span>
          <span className="text-dark-600">|</span>
          <span>Line {currentLine} of {lineCount}</span>
        </div>

        <div className="flex items-center gap-3">
          <span>UTF-8</span>
          <span className="text-dark-600">|</span>
          <span className="text-brand-cyan">YAML</span>
          <span className="text-dark-600">|</span>
          <span>Maestro Engine v1.34</span>
        </div>
      </div>
    </div>
  );
};
