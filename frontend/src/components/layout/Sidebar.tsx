import React from 'react';
import {
  Smartphone,
  Video,
  FileCode2,
  BarChart3,
  Settings,
  PlayCircle,
  Layers,
  Cpu,
  ShieldCheck,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  activePage: 'recorder' | 'flows' | 'editor' | 'player' | 'reports' | 'settings';
  onNavigate: (page: 'recorder' | 'flows' | 'editor' | 'player' | 'reports' | 'settings') => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const mainNav = [
    { id: 'recorder', label: 'Flow Recorder', icon: Video, section: 'WORKSPACE' },
    { id: 'flows', label: 'Test Suites', icon: Layers, section: 'WORKSPACE' },
    { id: 'editor', label: 'YAML Editor', icon: FileCode2, section: 'WORKSPACE' },
  ];

  const automationNav = [
    { id: 'player', label: 'Flow Execution', icon: PlayCircle, section: 'AUTOMATION' },
    { id: 'reports', label: 'Test Analytics', icon: BarChart3, section: 'AUTOMATION' },
  ];

  const systemNav = [
    { id: 'settings', label: 'Preferences', icon: Settings, section: 'SYSTEM' },
  ];

  const allNav = [...mainNav, ...automationNav, ...systemNav];

  // Render Compact Mini-Sidebar when collapsed
  if (isCollapsed) {
    return (
      <aside className="w-16 bg-dark-800 border-r border-dark-600 flex flex-col justify-between items-center py-3 select-none flex-shrink-0 transition-all duration-200 z-20">
        <div className="flex flex-col items-center gap-4 w-full">
          {/* Logo & Expand Button */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-brand-cyan flex items-center justify-center shadow-lg shadow-brand-500/20 border border-white/10">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-dark-700 transition-colors"
                title="Expand Sidebar"
              >
                <ChevronRight className="w-4 h-4 text-brand-cyan" />
              </button>
            )}
          </div>

          <div className="w-8 h-[1px] bg-dark-600 my-1" />

          {/* Compact Icon Navigation */}
          <nav className="flex flex-col items-center gap-2 w-full px-2">
            {allNav.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id as any)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-brand-600/20 text-brand-cyan border border-brand-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-dark-700/60'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Compact User Avatar */}
        <div className="w-8 h-8 rounded-full bg-brand-600/30 border border-brand-500/40 flex items-center justify-center text-brand-cyan font-bold text-xs">
          <User className="w-4 h-4 text-brand-500" />
        </div>
      </aside>
    );
  }

  // Render Full Expanded Sidebar
  const renderNavGroup = (title: string, items: typeof mainNav) => (
    <div className="space-y-1">
      <h3 className="px-3.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase font-mono">
        {title}
      </h3>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as any)}
            className={`w-full flex items-center justify-start gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-150 group relative ${
              isActive
                ? 'bg-brand-600/15 text-slate-100 border border-brand-500/40 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-dark-700/60 border border-transparent'
            }`}
            title={item.label}
          >
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-500 rounded-r-full shadow-glow" />
            )}
            <Icon
              className={`w-4 h-4 flex-shrink-0 transition-transform duration-150 group-hover:scale-110 ${
                isActive ? 'text-brand-500' : 'text-slate-400 group-hover:text-slate-200'
              }`}
            />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <aside className="w-56 lg:w-60 bg-dark-800 border-r border-dark-600 flex flex-col justify-between select-none flex-shrink-0 transition-all duration-200 z-20">
      <div className="space-y-6">
        {/* Brand Logo & Minimize Button Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-dark-600 bg-dark-900/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-brand-cyan flex items-center justify-center shadow-lg shadow-brand-500/20 flex-shrink-0 border border-white/10">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-xs text-white tracking-tight truncate">Maestro Studio</h1>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-brand-500/20 text-brand-cyan border border-brand-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[9px] text-slate-400 font-mono tracking-wider truncate">AUTOMATION ENGINE</p>
            </div>
          </div>

          {/* Minimize / Collapse Sidebar Button */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-dark-700/80 transition-colors ml-1"
              title="Minimize Sidebar"
            >
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="px-2.5 space-y-4">
          {renderNavGroup('Workspace', mainNav)}
          {renderNavGroup('Execution', automationNav)}
          {renderNavGroup('Preferences', systemNav)}
        </nav>
      </div>

      {/* Footer Section: Engine Status & User Profile */}
      <div className="p-2.5 border-t border-dark-600 bg-dark-900/50 space-y-2.5">
        {/* Engine Status Card */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-dark-700/60 border border-dark-600/80">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-mono text-slate-300">ADB v1.34</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm" />
            <span className="text-[10px] font-medium text-emerald-400">Ready</span>
          </div>
        </div>

        {/* Bottom User Profile */}
        <div className="flex items-center justify-between px-1.5 py-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-brand-600/30 border border-brand-500/40 flex items-center justify-center text-brand-cyan font-bold text-xs">
              <User className="w-3.5 h-3.5 text-brand-500" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-200 truncate">Automation Lead</p>
              <p className="text-[9px] text-slate-400 font-mono truncate">sdets@enterprise.io</p>
            </div>
          </div>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        </div>
      </div>
    </aside>
  );
};
