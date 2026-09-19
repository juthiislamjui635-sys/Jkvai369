import React, { useState, useEffect } from 'react';
import { Loader2, Users, Check, X, ShieldCheck, Zap } from 'lucide-react';

interface MatchmakingModalProps {
  playerCount: number;
  onCancel: () => void;
  onMatchFound: () => void;
}

export const MatchmakingModal: React.FC<MatchmakingModalProps> = ({
  playerCount,
  onCancel,
  onMatchFound,
}) => {
  const [step, setStep] = useState<'searching' | 'matched' | 'starting'>('searching');
  const [foundCount, setFoundCount] = useState(1); // You are 1

  useEffect(() => {
    // Stage 1: Finding players
    const t1 = setTimeout(() => {
      setFoundCount(2);
    }, 900);

    const t2 = setTimeout(() => {
      setFoundCount(playerCount);
      setStep('matched');
    }, 1800);

    const t3 = setTimeout(() => {
      setStep('starting');
    }, 2600);

    const t4 = setTimeout(() => {
      onMatchFound();
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [playerCount, onMatchFound]);

  const opponents = [
    { name: 'Alex Rivers (You)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', color: 'border-rose-500' },
    { name: 'Rahat', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100', color: 'border-emerald-500' },
    ...(playerCount >= 3 ? [{ name: 'Tanvir', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', color: 'border-amber-500' }] : []),
    ...(playerCount === 4 ? [{ name: 'Amina', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', color: 'border-blue-500' }] : []),
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-amber-500/40 p-6 flex flex-col items-center text-center shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Animated Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 flex items-center justify-center shadow-xl shadow-amber-500/20">
            {step === 'searching' ? (
              <Loader2 className="w-10 h-10 text-slate-950 animate-spin" />
            ) : (
              <Zap className="w-10 h-10 text-slate-950 fill-slate-950 animate-bounce" />
            )}
          </div>
          <div className="absolute -inset-2 rounded-full border border-amber-400/40 animate-ping pointer-events-none" />
        </div>

        <div>
          <h3 className="text-lg font-black text-white">
            {step === 'searching'
              ? 'Finding Online Opponents...'
              : step === 'matched'
              ? 'Players Found!'
              : 'Launching 3D Arena!'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {step === 'searching'
              ? `Connecting to server authoritative queue (${foundCount}/${playerCount})`
              : 'Synchronizing authoritative turn state...'}
          </p>
        </div>

        {/* Players Avatar Row */}
        <div className="flex items-center justify-center gap-2">
          {opponents.slice(0, playerCount).map((opp, idx) => {
            const isReady = idx < foundCount;
            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  className={`w-12 h-12 rounded-full border-2 p-0.5 transition-all ${
                    isReady ? `${opp.color} scale-100` : 'border-slate-800 opacity-40 scale-90'
                  }`}
                >
                  <img
                    src={opp.avatar}
                    alt={opp.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-400 truncate max-w-[60px]">
                  {isReady ? opp.name.split(' ')[0] : '...'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Cancel Button */}
        {step === 'searching' && (
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-bold transition-all border border-slate-700 active:scale-95"
          >
            Cancel Matchmaking
          </button>
        )}
      </div>
    </div>
  );
};
