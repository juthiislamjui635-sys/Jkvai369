import React from 'react';
import { 
  Layers, 
  Cpu, 
  Database, 
  Smartphone, 
  ShieldCheck, 
  Flame, 
  Gamepad2, 
  Users, 
  Server,
  Zap
} from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-bold text-slate-100 tracking-wide uppercase">
            Clean Architecture & Layer Separation
          </h2>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          Decoupled Domain Engine
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-5 leading-relaxed">
        Strict separation of concerns: The Ludo rules engine, dice math, and state machine have 
        zero dependency on Flutter UI widgets. This ensures fast headless unit testing, zero UI-blocking calculations, 
        and seamless pluggability with Firebase Realtime Database for authoritative multiplayer synchronization.
      </p>

      {/* Layer Stack */}
      <div className="space-y-3">
        {/* Layer 1: Presentation */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-slate-200">1. PRESENTATION LAYER (Flutter & Flame)</span>
            </div>
            <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/60">
              Reactive UI & Rendering
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span className="font-semibold text-slate-100 block">Screens & Widgets</span>
              Splash, Home, Room, Game, Profile
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span className="font-semibold text-slate-100 block">Flame Canvas</span>
              High-FPS token animations & particle FX
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span className="font-semibold text-slate-100 block">State BLoC / Cubits</span>
              GameBloc, AuthBloc, RoomCubit
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span className="font-semibold text-slate-100 block">Design System</span>
              Material 3, Poppins, Gold Palette
            </div>
          </div>
        </div>

        {/* Layer 2: Domain & Pure Game Engine */}
        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-300">2. CORE DOMAIN & PURE GAME ENGINE</span>
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
              100% Framework Independent
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="p-2 rounded-lg bg-slate-900/90 border border-amber-500/20 text-slate-300">
              <span className="font-semibold text-amber-300 block">Board & Path Math</span>
              52 global cells, 5 home tracks, 8 safe stars
            </div>
            <div className="p-2 rounded-lg bg-slate-900/90 border border-amber-500/20 text-slate-300">
              <span className="font-semibold text-amber-300 block">Token State Machine</span>
              HOME, BOARD, SAFE, FINISHED
            </div>
            <div className="p-2 rounded-lg bg-slate-900/90 border border-amber-500/20 text-slate-300">
              <span className="font-semibold text-amber-300 block">Valid Move Resolver</span>
              Opening on 6, pass on blocked paths
            </div>
            <div className="p-2 rounded-lg bg-slate-900/90 border border-amber-500/20 text-slate-300">
              <span className="font-semibold text-amber-300 block">AI Heuristic Engine</span>
              Capture priority, safety & sprint weighting
            </div>
          </div>
        </div>

        {/* Layer 3: Multiplayer & Anti-Cheat Validation */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-slate-200">3. MULTIPLAYER & ANTI-CHEAT PIPELINE</span>
            </div>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/60">
              Authoritative Sync
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span className="font-semibold text-slate-100 block">Firebase Realtime DB</span>
              Sub-100ms turn broadcast & ephemeral sync
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span className="font-semibold text-slate-100 block">Dice Cryptographic Verification</span>
              Server or host signed roll generation
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span className="font-semibold text-slate-100 block">Heartbeat & Recovery</span>
              15s timeout with reconnect state restore
            </div>
          </div>
        </div>

        {/* Layer 4: Infrastructure & Services */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200">4. INFRASTRUCTURE & PERSISTENCE</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
              Free-Tier Optimized
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span className="font-semibold text-slate-100 block">Cloud Firestore</span>
              Profiles, match histories, stats, friends
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span className="font-semibold text-slate-100 block">Firebase Storage</span>
              Compressed avatar images & profile assets
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span className="font-semibold text-slate-100 block">Audio Players</span>
              Background music, dice clatter & victory SFX
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span className="font-semibold text-slate-100 block">Service Locator (GetIt)</span>
              Dependency injection container
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
