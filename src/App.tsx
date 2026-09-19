import React, { useState } from 'react';
import { 
  Dices, 
  Layers, 
  FolderTree, 
  Terminal, 
  CheckCircle2, 
  Smartphone, 
  Cpu, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  Sun,
  Moon,
  Github
} from 'lucide-react';
import { PhoneSimulator } from './components/PhoneSimulator';
import { FileBrowser } from './components/FileBrowser';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { SetupCommands } from './components/SetupCommands';
import { PhaseRoadmap } from './components/PhaseRoadmap';
import { FLUTTER_FILES } from './data/flutterFiles';
import { AppThemeMode } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'code' | 'architecture' | 'setup' | 'roadmap'>('code');
  const [themeMode, setThemeMode] = useState<AppThemeMode>('dark');

  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-[#0B0F19]/90 backdrop-blur sticky top-0 z-50 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo Badge */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-[2px] shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Dices className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-wider text-white">
                  JK LODU
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 tracking-wider uppercase">
                  Phase 2 Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                The Ultimate Multiplayer Ludo Experience (Flutter • Android • Firebase)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-medium">Phase 2: Theme, Nav & Splash Verified</span>
            </div>

            <button
              id="theme-toggle-header"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              title={themeMode === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            >
              {themeMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Mobile Phone Simulator */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-md">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-300 px-1">
              <span>Interactive Mobile Shell</span>
              <span className="text-[11px] text-amber-400 font-mono">Live Material 3 Preview</span>
            </div>
            <PhoneSimulator themeMode={themeMode} onToggleTheme={toggleTheme} />
          </div>
        </div>

        {/* Right Column: Codebase, Architecture, Commands, Roadmap */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
            <button
              id="tab-code"
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'code'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>Project Files ({FLUTTER_FILES.length})</span>
            </button>

            <button
              id="tab-architecture"
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'architecture'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Clean Architecture</span>
            </button>

            <button
              id="tab-setup"
              onClick={() => setActiveTab('setup')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'setup'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Terminal & Run</span>
            </button>

            <button
              id="tab-roadmap"
              onClick={() => setActiveTab('roadmap')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'roadmap'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>19-Phase Roadmap</span>
            </button>
          </div>

          {/* Active Tab Panel */}
          <div className="w-full">
            {activeTab === 'code' && <FileBrowser files={FLUTTER_FILES} />}
            {activeTab === 'architecture' && <ArchitectureDiagram />}
            {activeTab === 'setup' && <SetupCommands />}
            {activeTab === 'roadmap' && <PhaseRoadmap />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-3 px-6 text-center text-xs text-slate-500 bg-[#0B0F19]/50">
        <span>JK LODU • Production Mobile Architecture & Engine • Phase 1 Completed Successfully</span>
      </footer>
    </div>
  );
}
