import React from 'react';

export type DiceSkinType = 'classic' | 'royal' | 'crystal' | 'neon' | 'gold';

interface Dice3DProps {
  value: number;
  skin?: DiceSkinType;
  isRolling?: boolean;
  isEnabled?: boolean;
  size?: number;
  onRoll?: () => void;
}

export const Dice3D: React.FC<Dice3DProps> = ({
  value,
  skin = 'royal',
  isRolling = false,
  isEnabled = true,
  size = 56,
  onRoll,
}) => {
  // Classic 1-6 pip configurations (percentage coordinates inside face)
  const pipCoordinates: Record<number, Array<[number, number]>> = {
    1: [[50, 50]],
    2: [[28, 28], [72, 72]],
    3: [[28, 28], [50, 50], [72, 72]],
    4: [[28, 28], [72, 28], [28, 72], [72, 72]],
    5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
    6: [[28, 28], [72, 28], [28, 50], [72, 50], [28, 72], [72, 72]],
  };

  const currentPips = pipCoordinates[Math.min(6, Math.max(1, value))] || [[50, 50]];

  const skinStyles = {
    classic: {
      bg: 'linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 45%, #E2E8F0 85%, #CBD5E1 100%)',
      border: 'border-slate-200',
      pipBg: 'radial-gradient(circle at 35% 35%, #475569 0%, #0F172A 70%, #020617 100%)',
      pipGlow: 'none',
    },
    royal: {
      bg: 'linear-gradient(145deg, #1E1B4B 0%, #0F172A 50%, #030712 100%)',
      border: 'border-amber-400/80',
      pipBg: 'radial-gradient(circle at 35% 35%, #FDE68A 0%, #F59E0B 65%, #B45309 100%)',
      pipGlow: '0 0 6px rgba(245, 158, 11, 0.6)',
    },
    crystal: {
      bg: 'linear-gradient(145deg, #F0FDF4 0%, #E0F2FE 45%, #BAE6FD 85%, #7DD3FC 100%)',
      border: 'border-cyan-300',
      pipBg: 'radial-gradient(circle at 35% 35%, #38BDF8 0%, #0369A1 70%, #0C4A6E 100%)',
      pipGlow: '0 0 5px rgba(56, 189, 248, 0.5)',
    },
    neon: {
      bg: 'linear-gradient(145deg, #18181B 0%, #09090B 60%, #000000 100%)',
      border: 'border-emerald-500/80',
      pipBg: 'radial-gradient(circle at 35% 35%, #6EE7B7 0%, #10B981 65%, #047857 100%)',
      pipGlow: '0 0 8px rgba(16, 185, 129, 0.85)',
    },
    gold: {
      bg: 'linear-gradient(145deg, #FDE68A 0%, #F59E0B 50%, #D97706 80%, #92400E 100%)',
      border: 'border-yellow-200',
      pipBg: 'radial-gradient(circle at 35% 35%, #F87171 0%, #DC2626 70%, #7F1D1D 100%)',
      pipGlow: '0 0 6px rgba(220, 38, 38, 0.7)',
    },
  };

  const activeStyle = skinStyles[skin] || skinStyles.royal;

  return (
    <div className="flex flex-col items-center select-none">
      <button
        onClick={isEnabled && !isRolling ? onRoll : undefined}
        disabled={!isEnabled || isRolling}
        style={{ width: size, height: size }}
        className={`relative rounded-2xl transition-all ${
          isEnabled && !isRolling
            ? 'cursor-pointer hover:scale-105 active:scale-90'
            : 'cursor-not-allowed opacity-85'
        }`}
      >
        {/* Golden Turn Glow Ring */}
        {isEnabled && (
          <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 opacity-75 blur-xs animate-pulse pointer-events-none"></div>
        )}

        {/* 3D Glossy Cube Face */}
        <div
          className={`w-full h-full rounded-2xl relative overflow-hidden shadow-xl border-2 ${activeStyle.border} transition-transform ${
            isRolling ? 'animate-bounce' : ''
          }`}
          style={{
            background: activeStyle.bg,
            boxShadow: '0 8px 16px -2px rgba(15, 23, 42, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.9), inset 0 -2px 4px rgba(148, 163, 184, 0.5)',
            transform: isRolling ? 'rotate(18deg) scale(0.95)' : 'none',
          }}
        >
          {/* Diagonal Glass Reflection Sweep */}
          <div
            className="absolute -top-6 -left-6 w-16 h-16 bg-white/40 pointer-events-none rounded-full blur-xs"
            style={{ transform: 'rotate(45deg)' }}
          />

          {/* Inset Black Pips */}
          {currentPips.map(([cx, cy], idx) => (
            <div
              key={idx}
              className="absolute rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
              style={{
                left: `${cx}%`,
                top: `${cy}%`,
                width: size * 0.17,
                height: size * 0.17,
                background: activeStyle.pipBg,
                boxShadow: activeStyle.pipGlow,
              }}
            >
              {/* Pip Specular reflex */}
              <div className="w-[30%] h-[30%] rounded-full bg-white/40 -translate-x-[20%] -translate-y-[20%]" />
            </div>
          ))}
        </div>
      </button>

      {/* Dynamic Floor Contact Shadow */}
      <div
        className="h-2 rounded-full bg-black/40 blur-xs transition-all mt-1"
        style={{
          width: isRolling ? size * 0.5 : size * 0.8,
          opacity: isRolling ? 0.3 : 0.6,
        }}
      />
    </div>
  );
};
