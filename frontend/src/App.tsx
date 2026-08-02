import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import { Sidebar } from './components/layout/Sidebar';
import { RecorderPage } from './pages/RecorderPage';
import { FlowsPage } from './pages/FlowsPage';
import { FlowEditorPage } from './pages/FlowEditorPage';
import { PlayerPage } from './pages/PlayerPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

const queryClient = new QueryClient();
const LOCAL_STORAGE_KEY = 'maestro_ide_layout_v2';

export const AppContent: React.FC = () => {
  const [activePage, setActivePage] = useState<'recorder' | 'flows' | 'editor' | 'player' | 'reports' | 'settings'>('recorder');
  const [selectedFlowToEdit, setSelectedFlowToEdit] = useState<any>(null);
  const [selectedFlowToPlay, setSelectedFlowToPlay] = useState<any>(null);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved).isSidebarCollapsed || false : false;
    } catch {
      return false;
    }
  });

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) : {};
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...parsed, isSidebarCollapsed: next }));
      } catch (e) {
        console.warn('Failed to save sidebar state to localStorage', e);
      }
      return next;
    });
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-dark-900 font-sans antialiased selection:bg-brand-500/30 selection:text-brand-cyan">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {activePage === 'recorder' && <RecorderPage />}

        {activePage === 'flows' && (
          <FlowsPage
            onSelectFlowToPlay={(flow) => {
              setSelectedFlowToPlay(flow);
              setActivePage('player');
            }}
            onSelectFlowToEdit={(flow) => {
              setSelectedFlowToEdit(flow);
              setActivePage('editor');
            }}
          />
        )}

        {activePage === 'editor' && <FlowEditorPage initialFlow={selectedFlowToEdit} />}

        {activePage === 'player' && <PlayerPage flowToPlay={selectedFlowToPlay} />}

        {activePage === 'reports' && <ReportsPage />}

        {activePage === 'settings' && <SettingsPage />}
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
