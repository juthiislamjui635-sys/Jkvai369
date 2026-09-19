import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Trophy, 
  Crown, 
  Medal, 
  Search, 
  UserPlus, 
  Flame, 
  Star, 
  Users,
  Check,
  Gamepad2
} from 'lucide-react';

interface LeaderboardScreenProps {
  onBack: () => void;
  onInviteFriend?: (name: string) => void;
}

interface LeaderboardPlayer {
  rank: number;
  id: string;
  name: string;
  playerId: string;
  avatar: string;
  level: number;
  xp: number;
  wins: number;
  winRate: string;
  isOnline?: boolean;
  isInGame?: boolean;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  onBack,
  onInviteFriend,
}) => {
  const [activeTab, setActiveTab] = useState<'global' | 'friends' | 'weekly'>('global');
  const [searchQuery, setSearchQuery] = useState('');
  const [invitedId, setInvitedId] = useState<string | null>(null);

  const globalPlayers: LeaderboardPlayer[] = [
    { rank: 1, id: 'u1', name: 'Zubair Khan', playerId: 'JK-1092', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', level: 18, xp: 48200, wins: 412, winRate: '84.2%' },
    { rank: 2, id: 'u2', name: 'Alina Stark', playerId: 'JK-3918', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100', level: 16, xp: 41500, wins: 368, winRate: '81.5%' },
    { rank: 3, id: 'u3', name: 'Rashid Minhas', playerId: 'JK-8821', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100', level: 15, xp: 37900, wins: 334, winRate: '79.1%' },
    { rank: 4, id: 'u4', name: 'Alex Rivers (You)', playerId: 'JK-4821', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', level: 5, xp: 6400, wins: 28, winRate: '75.7%' },
    { rank: 5, id: 'u5', name: 'Fariha Noor', playerId: 'JK-5512', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100', level: 12, xp: 26400, wins: 245, winRate: '72.3%' },
    { rank: 6, id: 'u6', name: 'Tanvir Hossain', playerId: 'JK-2299', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', level: 10, xp: 19800, wins: 189, winRate: '69.8%' },
  ];

  const friendsList: LeaderboardPlayer[] = [
    { rank: 1, id: 'f1', name: 'Rahat', playerId: 'JK-7712', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100', level: 6, xp: 7800, wins: 34, winRate: '68.0%', isOnline: true },
    { rank: 2, id: 'u4', name: 'Alex Rivers (You)', playerId: 'JK-4821', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', level: 5, xp: 6400, wins: 28, winRate: '75.7%', isOnline: true },
    { rank: 3, id: 'f2', name: 'Sami', playerId: 'JK-9931', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', level: 4, xp: 4200, wins: 19, winRate: '61.3%', isOnline: false },
    { rank: 4, id: 'f3', name: 'Tania', playerId: 'JK-4019', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', level: 7, xp: 9100, wins: 42, winRate: '71.2%', isInGame: true },
  ];

  const handleInvite = (friend: LeaderboardPlayer) => {
    setInvitedId(friend.id);
    onInviteFriend?.(friend.name);
    setTimeout(() => setInvitedId(null), 3000);
  };

  const currentList = activeTab === 'friends' ? friendsList : globalPlayers;
  const filteredList = currentList.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.playerId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-y-auto select-none">
      {/* Top Bar */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800/80 sticky top-0 bg-slate-950/90 backdrop-blur-md z-20">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-base text-amber-400">Hall of Champions</span>
        <div className="w-9" />
      </div>

      {/* Tabs */}
      <div className="p-4 pb-2 space-y-3">
        <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('global')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'global'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            Global
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'friends'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Friends
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'weekly'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Weekly
          </button>
        </div>

        {/* Search by name or Player ID */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by player or ID (e.g. JK-4821)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* List */}
      <div className="p-4 space-y-2 pb-6">
        {filteredList.map((player) => {
          const isTop1 = player.rank === 1;
          const isTop2 = player.rank === 2;
          const isTop3 = player.rank === 3;
          const isUser = player.id === 'u4';

          return (
            <div
              key={player.id}
              className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                isUser
                  ? 'bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border-amber-500/50 shadow-md'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              {/* Rank Medal / Number */}
              <div className="w-7 text-center flex items-center justify-center">
                {isTop1 ? (
                  <Crown className="w-5 h-5 text-amber-400" />
                ) : isTop2 ? (
                  <Medal className="w-5 h-5 text-slate-300" />
                ) : isTop3 ? (
                  <Medal className="w-5 h-5 text-amber-700" />
                ) : (
                  <span className="text-xs font-bold text-slate-400">#{player.rank}</span>
                )}
              </div>

              {/* Avatar with optional status ring */}
              <div className="relative">
                <img
                  src={player.avatar}
                  alt={player.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
                {activeTab === 'friends' && (
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-950 ${
                      player.isOnline
                        ? 'bg-emerald-500'
                        : player.isInGame
                        ? 'bg-amber-500'
                        : 'bg-slate-500'
                    }`}
                  />
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-white truncate">{player.name}</span>
                  <span className="text-[10px] text-amber-400 font-mono">Lv.{player.level}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                  <span>{player.playerId}</span>
                  <span>•</span>
                  <span>{player.wins} Wins</span>
                  <span>•</span>
                  <span className="text-emerald-400">{player.winRate}</span>
                </div>
              </div>

              {/* Action / Invite button in friends tab */}
              {activeTab === 'friends' && !isUser && (
                <div>
                  <button
                    onClick={() => handleInvite(player)}
                    disabled={invitedId === player.id || player.isInGame}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                      invitedId === player.id
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : player.isInGame
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-amber-500 text-slate-950 hover:bg-amber-400 active:scale-95 shadow-sm'
                    }`}
                  >
                    {invitedId === player.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Sent
                      </>
                    ) : (
                      <>
                        <Gamepad2 className="w-3.5 h-3.5" /> Invite
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
