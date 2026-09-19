import React from 'react';
import { 
  CheckCircle2, 
  CircleDot, 
  Clock, 
  ArrowRight, 
  Sparkles
} from 'lucide-react';
import { ROADMAP_PHASES } from '../data/flutterFiles';

export const PhaseRoadmap: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-100 tracking-wide uppercase flex items-center gap-2">
            <CircleDot className="w-4 h-4 text-amber-400 animate-pulse" />
            37-Phase Master Production Roadmap
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict sequential implementation ensuring each phase is verified before advancing.
          </p>
        </div>
        <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          Completed: Phase 1 & 2 • Next: Phase 3
        </div>
      </div>

      {/* Phase 2 Verification Box */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Phase 2 Deliverables Verified (Theme + Navigation + Splash + Reusable Components)
          </span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
            100% Verified
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Premium JK LODU Theme (Light & Dark luxury with gold accents)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>App-wide navigation & routing (Login, Home, Game, Rooms, Settings)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Animated Splash Screen with JK LODU branding & smooth transition</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Authentication state routing (Google Sign-In & Offline Guest flow)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Reusable Widgets: Buttons, Cards, Dialogs, Loading Indicators, Avatars, Typography</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Zero duplicates: clean architecture in lib/app/, lib/core/, and feature packages</span>
          </div>
        </div>
      </div>

      {/* Phase Timeline */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {ROADMAP_PHASES.map((phase) => {
          const isCompleted = phase.status === 'completed';
          const isActive = phase.status === 'active';

          return (
            <div
              key={phase.number}
              className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                isActive
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-200 shadow-xs'
                  : isCompleted
                  ? 'bg-slate-800/50 border-emerald-500/30 text-slate-200'
                  : 'bg-slate-950/30 border-slate-800/60 text-slate-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950'
                    : isCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  {phase.number}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${isActive ? 'text-amber-300' : isCompleted ? 'text-slate-200' : 'text-slate-400'}`}>
                      PHASE {phase.number}: {phase.title}
                    </span>
                    {isCompleted && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono font-semibold">
                        COMPLETED
                      </span>
                    )}
                    {isActive && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-semibold">
                        CURRENT
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {phase.description}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-xs mt-0.5">
                {isCompleted ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Done
                  </span>
                ) : isActive ? (
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <CircleDot className="w-3.5 h-3.5 animate-pulse" /> Active
                  </span>
                ) : (
                  <span className="text-slate-600 flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3" /> Queued
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
