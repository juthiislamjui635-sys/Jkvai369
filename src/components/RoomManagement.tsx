import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Users, 
  Coins, 
  Play, 
  ShieldCheck, 
  Crown, 
  Sparkles,
  Zap,
  LogIn
} from 'lucide-react';

interface CreateRoomProps {
  onBack: () => void;
  onCreateSuccess: (roomCode: string, playersCount: number) => void;
}

export const CreateRoomScreen: React.FC<CreateRoomProps> = ({
  onBack,
  onCreateSuccess,
}) => {
  const [playerCount, setPlayerCount] = useState<2 | 3 | 4>(4);
  const [mode, setMode] = useState<'classic' | 'quick'>('classic');
  const [entryFee, setEntryFee] = useState<number>(500);

  const handleCreate = () => {
    // Generate unique 6-character room code
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'JK';
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    onCreateSuccess(code, playerCount);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-y-auto select-none">
      <div className="p-4 flex items-center justify-between border-b border-slate-800/80 sticky top-0 bg-slate-950/90 backdrop-blur-md z-20">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-base text-amber-400">Create Private Room</span>
        <div className="w-9" />
      </div>

      <div className="p-5 space-y-6 flex-1 flex flex-col justify-between">
        <div className="space-y-5">
          {/* Player Count */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Number of Players</label>
            <div className="grid grid-cols-3 gap-3">
              {[2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => setPlayerCount(num as any)}
                  className={`py-3 rounded-2xl border font-bold text-sm transition-all flex flex-col items-center gap-1 ${
                    playerCount === num
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-400 shadow-md scale-105'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>{num} Players</span>
                </button>
              ))}
            </div>
          </div>

          {/* Game Mode */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Game Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode('classic')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  mode === 'classic'
                    ? 'bg-slate-900 border-amber-400 shadow-md ring-1 ring-amber-400/50'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm text-white mb-1">
                  <Crown className="w-4 h-4 text-amber-400" />
                  Classic Ludo
                </div>
                <p className="text-[11px] text-slate-400">All 4 pawns must reach home center to claim victory</p>
              </button>

              <button
                onClick={() => setMode('quick')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  mode === 'quick'
                    ? 'bg-slate-900 border-amber-400 shadow-md ring-1 ring-amber-400/50'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm text-white mb-1">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Quick Rush
                </div>
                <p className="text-[11px] text-slate-400">First player to land 1 pawn into home wins the pot</p>
              </button>
            </div>
          </div>

          {/* Entry Fee / Stakes */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Entry Stakes (Coins)</label>
            <div className="grid grid-cols-3 gap-3">
              {[500, 1000, 2500].map((stake) => (
                <button
                  key={stake}
                  onClick={() => setEntryFee(stake)}
                  className={`py-3 rounded-2xl border font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    entryFee === stake
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-400 shadow-md scale-105'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>{stake.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Create Button */}
        <button
          onClick={handleCreate}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          Create Room & Open Lobby
        </button>
      </div>
    </div>
  );
};

interface RoomLobbyProps {
  roomCode: string;
  maxPlayers: number;
  onLeave: () => void;
  onStartGame: () => void;
}

export const RoomLobbyScreen: React.FC<RoomLobbyProps> = ({
  roomCode,
  maxPlayers,
  onLeave,
  onStartGame,
}) => {
  const [copied, setCopied] = useState(false);

  const players = [
    { name: 'Alex Rivers (You)', isHost: true, isReady: true, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', color: 'bg-rose-500' },
    { name: 'Rahat', isHost: false, isReady: true, avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100', color: 'bg-emerald-500' },
    ...(maxPlayers >= 3 ? [{ name: 'Tanvir', isHost: false, isReady: true, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', color: 'bg-amber-500' }] : []),
    ...(maxPlayers === 4 ? [{ name: 'Amina', isHost: false, isReady: true, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', color: 'bg-blue-500' }] : []),
  ];

  const handleCopy = () => {
    navigator.clipboard?.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-y-auto select-none">
      <div className="p-4 flex items-center justify-between border-b border-slate-800/80 sticky top-0 bg-slate-950/90 backdrop-blur-md z-20">
        <button
          onClick={onLeave}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-base text-amber-400">Match Lobby</span>
        <div className="w-9" />
      </div>

      <div className="p-5 space-y-5 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Room Code Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 flex flex-col items-center justify-center text-center shadow-lg">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Share Room Code With Friends
            </span>
            <div className="flex items-center gap-3 my-1">
              <span className="text-3xl font-black font-mono tracking-widest text-amber-400">{roomCode}</span>
              <button
                onClick={handleCopy}
                className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 active:scale-95"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <span className="text-[11px] text-slate-400">Match begins once host taps Start Game</span>
          </div>

          {/* Slots List */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-400 px-1">
              <span>Players in Lobby</span>
              <span className="text-amber-400">{players.length} / {maxPlayers}</span>
            </div>

            <div className="space-y-2">
              {players.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-8 rounded-full ${p.color}`} />
                    <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        {p.name}
                        {p.isHost && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            HOST
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Ready
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Start Game Action */}
        <button
          onClick={onStartGame}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-emerald-500/20 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          Start Game
        </button>
      </div>
    </div>
  );
};

interface JoinRoomProps {
  onBack: () => void;
  onJoinSuccess: (roomCode: string) => void;
}

export const JoinRoomScreen: React.FC<JoinRoomProps> = ({
  onBack,
  onJoinSuccess,
}) => {
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleKeyPress = (char: string) => {
    if (code.length < 6) {
      setCode(code + char);
      setErrorMsg(null);
    }
  };

  const handleDelete = () => {
    setCode(code.slice(0, -1));
    setErrorMsg(null);
  };

  const handleJoin = () => {
    if (code.length < 6) {
      setErrorMsg('Please enter a valid 6-character room code.');
      return;
    }
    onJoinSuccess(code);
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'J', '0', 'K'];

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-y-auto select-none">
      <div className="p-4 flex items-center justify-between border-b border-slate-800/80 sticky top-0 bg-slate-950/90 backdrop-blur-md z-20">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-base text-amber-400">Join Private Room</span>
        <div className="w-9" />
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <p className="text-xs text-slate-400 text-center">
            Enter the 6-character code provided by your friend:
          </p>

          {/* Code Display Boxes */}
          <div className="flex justify-center gap-2 my-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`w-11 h-13 rounded-xl border-2 flex items-center justify-center font-mono text-xl font-black transition-all ${
                  code[i]
                    ? 'border-amber-400 bg-amber-500/10 text-amber-300 shadow-md'
                    : 'border-slate-800 bg-slate-900 text-slate-500'
                }`}
              >
                {code[i] || ''}
              </div>
            ))}
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-400 text-center font-semibold animate-shake">
              {errorMsg}
            </p>
          )}
        </div>

        {/* Virtual Keypad */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
            {keys.map((k) => (
              <button
                key={k}
                onClick={() => handleKeyPress(k)}
                className="py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-base font-black text-white hover:border-amber-400 active:scale-95 transition-all shadow-sm"
              >
                {k}
              </button>
            ))}
            <button
              onClick={handleDelete}
              className="py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-rose-400 hover:bg-slate-800 active:scale-95"
            >
              DEL
            </button>
            <button
              onClick={() => handleKeyPress('L')}
              className="py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-base font-black text-white hover:border-amber-400 active:scale-95"
            >
              L
            </button>
            <button
              onClick={() => handleKeyPress('P')}
              className="py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-base font-black text-white hover:border-amber-400 active:scale-95"
            >
              P
            </button>
          </div>

          <button
            onClick={handleJoin}
            disabled={code.length < 6}
            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-xl transition-all flex items-center justify-center gap-2 ${
              code.length === 6
                ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 hover:brightness-110 active:scale-98 shadow-amber-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Enter Room
          </button>
        </div>
      </div>
    </div>
  );
};
