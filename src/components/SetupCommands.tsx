import React, { useState } from 'react';
import { Terminal, Copy, Check, Info, ShieldAlert, Cpu } from 'lucide-react';

export const SetupCommands: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCmd = (cmd: string, index: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const commands = [
    {
      title: '1. Verify Flutter & Dart SDK Environment',
      description: 'Confirm Flutter 3.19+ and Android toolchain are healthy',
      cmd: 'flutter doctor -v'
    },
    {
      title: '2. Create / Switch to JK LODU Project Directory',
      description: 'Create clean Flutter project with Android primary target',
      cmd: 'flutter create --org com.jklodu --project-name jk_lodu --platforms android,web,ios jk_lodu\ncd jk_lodu'
    },
    {
      title: '3. Fetch Production & Free-Tier Packages',
      description: 'Install state management, Firebase, Flame, and audio dependencies',
      cmd: 'flutter pub get'
    },
    {
      title: '4. Run Static Analysis & Linter Verification',
      description: 'Validate strict-cast rules and clean architecture boundaries',
      cmd: 'flutter analyze'
    },
    {
      title: '5. Launch App on Android Device or Emulator',
      description: 'Execute JK LODU with edge-to-edge system UI and initial splash screen',
      cmd: 'flutter run -d android'
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-slate-100 tracking-wide uppercase">
            Phase 1 Terminal Commands & Verification
          </h2>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Bash / Zsh / PowerShell
        </span>
      </div>

      <div className="space-y-3">
        {commands.map((c, i) => (
          <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-200">{c.title}</span>
              <span className="text-[11px] text-slate-400">{c.description}</span>
            </div>
            <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#0B0F19] border border-slate-800 font-mono text-xs text-amber-300">
              <span className="truncate selection:bg-amber-500/30">{c.cmd}</span>
              <button
                onClick={() => copyCmd(c.cmd, i)}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-300 transition-colors shrink-0"
                title="Copy command"
              >
                {copiedIndex === i ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Free Tier Notice */}
      <div className="mt-4 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-2.5 text-xs text-emerald-300">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Zero Paid Services Guarantee: </span>
          All Phase 1 dependencies and upcoming Firebase components (Authentication, Firestore, Realtime Database, Cloud Storage) 
          operate 100% within Google Firebase's generous perpetual free tier (Spark plan).
        </div>
      </div>
    </div>
  );
};
