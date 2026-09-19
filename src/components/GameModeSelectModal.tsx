import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Users, 
  Bot, 
  Smartphone, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight,
  Flame,
  Zap,
  Globe
} from 'lucide-react';

interface GameModeSelectModalProps {
  onClose: () => void;
  onSelectQuickPlay: (playerCount: 2 | 4) => void;
  onSelectCreateRoom: () => void;
  onSelectJoinRoom: () => void;
  onSelectAiGame: (playerCount: 2 | 4, difficulty: 'easy' | 'medium' | 'hard') => void;
  onSelectLocalPlay: (playerCount: 2 | 3 | 4) => void;
}

export const GameModeSelectModal: React.FC<GameModeSelectModalProps> = ({
  onClose,
  onSelectQuickPlay,
  onSelectCreateRoom,
  onSelectJoinRoom,
  onSelectAiGame,
  onSelectLocalPlay,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'online' | 'friends' | 'ai' | 'local'>('online');
  const [quickPlayers, setQuickPlayers] = useState<2 | 4>(4);
  const [aiPlayers, setAiPlayers] = useState<2 | 4>(4);
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [localPlayers, setLocalPlayers] = useState<2 | 3 | 4>(4);

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col max-h-[92%] overflow-hidden relative">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-[2px]">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-400 font-black text-xs">
                JK
              </div>
            </div>
            <div>
              <h3 className="text-sm font-black text-white tracking-wider">SELECT GAME MODE</h3>
              <p className="text-[10px] text-slate-400 font-medium">Classic & Fast Ludo Battle</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Selector Tabs */}
        <div className="grid grid-cols-4 p-1 m-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-bold">
          <button
            onClick={() => setSelectedCategory('online')}
            className={`py-1.5 rounded-lg flex flex-col items-center gap-0.5 transition-all ${
              selectedCategory === 'online' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Online</span>
          </button>

          <button
            onClick={() => setSelectedCategory('friends')}
            className={`py-1.5 rounded-lg flex flex-col items-center gap-0.5 transition-all ${
              selectedCategory === 'friends' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Friends</span>
          </button>

          <button
            onClick={() => setSelectedCategory('ai')}
            className={`py-1.5 rounded-lg flex flex-col items-center gap-0.5 transition-all ${
              selectedCategory === 'ai' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Vs AI</span>
          </button>

          <button
            onClick={() => setSelectedCategory('local')}
            className={`py-1.5 rounded-lg flex flex-col items-center gap-0.5 transition-all ${
              selectedCategory === 'local' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Pass&Play</span>
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto px-3.5 pb-4 space-y-3">
          {/* ONLINE QUICK PLAY */}
          {selectedCategory === 'online' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-transparent border border-amber-500/30">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                  Global Matchmaking
                </span>
                <h4 className="text-sm font-black text-white mt-0.5">Quick Play Battle</h4>
                <p className="text-[10px] text-slate-300 mt-1">
                  Connect against real players worldwide with server-authoritative dice and anti-cheat validation.
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Player Count
                </span>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  {[2, 4].map(count => (
                    <button
                      key={count}
                      onClick={() => setQuickPlayers(count as 2 | 4)}
                      className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-between transition-all ${
                        quickPlayers === count
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span>{count} Players</span>
                      <Users className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onSelectQuickPlay(quickPlayers)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-xs tracking-wider uppercase shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>START MATCHMAKING ({quickPlayers}P)</span>
              </button>
            </div>
          )}

          {/* PLAY WITH FRIENDS */}
          {selectedCategory === 'friends' && (
            <div className="space-y-2.5">
              <div 
                onClick={onSelectCreateRoom}
                className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-900/40 to-indigo-950/40 border border-blue-500/40 cursor-pointer hover:border-blue-400 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">CREATE PRIVATE ROOM</h4>
                      <p className="text-[10px] text-blue-200">Generate 6-digit code for friends</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-blue-400" />
                </div>
              </div>

              <div 
                onClick={onSelectJoinRoom}
                className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-900/40 to-teal-950/40 border border-emerald-500/40 cursor-pointer hover:border-emerald-400 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">JOIN ROOM WITH CODE</h4>
                      <p className="text-[10px] text-emerald-200">Enter friend's room invitation code</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            </div>
          )}

          {/* PLAY WITH AI */}
          {selectedCategory === 'ai' && (
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  AI Bot Difficulty
                </span>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  {(['easy', 'medium', 'hard'] as const).map(diff => (
                    <button
                      key={diff}
                      onClick={() => setAiDifficulty(diff)}
                      className={`py-2 rounded-xl border text-xs font-bold capitalize transition-all ${
                        aiDifficulty === diff
                          ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Table Player Count
                </span>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  {[2, 4].map(count => (
                    <button
                      key={count}
                      onClick={() => setAiPlayers(count as 2 | 4)}
                      className={`p-2.5 rounded-xl border font-bold text-xs flex items-center justify-between transition-all ${
                        aiPlayers === count
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span>{count} Players</span>
                      <Bot className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onSelectAiGame(aiPlayers, aiDifficulty)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 font-black text-xs tracking-wider uppercase shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Bot className="w-4 h-4" />
                <span>START VS AI ({aiDifficulty.toUpperCase()})</span>
              </button>
            </div>
          )}

          {/* LOCAL PASS & PLAY */}
          {selectedCategory === 'local' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Offline Pass & Play (No Internet Required)
                </span>
                <p className="text-[10px] text-slate-300 mt-1">
                  Pass the phone between friends in the same room. Complete local Ludo rules supported.
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Players
                </span>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  {([2, 3, 4] as const).map(count => (
                    <button
                      key={count}
                      onClick={() => setLocalPlayers(count)}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                        localPlayers === count
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {count} Players
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onSelectLocalPlay(localPlayers)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs tracking-wider uppercase shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>START PASS & PLAY ({localPlayers}P)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
