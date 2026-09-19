import React, { useState } from 'react';
import { 
  Play, 
  Users, 
  Key, 
  Bot, 
  Sparkles, 
  Trophy, 
  Palette, 
  Settings, 
  Coins, 
  Gem, 
  Gift, 
  Bell, 
  Crown, 
  ChevronRight, 
  CheckCircle2, 
  Swords, 
  Flame, 
  Gamepad2, 
  UserPlus, 
  Copy, 
  Check, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  X,
  Target,
  Clock,
  Zap
} from 'lucide-react';
import { PawnSkinType } from './Pawn3D';
import { DiceSkinType } from './Dice3D';
import { BoardThemeType } from './LudoBoard3D';

interface PremiumHomeLobbyProps {
  authStatus: 'guest' | 'google';
  avatarUrl: string;
  coins: number;
  gems: number;
  isDark: boolean;
  soundEnabled: boolean;
  onNavigate: (route: any) => void;
  onOpenQuickPlay: () => void;
  onOpenGameModeModal: () => void;
  onOpenDailyRewards: () => void;
  onClaimReward: (type: 'coins' | 'gems' | 'xp', amount: number) => void;
  showToast: (msg: string) => void;
  activePawnSkin: PawnSkinType;
  activeDiceSkin: DiceSkinType;
  activeBoardTheme: BoardThemeType;
}

export const PremiumHomeLobby: React.FC<PremiumHomeLobbyProps> = ({
  authStatus,
  avatarUrl,
  coins,
  gems,
  isDark,
  soundEnabled,
  onNavigate,
  onOpenQuickPlay,
  onOpenGameModeModal,
  onOpenDailyRewards,
  onClaimReward,
  showToast,
  activePawnSkin,
  activeDiceSkin,
  activeBoardTheme,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [filterOnlineFriends, setFilterOnlineFriends] = useState(true);

  const playerName = authStatus === 'google' ? 'Alex Rivers' : 'Guest Player';
  const playerId = 'JK-4821';
  const currentXp = 1450;
  const targetXp = 2000;
  const xpPercent = Math.round((currentXp / targetXp) * 100);

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(playerId);
    setCopiedId(true);
    showToast(`Player ID ${playerId} copied to clipboard!`);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleClaimDailyFast = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (dailyClaimed) {
      onOpenDailyRewards();
      return;
    }
    setDailyClaimed(true);
    onClaimReward('coins', 2500);
    onClaimReward('gems', 10);
    showToast('Claimed Day 4 Bonus: +2,500 Coins & +10 Gems!');
  };

  // Online friends mock (with real invitation interaction)
  const onlineFriends = [
    {
      id: 'f1',
      name: 'Sarah Connor',
      level: 8,
      status: 'In Lobby',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    {
      id: 'f2',
      name: 'David Kim',
      level: 12,
      status: 'Ready to play',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    },
    {
      id: 'f3',
      name: 'Marcus Vance',
      level: 4,
      status: 'In Game',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    },
  ];

  // Recent match data
  const recentMatches = [
    {
      id: 'm1',
      opponent: 'Marcus Vance',
      result: 'WIN',
      mode: '4P Classic',
      xp: '+180 XP',
      time: '15m ago',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80',
    },
    {
      id: 'm2',
      opponent: 'Elena Rostova',
      result: '2ND',
      mode: 'Quick Mode',
      xp: '+95 XP',
      time: '2h ago',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80',
    },
    {
      id: 'm3',
      opponent: 'CyberBot Pro',
      result: 'WIN',
      mode: 'AI Hard',
      xp: '+120 XP',
      time: 'Yesterday',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80',
    },
  ];

  // Top leaderboard preview
  const topPlayers = [
    { rank: 1, name: 'KingAamir', level: 28, xp: '18,400 XP', badge: '🥇', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80' },
    { rank: 2, name: 'QueenLudo', level: 24, xp: '15,200 XP', badge: '🥈', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80' },
    { rank: 3, name: 'DiceMaster99', level: 22, xp: '13,850 XP', badge: '🥉', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden relative select-none scrollbar-thin scrollbar-thumb-amber-500/20">
      {/* Ambient background particles & radial glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl"></div>
        <div className="absolute top-48 -right-16 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl"></div>
        <div className="absolute bottom-10 left-1/3 w-60 h-60 rounded-full bg-indigo-500/10 blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col gap-3 p-3.5 pb-20">
        {/* ======================================================== */}
        {/* 1. TOP PLAYER HEADER — ADVANCED                          */}
        {/* ======================================================== */}
        <div 
          id="premium-player-header"
          className="p-3 rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#0B132B]/95 to-slate-900/90 border border-amber-500/30 shadow-xl shadow-slate-950/50 backdrop-blur-md transition-all"
        >
          <div className="flex items-center justify-between gap-2">
            {/* Left: Avatar + Ring + Details */}
            <div 
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2.5 cursor-pointer group"
              title="Click to view & edit profile"
            >
              {/* Profile Avatar with breathing gold ring */}
              <div className="relative">
                <div className="w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 shadow-md shadow-amber-500/30 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-950 border border-slate-900">
                    <img 
                      src={avatarUrl} 
                      alt="Player Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                {/* Level badge */}
                <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[8px] tracking-tight border border-amber-300 shadow-sm flex items-center gap-0.5">
                  <Crown className="w-2 h-2 fill-current" />
                  <span>5</span>
                </div>
              </div>

              {/* Name & Player ID */}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white tracking-wide group-hover:text-amber-300 transition-colors">
                    {playerName}
                  </span>
                  <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 tracking-wider">
                    PRO
                  </span>
                </div>

                <div 
                  onClick={handleCopyId}
                  className="flex items-center gap-1 mt-0.5 text-[9px] font-mono font-medium text-slate-400 hover:text-amber-400 transition-colors"
                  title="Click to copy UID"
                >
                  <span>{playerId}</span>
                  {copiedId ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5 opacity-60" />}
                </div>
              </div>
            </div>

            {/* Right: Currency HUD & Action Buttons */}
            <div className="flex items-center gap-1.5">
              {/* Coins HUD */}
              <div 
                onClick={onOpenDailyRewards}
                className="px-2 py-1 rounded-xl bg-slate-950/80 border border-amber-500/40 text-amber-300 flex items-center gap-1 cursor-pointer hover:border-amber-400 hover:scale-105 transition-all shadow-inner"
                title="Tap to view Daily Bonus"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-amber-400/20 flex items-center justify-center">
                  <Coins className="w-2.5 h-2.5 text-amber-400 fill-amber-400/50" />
                </div>
                <span className="text-[10px] font-black tracking-tight">{coins.toLocaleString()}</span>
              </div>

              {/* Gems HUD */}
              <div 
                onClick={onOpenDailyRewards}
                className="px-2 py-1 rounded-xl bg-slate-950/80 border border-indigo-500/40 text-indigo-300 flex items-center gap-1 cursor-pointer hover:border-indigo-400 hover:scale-105 transition-all shadow-inner"
                title="Tap to view Gems"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-indigo-400/20 flex items-center justify-center">
                  <Gem className="w-2.5 h-2.5 text-indigo-400 fill-indigo-400/50" />
                </div>
                <span className="text-[10px] font-black tracking-tight">{gems}</span>
              </div>

              {/* Notification Button */}
              <button 
                id="btn-notifications"
                onClick={() => setShowNotifications(true)}
                className="relative p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 transition-all hover:scale-105"
                title="Notifications"
              >
                <Bell className="w-3.5 h-3.5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse border border-slate-900"></span>
              </button>

              {/* Settings Button */}
              <button 
                id="btn-settings-header"
                onClick={() => onNavigate('settings')}
                className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 transition-all hover:scale-105"
                title="Game Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* XP Progress Bar below */}
          <div className="mt-2 pt-2 border-t border-slate-800/70 flex items-center gap-2">
            <div className="flex-1">
              <div className="flex items-center justify-between text-[8px] font-black text-slate-400 mb-0.5">
                <span className="text-amber-300 flex items-center gap-1">
                  <TrendingUp className="w-2.5 h-2.5" /> LEVEL PROGRESS
                </span>
                <span>{currentXp} / {targetXp} XP ({xpPercent}%)</span>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden p-[1px] border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${xpPercent}%` }}
                ></div>
              </div>
            </div>
            <span className="text-[9px] font-black text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 shrink-0">
              Lv. 6
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. COMPACT PREMIUM DAILY REWARD PANEL                    */}
        {/* ======================================================== */}
        <div 
          onClick={onOpenDailyRewards}
          className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-indigo-600/15 border border-amber-500/40 shadow-lg shadow-amber-950/20 flex items-center justify-between cursor-pointer hover:border-amber-400 transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-[1.5px] shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Gift className="w-5 h-5 text-amber-400 animate-bounce" />
              </div>
            </div>
            <div>
              <div className="text-[11px] font-black text-amber-300 flex items-center gap-1.5">
                <span>DAILY REWARD</span>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-400 text-[8px] font-extrabold border border-amber-400/40">
                  DAY 4 STREAK
                </span>
              </div>
              <div className="text-[9px] text-slate-300 font-semibold flex items-center gap-1">
                <span>+2,500 Gold Coins & 10 Gems ready!</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleClaimDailyFast}
            className={`px-3 py-1.5 rounded-xl font-black text-[10px] tracking-wider uppercase transition-all shadow-md active:scale-95 flex items-center gap-1 ${
              dailyClaimed 
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40' 
                : 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-amber-500/30 hover:scale-105'
            }`}
          >
            {dailyClaimed ? (
              <>
                <Check className="w-3 h-3" />
                <span>CLAIMED</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 fill-slate-950" />
                <span>CLAIM</span>
              </>
            )}
          </button>
        </div>

        {/* ======================================================== */}
        {/* 3. HERO QUICK PLAY SECTION (THE VISUAL CENTERPIECE)       */}
        {/* ======================================================== */}
        <div 
          id="hero-quick-play-card"
          className="relative rounded-3xl overflow-hidden p-4 bg-gradient-to-b from-[#0F1E3D] via-[#0B152B] to-[#070D1E] border border-amber-500/50 shadow-2xl shadow-amber-950/40"
        >
          {/* Subtle board grid lines background decoration */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          {/* Golden corner flourishes */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-400 rounded-tl-sm pointer-events-none"></div>
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-400 rounded-tr-sm pointer-events-none"></div>
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-400 rounded-bl-sm pointer-events-none"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-400 rounded-br-sm pointer-events-none"></div>

          {/* Top Hero Badges */}
          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[9px] font-black tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>1,420 ONLINE NOW</span>
            </div>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-amber-400/90 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              FAST RULES • 4P TABLE
            </span>
          </div>

          {/* Centerpiece Visual: 3D Pawns, 3D Dice & Lighting */}
          <div className="relative py-2 flex items-center justify-center my-1">
            {/* Center ambient glow */}
            <div className="absolute w-36 h-36 rounded-full bg-amber-500/15 blur-2xl"></div>

            {/* 4 3D Pawns encircling the dice */}
            <div className="relative w-48 h-24 flex items-center justify-center">
              {/* Red Pawn (Left) */}
              <div className="absolute left-2 -top-1 flex flex-col items-center animate-pulse duration-1000">
                <div className="w-7 h-7 rounded-full bg-radial from-rose-400 via-rose-600 to-rose-950 border border-rose-300 shadow-lg shadow-rose-600/50 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/40 blur-[1px]"></div>
                </div>
                <div className="w-5 h-1.5 rounded-full bg-black/40 blur-[1px] mt-0.5"></div>
              </div>

              {/* Green Pawn (Top-Right) */}
              <div className="absolute right-4 -top-2 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-radial from-emerald-400 via-emerald-600 to-emerald-950 border border-emerald-300 shadow-lg shadow-emerald-600/50 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/40 blur-[1px]"></div>
                </div>
                <div className="w-5 h-1.5 rounded-full bg-black/40 blur-[1px] mt-0.5"></div>
              </div>

              {/* Blue Pawn (Bottom-Left) */}
              <div className="absolute left-6 bottom-0 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-radial from-blue-400 via-blue-600 to-blue-950 border border-blue-300 shadow-lg shadow-blue-600/50 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/40 blur-[1px]"></div>
                </div>
                <div className="w-5 h-1.5 rounded-full bg-black/40 blur-[1px] mt-0.5"></div>
              </div>

              {/* Yellow Gold Pawn (Bottom-Right) */}
              <div className="absolute right-3 bottom-0 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-radial from-amber-300 via-amber-500 to-amber-950 border border-amber-200 shadow-lg shadow-amber-500/50 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/40 blur-[1px]"></div>
                </div>
                <div className="w-5 h-1.5 rounded-full bg-black/40 blur-[1px] mt-0.5"></div>
              </div>

              {/* High-End 3D Ludo Dice in the center */}
              <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-100 via-white to-slate-200 border-2 border-amber-300 shadow-xl shadow-amber-500/40 flex items-center justify-center transform hover:rotate-6 transition-transform cursor-pointer">
                {/* 6 pips arrangement in golden red */}
                <div className="grid grid-cols-2 gap-1.5 p-1">
                  <div className="w-2 h-2 rounded-full bg-rose-600 shadow-inner"></div>
                  <div className="w-2 h-2 rounded-full bg-rose-600 shadow-inner"></div>
                  <div className="w-2 h-2 rounded-full bg-rose-600 shadow-inner"></div>
                  <div className="w-2 h-2 rounded-full bg-rose-600 shadow-inner"></div>
                </div>
                {/* Dice reflection shine */}
                <div className="absolute top-1 left-1.5 w-4 h-2 bg-white/70 rounded-full blur-[1px]"></div>
              </div>
            </div>
          </div>

          {/* Hero Titles */}
          <div className="text-center my-1 relative z-10">
            <h2 className="text-xl font-black tracking-wider text-white drop-shadow-md">
              READY TO PLAY?
            </h2>
            <p className="text-[11px] font-semibold text-slate-300">
              Classic Ludo with Fast Turns & Star Safety
            </p>
          </div>

          {/* Large Primary Action Button: "PLAY NOW" */}
          <button
            id="btn-hero-play-now"
            onClick={onOpenQuickPlay}
            className="w-full mt-3 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-black text-sm tracking-wider uppercase shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all group overflow-hidden relative"
          >
            {/* Shimmer sweep animation */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
            
            <Play className="w-5 h-5 fill-slate-950" />
            <span>PLAY NOW</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* ======================================================== */}
        {/* 4. DEDICATED MULTIPLAYER SECTION: CREATE & JOIN ROOM     */}
        {/* ======================================================== */}
        <div>
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Users className="w-3 h-3 text-amber-400" />
              <span>PLAY WITH YOUR FRIENDS</span>
            </div>
            <span className="text-[9px] font-bold text-slate-400">Private 6-Digit Rooms</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* CREATE ROOM CARD */}
            <div
              id="card-create-room"
              onClick={() => onNavigate('create-room')}
              className="p-3 rounded-2xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 text-white border border-blue-500/40 shadow-lg shadow-blue-950/40 cursor-pointer hover:border-blue-400 hover:scale-[1.02] active:scale-95 transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4 text-blue-300" />
              </div>
              <div className="text-xs font-black tracking-wide">CREATE ROOM</div>
              <div className="text-[9px] text-blue-200 mt-0.5">Host private table</div>
              <div className="mt-2 text-[8px] font-bold text-blue-300 bg-blue-950/60 px-1.5 py-0.5 rounded-md inline-block border border-blue-500/30">
                Instant Code
              </div>
            </div>

            {/* JOIN ROOM CARD */}
            <div
              id="card-join-room"
              onClick={() => onNavigate('join-room')}
              className="p-3 rounded-2xl bg-gradient-to-br from-emerald-700 via-teal-800 to-slate-950 text-white border border-emerald-500/40 shadow-lg shadow-emerald-950/40 cursor-pointer hover:border-emerald-400 hover:scale-[1.02] active:scale-95 transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <Key className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="text-xs font-black tracking-wide">JOIN ROOM</div>
              <div className="text-[9px] text-emerald-200 mt-0.5">Enter 6-digit code</div>
              <div className="mt-2 text-[8px] font-bold text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded-md inline-block border border-emerald-500/30">
                Quick Enter
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 5. PLAY VS AI + ALL GAME MODES                           */}
        {/* ======================================================== */}
        <div className="grid grid-cols-2 gap-2">
          {/* PLAY VS AI */}
          <div
            id="card-play-ai"
            onClick={() => onOpenGameModeModal()}
            className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
          >
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-black text-white">PLAY VS AI</div>
              <div className="text-[8px] text-slate-400">Offline • Easy/Med/Hard</div>
            </div>
          </div>

          {/* ALL GAME MODES */}
          <div
            id="card-all-modes"
            onClick={() => onOpenGameModeModal()}
            className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-black text-white">ALL MODES</div>
              <div className="text-[8px] text-slate-400">Pass & Play, 2P/4P</div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 6. ONLINE FRIENDS ("ONLINE NOW")                         */}
        {/* ======================================================== */}
        <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">
                ONLINE NOW ({onlineFriends.length})
              </span>
            </div>
            <button
              onClick={() => onNavigate('friends')}
              className="text-[9px] font-bold text-amber-400 hover:underline flex items-center gap-0.5"
            >
              <span>VIEW ALL</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Horizontally scrollable friends list */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {onlineFriends.map((f) => (
              <div 
                key={f.id}
                className="min-w-[130px] p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center text-center shrink-0"
              >
                <div className="relative mb-1">
                  <img 
                    src={f.avatar} 
                    alt={f.name} 
                    className="w-9 h-9 rounded-full object-cover border border-amber-400/40"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-900"></span>
                </div>
                <div className="text-[10px] font-bold text-white truncate max-w-[110px]">{f.name}</div>
                <div className="text-[8px] text-amber-400 font-semibold">Lv. {f.level}</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showToast(`Invited ${f.name} to game!`);
                    onOpenQuickPlay();
                  }}
                  className="mt-1.5 w-full py-1 px-2 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-[9px] font-black transition-all active:scale-95"
                >
                  INVITE
                </button>
              </div>
            ))}

            {/* Add Friend Card */}
            <div 
              onClick={() => onNavigate('friends')}
              className="min-w-[90px] h-[100px] rounded-xl border border-dashed border-slate-700 hover:border-amber-500/50 flex flex-col items-center justify-center gap-1 cursor-pointer text-slate-400 hover:text-amber-400 transition-all shrink-0 p-2 text-center"
            >
              <UserPlus className="w-4 h-4" />
              <span className="text-[8px] font-bold">ADD FRIEND</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 7. DAILY / WEEKLY MISSIONS PREVIEW                       */}
        {/* ======================================================== */}
        <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-300">
              <Target className="w-3 h-3 text-amber-400" />
              <span>ACTIVE MISSIONS</span>
            </div>
            <button 
              onClick={onOpenDailyRewards}
              className="text-[9px] font-bold text-amber-400 hover:underline flex items-center gap-0.5"
            >
              <span>VIEW ALL</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {/* Mission 1 */}
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-200">Play 1 Match</div>
                <div className="text-[8px] text-amber-400 font-semibold">+500 Coins</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full w-0"></div>
                </div>
                <span className="text-[8px] font-mono text-slate-400">0/1</span>
              </div>
            </div>

            {/* Mission 2 */}
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-200">Capture 5 Pawns</div>
                <div className="text-[8px] text-amber-400 font-semibold">+800 Coins</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full w-2/5"></div>
                </div>
                <span className="text-[8px] font-mono text-slate-400">2/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 8. RECENT MATCHES PREVIEW                                */}
        {/* ======================================================== */}
        <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-300">
              <Clock className="w-3 h-3 text-blue-400" />
              <span>RECENT MATCHES</span>
            </div>
            <span className="text-[9px] font-bold text-slate-400">Past 24 Hours</span>
          </div>

          <div className="space-y-1.5">
            {recentMatches.map((m) => (
              <div 
                key={m.id}
                className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <img src={m.avatar} alt={m.opponent} className="w-7 h-7 rounded-full object-cover" />
                  <div>
                    <div className="text-[10px] font-bold text-white flex items-center gap-1.5">
                      <span>vs {m.opponent}</span>
                      <span className={`text-[8px] font-black px-1.5 py-0.2 rounded ${
                        m.result === 'WIN' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {m.result}
                      </span>
                    </div>
                    <div className="text-[8px] text-slate-400 font-medium">{m.mode} • {m.time}</div>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-amber-300">{m.xp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 9. LEADERBOARD PREVIEW                                   */}
        {/* ======================================================== */}
        <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-300">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>LEADERBOARD PREVIEW</span>
            </div>
            <button 
              onClick={() => onNavigate('leaderboard')}
              className="text-[9px] font-bold text-amber-400 hover:underline flex items-center gap-0.5"
            >
              <span>VIEW ALL</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-1.5">
            {topPlayers.map((p) => (
              <div 
                key={p.rank}
                className="p-1.5 px-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs">{p.badge}</span>
                  <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded-full object-cover" />
                  <div>
                    <span className="text-[10px] font-bold text-white">{p.name}</span>
                    <span className="text-[8px] text-slate-400 ml-1.5">Lv. {p.level}</span>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-bold text-amber-300">{p.xp}</span>
              </div>
            ))}

            {/* Current user's position highlighted */}
            <div className="p-1.5 px-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-amber-400">#128</span>
                <span className="text-[10px] font-black text-white">{playerName} (You)</span>
              </div>
              <span className="text-[9px] font-mono font-bold text-amber-300">1,450 XP</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 10. COLLECTION PREVIEW                                   */}
        {/* ======================================================== */}
        <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-300">
              <Palette className="w-3 h-3 text-purple-400" />
              <span>COLLECTION VAULT</span>
            </div>
            <button 
              onClick={() => onNavigate('collections')}
              className="text-[9px] font-bold text-amber-400 hover:underline flex items-center gap-0.5"
            >
              <span>VIEW VAULT</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div 
              onClick={() => onNavigate('collections')}
              className="p-2 rounded-xl bg-slate-950/70 border border-amber-500/30 flex flex-col items-center text-center cursor-pointer hover:border-amber-400 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-radial from-amber-300 via-amber-500 to-amber-950 border border-amber-200 mb-1 shadow-sm"></div>
              <span className="text-[8px] font-bold text-white">Gold Pawn</span>
              <span className="text-[7px] text-amber-400 font-extrabold uppercase">Equipped</span>
            </div>

            <div 
              onClick={() => onNavigate('collections')}
              className="p-2 rounded-xl bg-slate-950/70 border border-indigo-500/30 flex flex-col items-center text-center cursor-pointer hover:border-indigo-400 transition-colors"
            >
              <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-200 to-indigo-500 border border-indigo-300 mb-1 shadow-sm flex items-center justify-center text-[10px] font-bold text-slate-950">
                💎
              </div>
              <span className="text-[8px] font-bold text-white">Diamond Dice</span>
              <span className="text-[7px] text-indigo-400 font-extrabold uppercase">Equipped</span>
            </div>

            <div 
              onClick={() => onNavigate('collections')}
              className="p-2 rounded-xl bg-slate-950/70 border border-purple-500/30 flex flex-col items-center text-center cursor-pointer hover:border-purple-400 transition-colors"
            >
              <div className="w-6 h-6 rounded-md bg-slate-900 border border-purple-400/50 mb-1 flex items-center justify-center text-[10px]">
                ⚡
              </div>
              <span className="text-[8px] font-bold text-white">Cyber Board</span>
              <span className="text-[7px] text-purple-400 font-extrabold uppercase">Unlocked</span>
            </div>
          </div>
        </div>

        {/* Footer Brand watermark */}
        <div className="text-center py-2 text-[9px] font-bold text-slate-500">
          JK LODU • THE ULTIMATE MULTIPLAYER LUDO EXPERIENCE
        </div>
      </div>

      {/* ======================================================== */}
      {/* 11. IN-APP NOTIFICATIONS MODAL                            */}
      {/* ======================================================== */}
      {showNotifications && (
        <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end justify-center p-3 animate-in fade-in duration-200">
          <div className="w-full rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-black text-white">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>NOTIFICATIONS</span>
              </div>
              <button 
                onClick={() => setShowNotifications(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 py-3">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/30 flex items-start gap-2.5">
                <Gift className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-[11px] font-bold text-white">Daily Streak Bonus Ready!</div>
                  <div className="text-[9px] text-slate-400">Day 4 login gift: 2,500 coins and 10 gems waiting to be claimed.</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-blue-500/30 flex items-start gap-2.5">
                <Users className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-[11px] font-bold text-white">David Kim is online</div>
                  <div className="text-[9px] text-slate-400">Send an instant table invitation for a 4-player match!</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                <Trophy className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-[11px] font-bold text-white">Weekly Season 4 Tournament</div>
                  <div className="text-[9px] text-slate-400">Ranks reset in 2 days. Top 10 players win 50,000 coins!</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowNotifications(false)}
              className="w-full py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 12. PREMIUM BOTTOM NAVIGATION                             */}
      {/* ======================================================== */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 px-4 py-2 flex items-center justify-around shadow-2xl">
        {/* HOME (Active) */}
        <button 
          onClick={() => onNavigate('home')}
          className="flex flex-col items-center gap-0.5 text-amber-400 transition-all scale-105"
        >
          <div className="p-1 rounded-xl bg-amber-400/10">
            <Crown className="w-4 h-4 fill-amber-400" />
          </div>
          <span className="text-[8px] font-black tracking-wider uppercase">HOME</span>
          <div className="w-3 h-0.5 rounded-full bg-amber-400"></div>
        </button>

        {/* FRIENDS */}
        <button 
          onClick={() => onNavigate('friends')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-white transition-all relative"
        >
          <div className="p-1">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[8px] font-bold tracking-wider uppercase">FRIENDS</span>
          <span className="absolute -top-0.5 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        </button>

        {/* GAMES */}
        <button 
          onClick={onOpenGameModeModal}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-white transition-all"
        >
          <div className="p-1">
            <Gamepad2 className="w-4 h-4" />
          </div>
          <span className="text-[8px] font-bold tracking-wider uppercase">GAMES</span>
        </button>

        {/* LEADERBOARD */}
        <button 
          onClick={() => onNavigate('leaderboard')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-white transition-all"
        >
          <div className="p-1">
            <Trophy className="w-4 h-4" />
          </div>
          <span className="text-[8px] font-bold tracking-wider uppercase">RANKS</span>
        </button>

        {/* PROFILE */}
        <button 
          onClick={() => onNavigate('profile')}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-white transition-all"
        >
          <div className="p-1">
            <div className="w-4 h-4 rounded-full overflow-hidden border border-slate-600">
              <img src={avatarUrl} alt="Me" className="w-full h-full object-cover" />
            </div>
          </div>
          <span className="text-[8px] font-bold tracking-wider uppercase">PROFILE</span>
        </button>
      </div>
    </div>
  );
};
