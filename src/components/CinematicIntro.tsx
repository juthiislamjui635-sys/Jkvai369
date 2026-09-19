import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Crown } from 'lucide-react';
import { Pawn3D } from './Pawn3D';

interface CinematicIntroProps {
  onComplete: () => void;
  speed?: 'full' | 'fast';
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({
  onComplete,
  speed = 'full',
}) => {
  // Step sequence progress: 0 to 8
  const [step, setStep] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  // Time multiplier: full sequence (~3.0s) vs fast sequence (~1.8s)
  const isFast = speed === 'fast';
  const pace = isFast ? 0.6 : 1.0;

  // Staged timeline sequence
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    // Step 1: Dark Intro with floating embers (Starts immediately)
    timeouts.push(setTimeout(() => setStep(1), 100 * pace));

    // Step 2: Golden Crown emerges
    timeouts.push(setTimeout(() => setStep(2), 400 * pace));

    // Step 3: Premium 3D Dice appears & settles with bounce
    timeouts.push(setTimeout(() => setStep(3), 850 * pace));

    // Step 4: Four 3D Pawns glide toward center
    timeouts.push(setTimeout(() => setStep(4), 1300 * pace));

    // Step 5: Golden Ludo Board Outline draws into background
    timeouts.push(setTimeout(() => setStep(5), 1750 * pace));

    // Step 6: JK LODU Logo typography reveal with shine sweep
    timeouts.push(setTimeout(() => setStep(6), 2150 * pace));

    // Step 7: Tagline emerges
    timeouts.push(setTimeout(() => setStep(7), 2550 * pace));

    // Step 8: Hold & Final Glow
    timeouts.push(setTimeout(() => setStep(8), 2950 * pace));

    // Step 9: Smooth fade/scale exit transition
    timeouts.push(
      setTimeout(() => {
        setIsExiting(true);
      }, 3400 * pace)
    );

    // Call onComplete after exit transition completes
    timeouts.push(
      setTimeout(() => {
        onComplete();
      }, 3850 * pace)
    );

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [pace, onComplete]);

  // Handle immediate skip
  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 250);
  };

  // Generate stable floating particles
  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: (i * 17) % 100,
      y: (i * 23) % 100,
      size: (i % 3) + 2,
      duration: 3 + (i % 4),
      delay: (i % 5) * 0.4,
      opacity: 0.2 + (i % 5) * 0.15,
    }));
  }, []);

  return (
    <div
      onClick={handleSkip}
      className={`relative w-full h-full overflow-hidden select-none flex flex-col items-center justify-center cursor-pointer transition-all duration-500 ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at 50% 45%, #0B163B 0%, #060B1E 60%, #02040A 100%)',
      }}
    >
      {/* 1. CINEMATIC BACKGROUND ELEMENTS */}
      
      {/* Subtle Vignette & Radial Light Rays */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 42%, rgba(245, 158, 11, 0.08) 0%, rgba(30, 58, 138, 0.05) 45%, rgba(2, 4, 10, 0.85) 90%)',
        }}
      />

      {/* Atmospheric Soft Light Beams */}
      <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
        <div 
          className="w-[500px] h-[500px] rounded-full animate-spin"
          style={{
            animationDuration: '35s',
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(245, 158, 11, 0.12) 45deg, transparent 90deg, rgba(96, 165, 250, 0.08) 180deg, transparent 270deg, rgba(245, 158, 11, 0.12) 315deg, transparent 360deg)',
            filter: 'blur(30px)',
          }}
        />
      </div>

      {/* Subtle Ludo Circuit Watermark Pattern */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none flex items-center justify-center">
        <svg className="w-[320px] h-[320px]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <circle cx="50" cy="50" r="45" stroke="#F59E0B" strokeWidth="0.5" strokeDasharray="2 2" />
          <circle cx="50" cy="50" r="32" stroke="#F59E0B" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="18" stroke="#F59E0B" strokeWidth="0.5" strokeDasharray="1 3" />
          <path d="M 50 5 L 50 95 M 5 50 L 95 50" stroke="#F59E0B" strokeWidth="0.5" />
          <rect x="25" y="25" width="50" height="50" stroke="#F59E0B" strokeWidth="0.5" rx="4" />
        </svg>
      </div>

      {/* Floating Gold Ember Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.id % 2 === 0 ? '#FBBF24' : '#60A5FA',
              opacity: step >= 1 ? p.opacity : 0,
              boxShadow: `0 0 8px ${p.id % 2 === 0 ? 'rgba(251, 191, 36, 0.8)' : 'rgba(96, 165, 250, 0.8)'}`,
              transition: 'opacity 1.2s ease-out',
              transform: `translateY(${step >= 2 ? '-20px' : '0px'})`,
            }}
          />
        ))}
      </div>

      {/* 2. CENTRAL CINEMATIC STAGE */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        
        {/* Emblem Wrapper */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          
          {/* STEP 5: GOLDEN LUDO BOARD OUTLINE (Behind Emblem) */}
          <div 
            className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
              step >= 5 ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 rotate-[-15deg]'
            }`}
          >
            <svg 
              className="w-56 h-56 drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]" 
              viewBox="0 0 200 200" 
              fill="none"
            >
              <defs>
                <linearGradient id="goldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FDE68A" />
                  <stop offset="35%" stopColor="#F59E0B" />
                  <stop offset="70%" stopColor="#D97706" />
                  <stop offset="100%" stopColor="#FBBF24" />
                </linearGradient>
                <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Outer Golden Rounded Frame */}
              <rect 
                x="15" 
                y="15" 
                width="170" 
                height="170" 
                rx="24" 
                stroke="url(#goldStroke)" 
                strokeWidth="2" 
                strokeDasharray="600"
                strokeDashoffset={step >= 5 ? "0" : "600"}
                style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
                filter="url(#goldGlow)"
              />

              {/* Quadrant Corner Outlines */}
              {/* Red Quadrant (Top-Left) */}
              <rect x="25" y="25" width="56" height="56" rx="12" stroke="#E11D48" strokeWidth="1.5" strokeOpacity="0.75" />
              <circle cx="53" cy="53" r="14" stroke="#E11D48" strokeWidth="1" strokeDasharray="3 3" />

              {/* Green Quadrant (Top-Right) */}
              <rect x="119" y="25" width="56" height="56" rx="12" stroke="#10B981" strokeWidth="1.5" strokeOpacity="0.75" />
              <circle cx="147" cy="53" r="14" stroke="#10B981" strokeWidth="1" strokeDasharray="3 3" />

              {/* Blue Quadrant (Bottom-Left) */}
              <rect x="25" y="119" width="56" height="56" rx="12" stroke="#2563EB" strokeWidth="1.5" strokeOpacity="0.75" />
              <circle cx="53" cy="147" r="14" stroke="#2563EB" strokeWidth="1" strokeDasharray="3 3" />

              {/* Yellow Quadrant (Bottom-Right) */}
              <rect x="119" y="119" width="56" height="56" rx="12" stroke="#F59E0B" strokeWidth="1.5" strokeOpacity="0.75" />
              <circle cx="147" cy="147" r="14" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 3" />

              {/* Center Diamond Triangle Junction */}
              <polygon points="100,65 135,100 100,135 65,100" stroke="url(#goldStroke)" strokeWidth="1.5" fill="rgba(15,23,42,0.6)" />
              
              {/* Safe Point Star Markers */}
              <polygon points="100,32 102,38 108,38 103,42 105,48 100,44 95,48 97,42 92,38 98,38" fill="#FDE68A" />
              <polygon points="168,100 162,102 162,108 158,103 152,105 156,100 152,95 158,97 162,92 162,98" fill="#FDE68A" />
              <polygon points="100,168 98,162 92,162 97,158 95,152 100,156 105,152 103,158 108,162 102,162" fill="#FDE68A" />
              <polygon points="32,100 38,98 38,92 42,97 48,95 44,100 48,105 42,103 38,108 38,102" fill="#FDE68A" />
            </svg>
          </div>

          {/* STEP 2: GOLDEN CROWN (Top of Emblem) */}
          <div 
            className={`absolute top-2 left-1/2 -translate-x-1/2 z-30 transition-all duration-700 ${
              step >= 2 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-75'
            }`}
          >
            <div className="relative group">
              {/* Crown Aura Glow */}
              <div className="absolute -inset-2 bg-amber-400/30 rounded-full blur-md" />

              {/* Crafted Golden Crown */}
              <svg className="w-10 h-10 drop-shadow-[0_4px_10px_rgba(245,158,11,0.6)]" viewBox="0 0 48 48" fill="none">
                <defs>
                  <linearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFBEB" />
                    <stop offset="25%" stopColor="#FDE68A" />
                    <stop offset="60%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#B45309" />
                  </linearGradient>
                </defs>
                <path 
                  d="M6 34L10 16L19 25L24 10L29 25L38 16L42 34H6Z" 
                  fill="url(#crownGrad)" 
                  stroke="#FDE68A" 
                  strokeWidth="1.2"
                />
                <rect x="6" y="34" width="36" height="5" rx="2" fill="url(#crownGrad)" stroke="#FDE68A" strokeWidth="0.8" />
                {/* Crown Gem Orbs */}
                <circle cx="24" cy="10" r="2.5" fill="#EF4444" stroke="#FFF" strokeWidth="0.6" />
                <circle cx="10" cy="16" r="2" fill="#3B82F6" stroke="#FFF" strokeWidth="0.6" />
                <circle cx="38" cy="16" r="2" fill="#10B981" stroke="#FFF" strokeWidth="0.6" />
                <circle cx="24" cy="36.5" r="1.5" fill="#EF4444" />
                <circle cx="15" cy="36.5" r="1.5" fill="#3B82F6" />
                <circle cx="33" cy="36.5" r="1.5" fill="#10B981" />
              </svg>
            </div>
          </div>

          {/* STEP 4: FOUR 3D PAWNS (Surrounding Central Dice) */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            {/* Red Pawn (Top-Left) */}
            <div 
              className={`absolute top-11 left-11 transition-all duration-700 ${
                step >= 4 
                  ? 'opacity-100 translate-x-0 translate-y-0 scale-100' 
                  : 'opacity-0 -translate-x-6 -translate-y-6 scale-50'
              }`}
            >
              <Pawn3D color="red" skin="royalGold" size={26} />
            </div>

            {/* Green Pawn (Top-Right) */}
            <div 
              className={`absolute top-11 right-11 transition-all duration-700 ${
                step >= 4 
                  ? 'opacity-100 translate-x-0 translate-y-0 scale-100' 
                  : 'opacity-0 translate-x-6 -translate-y-6 scale-50'
              }`}
            >
              <Pawn3D color="green" skin="royalGold" size={26} />
            </div>

            {/* Blue Pawn (Bottom-Left) */}
            <div 
              className={`absolute bottom-11 left-11 transition-all duration-700 ${
                step >= 4 
                  ? 'opacity-100 translate-x-0 translate-y-0 scale-100' 
                  : 'opacity-0 -translate-x-6 translate-y-6 scale-50'
              }`}
            >
              <Pawn3D color="blue" skin="royalGold" size={26} />
            </div>

            {/* Yellow Pawn (Bottom-Right) */}
            <div 
              className={`absolute bottom-11 right-11 transition-all duration-700 ${
                step >= 4 
                  ? 'opacity-100 translate-x-0 translate-y-0 scale-100' 
                  : 'opacity-0 translate-x-6 translate-y-6 scale-50'
              }`}
            >
              <Pawn3D color="yellow" skin="royalGold" size={26} />
            </div>
          </div>

          {/* STEP 3: PREMIUM 3D WHITE DICE (Center Stage) */}
          <div 
            className={`relative z-20 flex items-center justify-center transition-all duration-700 ${
              step >= 3 
                ? 'opacity-100 scale-100 rotate-0 translate-y-0' 
                : 'opacity-0 scale-50 rotate-[-45deg] -translate-y-8'
            }`}
          >
            {/* Dice Contact Ground Shadow */}
            <div className="absolute -bottom-3 w-14 h-4 rounded-full bg-black/60 blur-xs" />

            {/* 3D Isometric White Ivory Dice */}
            <div 
              className="relative w-14 h-14 rounded-2xl p-[2px] transition-transform"
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 40%, #CBD5E1 85%, #94A3B8 100%)',
                boxShadow: '0 10px 25px -4px rgba(0, 0, 0, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.9), inset 0 -2px 5px rgba(0, 0, 0, 0.25)',
              }}
            >
              {/* Inner Face with Beveled Rim */}
              <div 
                className="w-full h-full rounded-[14px] relative overflow-hidden flex items-center justify-center"
                style={{
                  background: 'linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 50%, #E2E8F0 100%)',
                }}
              >
                {/* Diagonal Specular Sheen */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-40"
                  style={{
                    background: 'linear-gradient(115deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 45%)',
                  }}
                />

                {/* 6 Pips (Golden and Obsidian Pips) */}
                <div className="w-10 h-10 relative">
                  {[
                    [20, 20], [80, 20],
                    [20, 50], [80, 50],
                    [20, 80], [80, 80]
                  ].map(([x, y], idx) => (
                    <div
                      key={idx}
                      className="absolute w-2.5 h-2.5 rounded-full -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        background: 'radial-gradient(circle at 35% 35%, #FDE68A 0%, #D97706 70%, #78350F 100%)',
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.6), 0 0.5px 1px rgba(255,255,255,0.8)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* STEP 6: JK LODU TYPOGRAPHY REVEAL */}
        <div 
          className={`mt-4 text-center transition-all duration-700 ${
            step >= 6 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-4 scale-95'
          }`}
        >
          <div className="relative inline-block">
            <h1 className="text-4xl sm:text-5xl font-black tracking-wider flex items-center justify-center gap-2">
              {/* "JK" in Radiant 24K Gold */}
              <span 
                className="bg-clip-text text-transparent bg-gradient-to-b from-[#FFFBEB] via-[#FBBF24] to-[#B45309]"
                style={{
                  textShadow: '0 4px 20px rgba(245, 158, 11, 0.4)',
                  filter: 'drop-shadow(0 2px 8px rgba(245, 158, 11, 0.5))',
                }}
              >
                JK
              </span>

              {/* "LODU" in Platinum Silver Chrome */}
              <span 
                className="bg-clip-text text-transparent bg-gradient-to-b from-[#FFFFFF] via-[#E2E8F0] to-[#94A3B8]"
                style={{
                  filter: 'drop-shadow(0 2px 10px rgba(255, 255, 255, 0.35))',
                }}
              >
                LODU
              </span>
            </h1>

            {/* Light Sweep Across Logo (Active in Step 6+) */}
            {step >= 6 && (
              <div 
                className="absolute inset-0 pointer-events-none overflow-hidden"
                style={{
                  maskImage: 'linear-gradient(to right, transparent, black, transparent)',
                }}
              >
                <div 
                  className="w-16 h-full bg-white/40 skew-x-[-25deg] blur-xs animate-shine"
                  style={{
                    animation: 'sweep 2.2s infinite ease-in-out',
                  }}
                />
              </div>
            )}
          </div>

          {/* STEP 7: ELEGANT TAGLINE */}
          <div 
            className={`mt-2 transition-all duration-700 ${
              step >= 7 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-2'
            }`}
          >
            <p 
              className="text-[10px] sm:text-xs font-semibold tracking-[0.24em] uppercase text-amber-200/90"
              style={{
                textShadow: '0 0 10px rgba(253, 230, 138, 0.4)',
              }}
            >
              The Ultimate Multiplayer Ludo Experience
            </p>
          </div>
        </div>

        {/* STEP 8: FINAL HOLD STATUS BAR / ENGINE READY */}
        <div 
          className={`mt-8 flex flex-col items-center gap-1.5 transition-all duration-500 ${
            step >= 8 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              ENTERING GAME TABLE...
            </span>
          </div>
          <div className="w-36 h-1 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-700"
              style={{ width: step >= 8 ? '100%' : '50%' }}
            />
          </div>
        </div>

      </div>

      {/* 3. DISCREET SKIP BUTTON */}
      <div className="absolute top-4 right-5 z-40">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          className="px-3 py-1 rounded-full bg-slate-900/60 border border-slate-700/60 backdrop-blur text-[10px] font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all tracking-wider flex items-center gap-1"
        >
          <span>SKIP</span>
          <span className="text-[8px] text-amber-400">››</span>
        </button>
      </div>

      {/* Inline Animation Style for Light Sweep */}
      <style>{`
        @keyframes sweep {
          0% { transform: translateX(-150%) skewX(-25deg); opacity: 0; }
          40% { opacity: 0.8; }
          100% { transform: translateX(350%) skewX(-25deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
