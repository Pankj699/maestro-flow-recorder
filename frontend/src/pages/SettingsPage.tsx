import React, { useState } from 'react';
import { Save, Terminal, Smartphone, Wifi, Database } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [adbPath, setAdbPath] = useState(() => localStorage.getItem('maestro_adb_path') || 'adb');
  const [wdaUrl, setWdaUrl] = useState(() => localStorage.getItem('maestro_wda_url') || 'http://localhost:8100');
  const [maestroCliPath, setMaestroCliPath] = useState(() => localStorage.getItem('maestro_cli_path') || 'maestro');
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('maestro_adb_path', adbPath);
    localStorage.setItem('maestro_wda_url', wdaUrl);
    localStorage.setItem('maestro_cli_path', maestroCliPath);

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adbPath, wdaUrl, maestroCliPath }),
      });
    } catch (err) {
      // Ignore network fallback
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col bg-dark-900 overflow-y-auto p-8 select-none">
      <div className="max-w-3xl mx-auto w-full space-y-6">
        <div className="border-b border-dark-700 pb-4">
          <h1 className="text-2xl font-bold text-white">Maestro Engine Settings</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure ADB CLI bridge, iOS WebDriverAgent server, and database persistence settings.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Android Settings Card */}
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Android ADB Bridge Settings</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium block">ADB Binary Path</label>
              <input
                type="text"
                value={adbPath}
                onChange={(e) => setAdbPath(e.target.value)}
                className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* iOS Settings Card */}
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Wifi className="w-4 h-4 text-brand-cyan" />
              <span>iOS WebDriverAgent (WDA) Settings</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium block">WDA Server Endpoint</label>
              <input
                type="text"
                value={wdaUrl}
                onChange={(e) => setWdaUrl(e.target.value)}
                className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Maestro CLI Settings Card */}
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>Maestro CLI Binary Settings</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium block">Maestro CLI Path</label>
              <input
                type="text"
                value={maestroCliPath}
                onChange={(e) => setMaestroCliPath(e.target.value)}
                className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-lg text-xs shadow-lg shadow-brand-600/30"
            >
              <Save className="w-4 h-4" /> Save Settings
            </button>

            {saved && (
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1.5 rounded-lg animate-pulse">
                ✓ Settings Saved & Persisted!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
