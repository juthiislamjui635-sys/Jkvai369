import React, { useState } from 'react';
import { 
  Gift, 
  Target, 
  Coins, 
  Gem, 
  Check, 
  Sparkles, 
  X, 
  Clock, 
  Flame, 
  Trophy,
  ArrowRight,
  Crown
} from 'lucide-react';

interface DailyRewardsMissionsModalProps {
  onClose: () => void;
  onClaimReward: (type: 'coins' | 'gems' | 'xp', amount: number) => void;
  coins: number;
}

interface StreakDay {
  day: number;
  rewardType: 'coins' | 'gems' | 'skin';
  rewardAmount: number | string;
  claimed: boolean;
  isToday: boolean;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  rewardXp: number;
  progress: number;
  target: number;
  completed: boolean;
  claimed: boolean;
}

export const DailyRewardsMissionsModal: React.FC<DailyRewardsMissionsModalProps> = ({
  onClose,
  onClaimReward,
  coins,
}) => {
  const [activeTab, setActiveTab] = useState<'rewards' | 'missions'>('rewards');
  const [claimFeedback, setClaimFeedback] = useState<string | null>(null);

  const [streakDays, setStreakDays] = useState<StreakDay[]>([
    { day: 1, rewardType: 'coins', rewardAmount: 500, claimed: true, isToday: false },
    { day: 2, rewardType: 'coins', rewardAmount: 1000, claimed: true, isToday: false },
    { day: 3, rewardType: 'gems', rewardAmount: 25, claimed: true, isToday: false },
    { day: 4, rewardType: 'coins', rewardAmount: 2500, claimed: false, isToday: true },
    { day: 5, rewardType: 'gems', rewardAmount: 50, claimed: false, isToday: false },
    { day: 6, rewardType: 'coins', rewardAmount: 5000, claimed: false, isToday: false },
    { day: 7, rewardType: 'skin', rewardAmount: 'Royal Crown', claimed: false, isToday: false },
  ]);

  const [missions, setMissions] = useState<Mission[]>([
    {
      id: 'm1',
      title: 'Dice Master',
      description: 'Roll a 6 during any match',
      rewardCoins: 400,
      rewardXp: 150,
      progress: 3,
      target: 3,
      completed: true,
      claimed: false,
    },
    {
      id: 'm2',
      title: 'Pawn Hunter',
      description: 'Capture 2 enemy pawns in online/AI match',
      rewardCoins: 750,
      rewardXp: 300,
      progress: 1,
      target: 2,
      completed: false,
      claimed: false,
    },
    {
      id: 'm3',
      title: 'Ludo Victor',
      description: 'Win 1 Quick Match or Room match',
      rewardCoins: 1200,
      rewardXp: 500,
      progress: 0,
      target: 1,
      completed: false,
      claimed: false,
    },
    {
      id: 'm4',
      title: 'Social Champion',
      description: 'Play a match with a friend',
      rewardCoins: 600,
      rewardXp: 200,
      progress: 1,
      target: 1,
      completed: true,
      claimed: false,
    },
  ]);

  const handleClaimDayReward = (day: StreakDay) => {
    if (!day.isToday || day.claimed) return;

    setStreakDays(prev =>
      prev.map(d => (d.day === day.day ? { ...d, claimed: true } : d))
    );

    if (day.rewardType === 'coins') {
      onClaimReward('coins', Number(day.rewardAmount));
      setClaimFeedback(`Claimed +${day.rewardAmount} Gold Coins!`);
    } else if (day.rewardType === 'gems') {
      onClaimReward('gems', Number(day.rewardAmount));
      setClaimFeedback(`Claimed +${day.rewardAmount} Gems!`);
    } else {
      setClaimFeedback(`Unlocked ${day.rewardAmount} skin!`);
    }

    setTimeout(() => setClaimFeedback(null), 3000);
  };

  const handleClaimMission = (missionId: string) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission || !mission.completed || mission.claimed) return;

    setMissions(prev =>
      prev.map(m => (m.id === missionId ? { ...m, claimed: true } : m))
    );

    onClaimReward('coins', mission.rewardCoins);
    onClaimReward('xp', mission.rewardXp);
    setClaimFeedback(`Claimed +${mission.rewardCoins} Coins & +${mission.rewardXp} XP!`);
    setTimeout(() => setClaimFeedback(null), 3000);
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col max-h-[92%] overflow-hidden relative">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-wider text-amber-400">
                REWARDS & MISSIONS
              </h3>
              <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                <Flame className="w-3 h-3 text-rose-500 fill-rose-500" />
                <span>4-Day Active Streak</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 p-1 m-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('rewards')}
            className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'rewards'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Daily Streak</span>
          </button>

          <button
            onClick={() => setActiveTab('missions')}
            className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 relative ${
              activeTab === 'missions'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Daily Missions</span>
            {missions.some(m => m.completed && !m.claimed) && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1 right-3 animate-ping"></span>
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-3.5 pb-4 space-y-3">
          {/* TAB 1: 7-DAY STREAK */}
          {activeTab === 'rewards' && (
            <div className="space-y-3">
              <div className="text-[11px] text-slate-300 font-medium px-1 flex items-center justify-between">
                <span>Check in daily to claim 24K gold & skins</span>
                <span className="text-amber-400 font-mono text-[10px]">Resets in 11h 22m</span>
              </div>

              {/* 7-Day Grid */}
              <div className="grid grid-cols-4 gap-2">
                {streakDays.slice(0, 4).map(day => (
                  <div
                    key={day.day}
                    onClick={() => handleClaimDayReward(day)}
                    className={`p-2.5 rounded-2xl border flex flex-col items-center justify-between transition-all cursor-pointer relative ${
                      day.isToday && !day.claimed
                        ? 'bg-gradient-to-b from-amber-500/20 to-amber-600/10 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)] scale-105'
                        : day.claimed
                          ? 'bg-slate-950/70 border-slate-800/80 opacity-60'
                          : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <span className="text-[9px] font-bold text-slate-400">Day {day.day}</span>
                    <div className="my-1 text-amber-400">
                      {day.rewardType === 'coins' && <Coins className="w-5 h-5" />}
                      {day.rewardType === 'gems' && <Gem className="w-5 h-5 text-indigo-400" />}
                      {day.rewardType === 'skin' && <Crown className="w-5 h-5 text-amber-400" />}
                    </div>
                    <span className="text-[10px] font-black text-slate-100">
                      {day.rewardAmount}
                    </span>

                    {day.claimed ? (
                      <div className="absolute inset-0 bg-slate-950/70 rounded-2xl flex items-center justify-center">
                        <Check className="w-5 h-5 text-emerald-400" />
                      </div>
                    ) : day.isToday ? (
                      <span className="text-[8px] font-black uppercase text-slate-950 bg-amber-400 px-1 rounded mt-1 animate-pulse">
                        Claim
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {streakDays.slice(4, 7).map(day => (
                  <div
                    key={day.day}
                    onClick={() => handleClaimDayReward(day)}
                    className={`p-2.5 rounded-2xl border flex flex-col items-center justify-between transition-all relative ${
                      day.day === 7
                        ? 'bg-gradient-to-b from-indigo-900/30 to-purple-950/40 border-amber-400/50'
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <span className="text-[9px] font-bold text-slate-400">Day {day.day}</span>
                    <div className="my-1">
                      {day.day === 7 ? (
                        <Crown className="w-6 h-6 text-amber-400 animate-bounce" />
                      ) : day.rewardType === 'gems' ? (
                        <Gem className="w-5 h-5 text-indigo-400" />
                      ) : (
                        <Coins className="w-5 h-5 text-amber-400" />
                      )}
                    </div>
                    <span className="text-[10px] font-black text-center text-slate-100">
                      {day.rewardAmount}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button for Today */}
              {streakDays.find(d => d.isToday && !d.claimed) ? (
                <button
                  onClick={() => {
                    const today = streakDays.find(d => d.isToday);
                    if (today) handleClaimDayReward(today);
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-xs tracking-wider uppercase shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>CLAIM DAY 4 BONUS (+2,500 COINS)</span>
                </button>
              ) : (
                <div className="text-center py-2 text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Today's reward already collected! Come back tomorrow.</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MISSIONS */}
          {activeTab === 'missions' && (
            <div className="space-y-2.5">
              {missions.map(mission => (
                <div
                  key={mission.id}
                  className="p-3 rounded-2xl bg-slate-950 border border-slate-800/90 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-100">{mission.title}</h4>
                      <p className="text-[10px] text-slate-400">{mission.description}</p>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400">
                      <Coins className="w-3 h-3" />
                      <span>+{mission.rewardCoins}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full">
                    <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>
                        {mission.progress}/{mission.target}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                        style={{
                          width: `${Math.min(100, (mission.progress / mission.target) * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Claim Button */}
                  <div className="flex justify-end">
                    {mission.claimed ? (
                      <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                        <Check className="w-3 h-3 text-slate-500" />
                        <span>Claimed</span>
                      </span>
                    ) : mission.completed ? (
                      <button
                        onClick={() => handleClaimMission(mission.id)}
                        className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-black uppercase shadow-sm transition-all animate-bounce"
                      >
                        Claim Reward
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-semibold">In Progress</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Claim Feedback Banner */}
        {claimFeedback && (
          <div className="p-2.5 bg-emerald-500 text-slate-950 font-black text-xs text-center flex items-center justify-center gap-2 animate-in slide-in-from-bottom-2">
            <Sparkles className="w-4 h-4" />
            <span>{claimFeedback}</span>
          </div>
        )}
      </div>
    </div>
  );
};
