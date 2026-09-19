import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Music, 
  Vibrate, 
  Monitor, 
  ShieldCheck, 
  Globe, 
  LogOut, 
  Trash2, 
  RotateCcw, 
  Sliders, 
  HelpCircle,
  FileText,
  Info,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface SettingsScreenProps {
  onBack: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  musicEnabled: boolean;
  onToggleMusic: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  authStatus: 'google' | 'guest';
  onLogout: () => void;
  onReplayIntro: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  soundEnabled,
  onToggleSound,
  musicEnabled,
  onToggleMusic,
  isDark,
  onToggleTheme,
  authStatus,
  onLogout,
  onReplayIntro,
}) => {
  const [turnTimer, setTurnTimer] = useState<15 | 30 | 45>(15);
  const [autoMove, setAutoMove] = useState<boolean>(true);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  const [graphicsQuality, setGraphicsQuality] = useState<'low' | 'med' | 'high' | 'ultra'>('ultra');
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string | null>(null);

  const triggerToast = (text: string) => {
    setToastText(text);
    setTimeout(() => setToastText(null), 2500);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-hidden relative">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/70 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-black tracking-wider text-amber-400">
              SETTINGS & PREFERENCES
            </h2>
            <span className="text-[10px] text-slate-400 font-medium">
              JK LODU v1.0.0 (Production Build)
            </span>
          </div>
        </div>
      </div>

      {/* Settings Scroll Body */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
        {/* SECTION 1: GAMEPLAY */}
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5" />
            <span>Gameplay Settings</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-200">Auto Move Single Pawn</div>
              <div className="text-[10px] text-slate-400">Automatically moves pawn if only 1 valid move exists</div>
            </div>
            <button
              onClick={() => {
                setAutoMove(!autoMove);
                triggerToast(autoMove ? 'Auto-move disabled' : 'Auto-move enabled');
              }}
              className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                autoMove ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                autoMove ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
            <div>
              <div className="font-bold text-slate-200">Turn Timer Limit</div>
              <div className="text-[10px] text-slate-400">Turn time before AI auto-rolls</div>
            </div>
            <div className="flex gap-1">
              {([15, 30, 45] as const).map(sec => (
                <button
                  key={sec}
                  onClick={() => {
                    setTurnTimer(sec);
                    triggerToast(`Timer set to ${sec} seconds`);
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                    turnTimer === sec
                      ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-sm'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2: AUDIO & HAPTICS */}
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-wider">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Audio & Haptics</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-slate-400" />
              <div>
                <div className="font-bold text-slate-200">Sound Effects (SFX)</div>
                <div className="text-[10px] text-slate-400">Dice roll, pawn jump, and captures</div>
              </div>
            </div>
            <button
              onClick={onToggleSound}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                soundEnabled
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-slate-400" />
              <div>
                <div className="font-bold text-slate-200">Background Music (BGM)</div>
                <div className="text-[10px] text-slate-400">Ambient royal gaming symphony</div>
              </div>
            </div>
            <button
              onClick={onToggleMusic}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                musicEnabled
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
            >
              {musicEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
            <div className="flex items-center gap-2">
              <Vibrate className="w-4 h-4 text-slate-400" />
              <div>
                <div className="font-bold text-slate-200">Haptic Vibration</div>
                <div className="text-[10px] text-slate-400">Tactile pulse on 6-rolls & captures</div>
              </div>
            </div>
            <button
              onClick={() => {
                setVibrationEnabled(!vibrationEnabled);
                triggerToast(vibrationEnabled ? 'Haptics OFF' : 'Haptics ON');
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                vibrationEnabled
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
            >
              {vibrationEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* SECTION 3: GRAPHICS & DISPLAY */}
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-wider">
            <Monitor className="w-3.5 h-3.5" />
            <span>Graphics & Performance</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-200">Visual Quality Preset</div>
              <div className="text-[10px] text-slate-400">Pawn bevels, shadows & particle count</div>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {(['low', 'med', 'high', 'ultra'] as const).map(q => (
                <button
                  key={q}
                  onClick={() => {
                    setGraphicsQuality(q);
                    triggerToast(`Graphics set to ${q.toUpperCase()}`);
                  }}
                  className={`px-1.5 py-1 rounded-lg text-[9px] font-bold uppercase border transition-all ${
                    graphicsQuality === q
                      ? 'bg-amber-500 border-amber-400 text-slate-950'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 4: LANGUAGE */}
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            <span>Language / ভাষা</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setLanguage('en');
                triggerToast('Language: English');
              }}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-between ${
                language === 'en'
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              <span>English</span>
              {language === 'en' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
            </button>

            <button
              onClick={() => {
                setLanguage('bn');
                triggerToast('ভাষা: বাংলা (Bengali)');
              }}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-between ${
                language === 'bn'
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              <span>বাংলা (Bengali)</span>
              {language === 'bn' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
            </button>
          </div>
        </div>

        {/* SECTION 5: ACCOUNT & REPLAY */}
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Account & Security</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-200">
                {authStatus === 'google' ? 'Google Account Connected' : 'Guest Profile'}
              </div>
              <div className="text-[10px] text-slate-400">UID: JK-4821 • Security Verified</div>
            </div>
            <button
              onClick={onLogout}
              className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-[10px] font-bold flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              <span>Log Out</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
            <button
              onClick={onReplayIntro}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Replay Cinematic Game Intro</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center py-2 text-[10px] text-slate-500 font-semibold space-y-1">
          <div>JK LODU • THE ULTIMATE MULTIPLAYER LUDO EXPERIENCE</div>
          <div>Server-Authoritative Anti-Cheat Engine • Firebase Cloud Architecture</div>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastText && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-xl shadow-xl flex items-center gap-1.5 z-50 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{toastText}</span>
        </div>
      )}
    </div>
  );
};
