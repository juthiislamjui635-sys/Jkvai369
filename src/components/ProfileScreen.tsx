import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Camera, 
  Copy, 
  Check, 
  Trophy, 
  Flame, 
  ShieldCheck, 
  Star, 
  Coins, 
  Gem, 
  Award,
  Swords,
  Percent,
  CheckCircle2,
  LogOut
} from 'lucide-react';

interface ProfileScreenProps {
  onBack: () => void;
  avatarUrl: string;
  onUpdateAvatar: (url: string) => void;
  onLogout?: () => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150',
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onBack,
  avatarUrl,
  onUpdateAvatar,
  onLogout,
}) => {
  const [copied, setCopied] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [customPhotoInput, setCustomPhotoInput] = useState('');

  const playerId = 'JK-4821';
  const playerName = 'Alex Rivers';
  const playerEmail = 'alex.rivers@gmail.com';
  const level = 5;
  const currentXp = 640;
  const nextLevelXp = 1000;
  const wins = 28;
  const losses = 9;
  const gamesPlayed = wins + losses;
  const winRate = ((wins / gamesPlayed) * 100).toFixed(1);
  const coins = 8400;
  const diamonds = 120;

  const handleCopyId = () => {
    navigator.clipboard?.writeText(playerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyCustomPhoto = () => {
    if (customPhotoInput.trim()) {
      onUpdateAvatar(customPhotoInput.trim());
      setShowAvatarModal(false);
      setCustomPhotoInput('');
    }
  };

  const achievements = [
    { id: '1', title: 'First Blood', desc: 'Win your very first Ludo match', unlocked: true, icon: Trophy },
    { id: '2', title: 'Deca Champion', desc: 'Achieve 10 total victories', unlocked: true, icon: Flame },
    { id: '3', title: 'Capture Master', desc: 'Capture 25 opponent pawns', unlocked: true, icon: Swords },
    { id: '4', title: 'Safe Haven', desc: 'Land on safe star cells 50 times', unlocked: true, icon: ShieldCheck },
    { id: '5', title: 'Grand Master', desc: 'Reach Level 10 and 100 wins', unlocked: false, icon: Award },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-y-auto select-none">
      {/* Top App Bar */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800/80 sticky top-0 bg-slate-950/90 backdrop-blur-md z-20">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-base text-amber-400">Player Profile</span>
        <div className="w-9" />
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-500/30 shadow-xl flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Avatar with edit badge */}
          <div className="relative mb-3">
            <div className="w-22 h-22 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-600 shadow-xl">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover border-2 border-slate-950"
              />
            </div>
            <button
              onClick={() => setShowAvatarModal(true)}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-amber-500 text-slate-950 shadow-lg hover:bg-amber-400 active:scale-90"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-xl font-black text-white">{playerName}</h2>
          <p className="text-xs text-slate-400 mb-2">{playerEmail}</p>

          {/* Player ID Pill */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 mb-4">
            <span className="text-xs font-mono font-bold text-amber-400">ID: {playerId}</span>
            <button
              onClick={handleCopyId}
              className="p-0.5 text-slate-400 hover:text-amber-300"
              title="Copy Player ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Level & XP Progress */}
          <div className="w-full max-w-xs space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-amber-400">Level {level}</span>
              <span className="text-slate-400">{currentXp} / {nextLevelXp} XP</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 transition-all"
                style={{ width: `${(currentXp / nextLevelXp) * 100}%` }}
              />
            </div>
          </div>

          {/* Currencies */}
          <div className="grid grid-cols-2 gap-3 w-full mt-4">
            <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-sm text-amber-300">{coins.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <Gem className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-sm text-cyan-300">{diamonds}</span>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Career Statistics</h3>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-black text-white">{wins}</div>
                <div className="text-[11px] text-slate-400">Victories</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-black text-white">{losses}</div>
                <div className="text-[11px] text-slate-400">Defeats</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Swords className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-black text-white">{gamesPlayed}</div>
                <div className="text-[11px] text-slate-400">Total Matches</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-black text-white">{winRate}%</div>
                <div className="text-[11px] text-slate-400">Win Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-2 pb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Badges & Achievements</h3>
          <div className="space-y-2">
            {achievements.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border flex items-center gap-3 ${
                    item.unlocked
                      ? 'bg-slate-900/90 border-amber-500/30 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-500 opacity-60'
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-xl ${
                      item.unlocked
                        ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold flex items-center gap-2">
                      {item.title}
                      {item.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <div className="text-xs text-slate-400">{item.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Account Controls */}
        {onLogout && (
          <div className="pt-2 pb-4">
            <button
              onClick={onLogout}
              className="w-full py-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-500/20 active:scale-98 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of Account</span>
            </button>
          </div>
        )}
      </div>

      {/* Avatar Switcher Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
            <h3 className="text-base font-bold text-white text-center">Change Profile Photo</h3>

            {/* Presets Grid */}
            <div>
              <p className="text-xs text-slate-400 mb-2">Select from avatar presets:</p>
              <div className="grid grid-cols-3 gap-3">
                {AVATAR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onUpdateAvatar(preset);
                      setShowAvatarModal(false);
                    }}
                    className={`p-1 rounded-2xl border-2 transition-all ${
                      avatarUrl === preset ? 'border-amber-400 scale-105 shadow-md' : 'border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <img src={preset} alt="Preset" className="w-16 h-16 rounded-xl object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom URL Input */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <p className="text-xs text-slate-400">Or paste custom image URL:</p>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://..."
                  value={customPhotoInput}
                  onChange={(e) => setCustomPhotoInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={handleApplyCustomPhoto}
                  className="px-3 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 active:scale-95"
                >
                  Save
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowAvatarModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 active:scale-95"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
