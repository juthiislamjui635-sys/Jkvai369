import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Settings, 
  Volume2, 
  VolumeX, 
  Music, 
  MessageSquare, 
  LogOut, 
  Sparkles,
  Crown,
  Trophy,
  Dices,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { LudoBoard3D, TokenItem, BoardThemeType } from './LudoBoard3D';
import { Dice3D, DiceSkinType } from './Dice3D';
import { Pawn3D, LudoColor, PawnSkinType } from './Pawn3D';

interface LudoGameInteractiveProps {
  onBackToLobby: () => void;
  onOpenSettings: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  pawnSkin?: PawnSkinType;
  diceSkin?: DiceSkinType;
  boardTheme?: BoardThemeType;
  playerCount?: number;
  gameMode?: 'classic' | 'quick';
}

interface Player {
  id: string;
  name: string;
  color: LudoColor;
  isYou: boolean;
  isHost: boolean;
  avatar: string;
  level: number;
}

const INITIAL_PLAYERS: Player[] = [
  {
    id: 'p1',
    name: 'You',
    color: 'red',
    isYou: true,
    isHost: true,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    level: 8,
  },
  {
    id: 'p2',
    name: 'Rahat',
    color: 'green',
    isYou: false,
    isHost: false,
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    level: 6,
  },
  {
    id: 'p3',
    name: 'Tanvir',
    color: 'yellow',
    isYou: false,
    isHost: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    level: 7,
  },
  {
    id: 'p4',
    name: 'Amina',
    color: 'blue',
    isYou: false,
    isHost: false,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    level: 5,
  },
];

const START_TRACK_POSITIONS: Record<LudoColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39,
};

const HOME_ENTRANCE_TRACK: Record<LudoColor, number> = {
  red: 50,
  green: 11,
  yellow: 24,
  blue: 37,
};

export const LudoGameInteractive: React.FC<LudoGameInteractiveProps> = ({
  onBackToLobby,
  onOpenSettings,
  soundEnabled,
  onToggleSound,
  pawnSkin = 'royalGold',
  diceSkin = 'royal',
  boardTheme = 'midnightGold',
  playerCount = 4,
  gameMode = 'classic',
}) => {
  const [players] = useState<Player[]>(() => INITIAL_PLAYERS.slice(0, playerCount));
  const [turnIndex, setTurnIndex] = useState(0); // 0 = Red (You)
  const [diceValue, setDiceValue] = useState(6);
  const [isRolling, setIsRolling] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);
  const [turnTimer, setTurnTimer] = useState(15);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [showChatModal, setShowChatModal] = useState(false);
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  // Active moving animation states
  const [activeMovingTokenId, setActiveMovingTokenId] = useState<string | null>(null);
  const [movingElevation, setMovingElevation] = useState(0);
  const [movingRotation, setMovingRotation] = useState(0);
  const [isTokenMoving, setIsTokenMoving] = useState(false);

  // Initialize 4 tokens for each of the 4 players
  const [tokens, setTokens] = useState<TokenItem[]>(() => {
    const list: TokenItem[] = [];
    const colors: LudoColor[] = ['red', 'green', 'yellow', 'blue'];

    colors.forEach((color) => {
      for (let i = 0; i < 4; i++) {
        list.push({
          id: `${color}_t${i}`,
          color,
          index: i,
          state: 'home',
          trackPosition: -1,
          homeStretchPosition: -1,
          isMovable: false,
          isSelected: false,
        });
      }
    });

    // Place 1 token on track for instant gameplay engagement!
    list[0].state = 'track';
    list[0].trackPosition = 0; // Red start

    list[4].state = 'track';
    list[4].trackPosition = 13; // Green start

    list[8].state = 'track';
    list[8].trackPosition = 26; // Yellow start

    list[12].state = 'track';
    list[12].trackPosition = 39; // Blue start

    return list;
  });

  const currentPlayer = players[turnIndex];
  const isMyTurn = currentPlayer.isYou;

  // 15s turn countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTurnTimer((prev) => {
        if (prev <= 1) {
          handleNextTurn();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [turnIndex]);

  // Turn advance
  const handleNextTurn = () => {
    setHasRolled(false);
    setTurnTimer(15);
    setTurnIndex((prev) => (prev + 1) % players.length);
  };

  // Check movable tokens whenever dice roll completes
  useEffect(() => {
    if (!hasRolled) {
      setTokens((prev) =>
        prev.map((t) => ({ ...t, isMovable: false, isSelected: false }))
      );
      return;
    }

    const currentColor = currentPlayer.color;
    setTokens((prev) =>
      prev.map((token) => {
        if (token.color !== currentColor) {
          return { ...token, isMovable: false, isSelected: false };
        }

        if (token.state === 'home') {
          return { ...token, isMovable: diceValue === 6 };
        }
        if (token.state === 'track' || token.state === 'homeStretch') {
          return { ...token, isMovable: true };
        }
        return { ...token, isMovable: false };
      })
    );
  }, [hasRolled, diceValue, turnIndex]);

  // Opponent AI turn auto-play
  useEffect(() => {
    if (!currentPlayer.isYou && !hasRolled && !isRolling && !isTokenMoving) {
      const timer = setTimeout(() => {
        handleRollDice();
      }, 900);
      return () => clearTimeout(timer);
    }

    if (!currentPlayer.isYou && hasRolled && !isTokenMoving) {
      const timer = setTimeout(() => {
        const movable = tokens.filter(
          (t) => t.color === currentPlayer.color && t.isMovable
        );
        if (movable.length > 0) {
          handleMoveToken(movable[0]);
        } else {
          handleNextTurn();
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [turnIndex, hasRolled, isRolling, isTokenMoving]);

  // Roll Dice Action
  const handleRollDice = () => {
    if (isRolling || hasRolled || isTokenMoving) return;
    setIsRolling(true);

    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
    }, 70);

    setTimeout(() => {
      clearInterval(interval);
      const finalVal = Math.floor(Math.random() * 6) + 1;
      setDiceValue(finalVal);
      setIsRolling(false);
      setHasRolled(true);
    }, 600);
  };

  // Move Token with step-by-step bounce animation
  const handleMoveToken = async (token: TokenItem) => {
    if (isTokenMoving || !token.isMovable) return;
    setIsTokenMoving(true);
    setActiveMovingTokenId(token.id);

    // If at home and rolled 6 -> place onto board start cell
    if (token.state === 'home' && diceValue === 6) {
      setMovingElevation(1);
      await new Promise((r) => setTimeout(r, 180));

      setTokens((prev) =>
        prev.map((t) =>
          t.id === token.id
            ? {
                ...t,
                state: 'track',
                trackPosition: START_TRACK_POSITIONS[token.color],
                isMovable: false,
              }
            : t
        )
      );

      setMovingElevation(0);
      setActiveMovingTokenId(null);
      setIsTokenMoving(false);
      triggerNotification(`${token.color.toUpperCase()} entered the board!`);
      finishTurnRoutine(6);
      return;
    }

    // Step-by-step hop
    const steps = diceValue;
    for (let step = 0; step < steps; step++) {
      setMovingElevation(1);
      setMovingRotation((step % 2 === 0 ? 1 : -1) * 8);
      await new Promise((r) => setTimeout(r, 120));

      setTokens((prev) =>
        prev.map((t) => {
          if (t.id !== token.id) return t;

          if (t.state === 'track') {
            const entrance = HOME_ENTRANCE_TRACK[t.color];
            if (t.trackPosition === entrance) {
              return { ...t, state: 'homeStretch', homeStretchPosition: 0 };
            }
            return { ...t, trackPosition: (t.trackPosition + 1) % 52 };
          }
          if (t.state === 'homeStretch') {
            if (t.homeStretchPosition < 4) {
              return { ...t, homeStretchPosition: t.homeStretchPosition + 1 };
            }
            return { ...t, state: 'finished' };
          }
          return t;
        })
      );

      setMovingElevation(0);
      setMovingRotation(0);
      await new Promise((r) => setTimeout(r, 100));
    }

    setActiveMovingTokenId(null);
    setIsTokenMoving(false);

    // Check for captures
    checkCapture(token);
    finishTurnRoutine(diceValue);
  };

  const checkCapture = (movedToken: TokenItem) => {
    // Cannot capture if not on track or on safe star cell
    const safeIndices = [0, 8, 13, 21, 26, 34, 39, 47];
    const currentPos = movedToken.trackPosition;

    if (safeIndices.includes(currentPos)) return;

    setTokens((prev) => {
      let capturedColor: string | null = null;
      const updated = prev.map((other) => {
        if (
          other.id !== movedToken.id &&
          other.color !== movedToken.color &&
          other.state === 'track' &&
          other.trackPosition === currentPos
        ) {
          capturedColor = other.color.toUpperCase();
          return {
            ...other,
            state: 'home' as const,
            trackPosition: -1,
          };
        }
        return other;
      });

      if (capturedColor) {
        triggerNotification(`⚔️ ${movedToken.color.toUpperCase()} CAPTURED ${capturedColor}!`);
      }
      return updated;
    });
  };

  const finishTurnRoutine = (rolled: number) => {
    // If rolled 6, get another turn!
    if (rolled === 6) {
      triggerNotification(`🎲 Rolled a 6! Extra turn for ${currentPlayer.name}`);
      setHasRolled(false);
      setTurnTimer(15);
    } else {
      handleNextTurn();
    }
  };

  const triggerNotification = (msg: string) => {
    setLastNotification(msg);
    setTimeout(() => setLastNotification(null), 2400);
  };

  const quickMessages = [
    'Good luck! 🎲',
    'Nice move! 🔥',
    'Hurry up! ⏱️',
    'Well played! 👏',
    'Oops! 😅',
    'Victory is mine! 👑',
  ];

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-950 text-slate-100 select-none overflow-hidden relative">
      
      {/* Dynamic Notification Banner */}
      {lastNotification && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-xl animate-bounce flex items-center gap-1.5 border border-amber-300">
          <Flame className="w-3.5 h-3.5 fill-slate-950" />
          <span>{lastNotification}</span>
        </div>
      )}

      {/* 1. TOP HEADER BAR */}
      <div className="px-3 pt-2 pb-1 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur flex items-center justify-between">
        <button
          onClick={onBackToLobby}
          className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Lobby</span>
        </button>

        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-xs">
            <Dices className="w-3.5 h-3.5 text-slate-950" />
          </div>
          <span className="text-xs font-black tracking-wider text-white">
            JK LODU
          </span>
        </div>

        {/* YOUR TURN / TIMER BANNER */}
        <div className={`px-2.5 py-1 rounded-xl border flex items-center gap-2 ${
          isMyTurn
            ? 'bg-amber-500/15 border-amber-400/60 text-amber-300 shadow-xs'
            : 'bg-slate-900 border-slate-800 text-slate-300'
        }`}>
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-black uppercase tracking-tight">
              {isMyTurn ? 'YOUR TURN' : `${currentPlayer.name.toUpperCase()}'S TURN`}
            </span>
            <span className="text-[9px] text-slate-400">
              {isMyTurn ? 'Roll to move' : 'Waiting...'}
            </span>
          </div>

          <div className="relative w-5 h-5 flex items-center justify-center">
            <span className={`text-[10px] font-black ${turnTimer <= 4 ? 'text-rose-400 animate-ping' : 'text-amber-400'}`}>
              {turnTimer}s
            </span>
          </div>
        </div>
      </div>

      {/* 2. PLAYER INFORMATION CARDS */}
      <div className="px-3 py-1 grid grid-cols-2 gap-2">
        {/* You (Red) */}
        <div className={`p-1.5 rounded-xl border flex items-center gap-2 transition-all ${
          turnIndex === 0
            ? 'bg-rose-950/40 border-rose-500 shadow-md'
            : 'bg-slate-900/60 border-slate-800/80'
        }`}>
          <div className="relative">
            <img
              src={players[0].avatar}
              alt="You"
              className="w-7 h-7 rounded-full object-cover border border-amber-400"
            />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-rose-600 border border-white"></span>
          </div>
          <div>
            <div className="flex items-center gap-1 text-[11px] font-black">
              <span>You</span>
              <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
            </div>
            <div className="text-[9px] text-rose-400 font-bold">RED • Lv.8</div>
          </div>
        </div>

        {/* Rahat (Green) */}
        <div className={`p-1.5 rounded-xl border flex items-center gap-2 transition-all ${
          turnIndex === 1
            ? 'bg-emerald-950/40 border-emerald-500 shadow-md'
            : 'bg-slate-900/60 border-slate-800/80'
        }`}>
          <div className="relative">
            <img
              src={players[1].avatar}
              alt="Rahat"
              className="w-7 h-7 rounded-full object-cover border border-slate-700"
            />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border border-white"></span>
          </div>
          <div>
            <div className="text-[11px] font-black">Rahat</div>
            <div className="text-[9px] text-emerald-400 font-bold">GREEN • Lv.6</div>
          </div>
        </div>
      </div>

      {/* 3. CENTRAL 3D LUDO BOARD CANVAS */}
      <div className="flex-1 flex items-center justify-center p-2 relative">
        <LudoBoard3D
          tokens={tokens}
          theme={boardTheme}
          pawnSkin={pawnSkin}
          onTokenClick={handleMoveToken}
          activeMovingTokenId={activeMovingTokenId}
          movingElevation={movingElevation}
          movingRotation={movingRotation}
        />
      </div>

      {/* 4. ROLLING 3D DICE */}
      <div className="flex justify-center -mt-2 mb-1">
        <Dice3D
          value={diceValue}
          skin={diceSkin}
          isRolling={isRolling}
          isEnabled={isMyTurn && !hasRolled && !isTokenMoving}
          size={52}
          onRoll={handleRollDice}
        />
      </div>

      {/* 5. BOTTOM GAME CONTROLS BAR */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800/90 backdrop-blur rounded-t-3xl shadow-2xl">
        {/* Utility row: Sound, Music, Chat, Settings, Leave */}
        <div className="flex items-center justify-between mb-2.5 px-1">
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-xl border transition-colors ${
              soundEnabled
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
            title="Toggle Sound FX"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setMusicEnabled(!musicEnabled)}
            className={`p-2 rounded-xl border transition-colors ${
              musicEnabled
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
            title="Toggle Background Music"
          >
            <Music className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowChatModal(true)}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Quick Chat & Emotes"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onBackToLobby}
            className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-colors"
            title="Leave Match"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Main Action: Moves Left & [ ROLL DICE ] */}
        <div className="flex items-center gap-2">
          <div className="flex-1 px-3 py-2 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                Moves Left
              </div>
              <div className="text-sm font-black text-amber-400">
                {hasRolled ? diceValue : 0}
              </div>
            </div>
            <div className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[10px] font-bold">
              Dice: {diceValue}
            </div>
          </div>

          <button
            onClick={handleRollDice}
            disabled={!isMyTurn || hasRolled || isRolling || isTokenMoving}
            className={`flex-1 py-3 rounded-2xl font-black text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-1.5 ${
              isMyTurn && !hasRolled && !isRolling && !isTokenMoving
                ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 border border-amber-300 hover:brightness-110 active:scale-95'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <Dices className="w-4 h-4" />
            <span>{isRolling ? 'Rolling...' : 'ROLL DICE'}</span>
          </button>
        </div>
      </div>

      {/* QUICK CHAT MODAL */}
      {showChatModal && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex flex-col justify-end p-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-amber-400 tracking-wider">
                QUICK CHAT & EMOTES
              </span>
              <button
                onClick={() => setShowChatModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quickMessages.map((msg, i) => (
                <button
                  key={i}
                  onClick={() => {
                    triggerNotification(`You: ${msg}`);
                    setShowChatModal(false);
                  }}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-left text-xs font-medium text-slate-200 border border-slate-700"
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
