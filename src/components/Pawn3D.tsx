import React from 'react';

export type LudoColor = 'red' | 'green' | 'blue' | 'yellow';
export type PawnSkinType = 'classic' | 'royalGold' | 'neon' | 'crystal' | 'diamond';

interface Pawn3DProps {
  color: LudoColor;
  skin?: PawnSkinType;
  size?: number;
  isSelected?: boolean;
  isMovable?: boolean;
  elevation?: number; // 0 to 1
  rotation?: number;  // radians or deg
  onClick?: () => void;
}

export const Pawn3D: React.FC<Pawn3DProps> = ({
  color,
  skin = 'royalGold',
  size = 28,
  isSelected = false,
  isMovable = false,
  elevation = 0,
  rotation = 0,
  onClick,
}) => {
  // Color specifications for rich glossy 3D depth
  const colorProfiles = {
    red: {
      primary: '#E11D48',
      highlight: '#FF6B8B',
      deepShadow: '#880825',
      specular: '#FFD4DE',
      rim: '#FDA4AF',
      aura: 'rgba(225, 29, 72, 0.65)',
    },
    green: {
      primary: '#10B981',
      highlight: '#5EEAD4',
      deepShadow: '#04543E',
      specular: '#D1FAE5',
      rim: '#A7F3D0',
      aura: 'rgba(16, 185, 129, 0.65)',
    },
    blue: {
      primary: '#2563EB',
      highlight: '#93C5FD',
      deepShadow: '#1E3A8A',
      specular: '#DBEAFE',
      rim: '#BFDBFE',
      aura: 'rgba(37, 99, 235, 0.65)',
    },
    yellow: {
      primary: '#F59E0B',
      highlight: '#FDE68A',
      deepShadow: '#92400E',
      specular: '#FFFBEB',
      rim: '#FEF08A',
      aura: 'rgba(245, 158, 11, 0.65)',
    },
  };

  const p = colorProfiles[color];
  const uniqueId = `pawn_${color}_${Math.random().toString(36).substring(2, 7)}`;
  const height = size * 1.38;
  const currentElevation = isSelected ? 0.35 : elevation;
  const translateY = -currentElevation * 14;
  const shadowScale = Math.max(0.3, 1.0 - currentElevation * 0.35);
  const shadowOpacity = Math.max(0.2, 0.7 - currentElevation * 0.3);

  return (
    <div
      onClick={isMovable || isSelected ? onClick : undefined}
      className={`relative inline-flex items-center justify-center transition-transform ${
        isMovable || isSelected ? 'cursor-pointer hover:scale-110 active:scale-95' : ''
      }`}
      style={{
        width: size,
        height: height,
      }}
    >
      <svg
        viewBox="0 0 100 138"
        className="w-full h-full overflow-visible"
        style={{
          transform: `translateY(${translateY}px) rotate(${rotation}deg)`,
          transition: 'transform 120ms ease-out',
        }}
      >
        <defs>
          {/* Base Radial Gradient */}
          <radialGradient id={`${uniqueId}_base`} cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor={p.highlight} />
            <stop offset="50%" stopColor={p.primary} />
            <stop offset="100%" stopColor={p.deepShadow} />
          </radialGradient>

          {/* Waist / Trunk Gradient */}
          <linearGradient id={`${uniqueId}_body`} x1="15%" y1="0%" x2="85%" y2="0%">
            <stop offset="0%" stopColor={p.highlight} />
            <stop offset="28%" stopColor={p.specular} />
            <stop offset="62%" stopColor={p.primary} />
            <stop offset="90%" stopColor={p.deepShadow} />
            <stop offset="100%" stopColor={p.deepShadow} />
          </linearGradient>

          {/* Spherical Head Radial Gradient */}
          <radialGradient id={`${uniqueId}_head`} cx="32%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="22%" stopColor={p.specular} />
            <stop offset="55%" stopColor={p.highlight} />
            <stop offset="82%" stopColor={p.primary} />
            <stop offset="100%" stopColor={p.deepShadow} />
          </radialGradient>

          {/* Collar Torus Gradient */}
          <linearGradient id={`${uniqueId}_collar`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor={p.highlight} />
            <stop offset="70%" stopColor={p.primary} />
            <stop offset="100%" stopColor={p.deepShadow} />
          </linearGradient>

          {/* Royal Gold Metallic Gradient */}
          <linearGradient id="royal_gold_gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF275" />
            <stop offset="40%" stopColor="#FFD700" />
            <stop offset="75%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8C6D1F" />
          </linearGradient>

          {/* Filter for contact shadow */}
          <filter id={`${uniqueId}_shadow_blur`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>

        {/* 1. CONTACT DROP SHADOW UNDERNEATH */}
        <ellipse
          cx="50"
          cy="128"
          rx={36 * shadowScale}
          ry={10 * shadowScale}
          fill="#000000"
          opacity={shadowOpacity}
          filter={`url(#${uniqueId}_shadow_blur)`}
        />

        {/* 2. PULSING SELECTION AURA */}
        {(isMovable || isSelected) && (
          <ellipse
            cx="50"
            cy="70"
            rx="52"
            ry="60"
            fill="none"
            stroke={isSelected ? '#FFB800' : p.highlight}
            strokeWidth={isSelected ? '4' : '3'}
            opacity="0.85"
            className="animate-pulse"
            strokeDasharray={isSelected ? '6 4' : undefined}
          />
        )}

        {/* 3. WIDE CIRCULAR BASE PEDESTAL */}
        <ellipse
          cx="50"
          cy="114"
          rx="42"
          ry="14"
          fill={`url(#${uniqueId}_base)`}
        />
        {/* Upper beveled base ring */}
        <ellipse
          cx="50"
          cy="108"
          rx="34"
          ry="9"
          fill={p.primary}
          stroke={p.specular}
          strokeWidth="1.2"
        />

        {/* 4. CURVED TAPERED BODY / WAIST */}
        <path
          d="M 22 108 Q 38 78 35 62 L 65 62 Q 62 78 78 108 Z"
          fill={`url(#${uniqueId}_body)`}
        />

        {/* 5. COLLAR / NECK RING */}
        <ellipse
          cx="50"
          cy="62"
          rx="25"
          ry="6"
          fill={skin === 'royalGold' ? 'url(#royal_gold_gradient)' : `url(#${uniqueId}_collar)`}
          stroke={skin === 'royalGold' ? '#FFD700' : (skin === 'neon' ? '#38BDF8' : undefined)}
          strokeWidth={skin === 'royalGold' || skin === 'neon' ? '1.5' : '0'}
        />

        {/* Royal Gold Filigree Ring */}
        {skin === 'royalGold' && (
          <path
            d="M 32 62 Q 50 66 68 62"
            fill="none"
            stroke="#FFF275"
            strokeWidth="1.2"
          />
        )}

        {/* 6. SPHERICAL HEAD */}
        <circle
          cx="50"
          cy="38"
          r="24"
          fill={`url(#${uniqueId}_head)`}
          stroke={skin === 'neon' ? '#00F0FF' : (skin === 'diamond' ? '#E0F2FE' : undefined)}
          strokeWidth={skin === 'neon' ? '1.5' : (skin === 'diamond' ? '1' : '0')}
        />

        {/* Diamond Facet Lines */}
        {skin === 'diamond' && (
          <g opacity="0.6" stroke="#FFFFFF" strokeWidth="0.8">
            <line x1="38" y1="20" x2="62" y2="20" />
            <line x1="28" y1="36" x2="72" y2="36" />
            <line x1="38" y1="20" x2="28" y2="36" />
            <line x1="62" y1="20" x2="72" y2="36" />
            <line x1="28" y1="36" x2="50" y2="58" />
            <line x1="72" y1="36" x2="50" y2="58" />
          </g>
        )}

        {/* Neon Cyber Glow Accent */}
        {skin === 'neon' && (
          <ellipse
            cx="50"
            cy="38"
            rx="16"
            ry="16"
            fill="none"
            stroke="#A855F7"
            strokeWidth="1"
            strokeDasharray="4 2"
            opacity="0.8"
          />
        )}

        {/* 7. SPECULAR HOT SPOT HIGHLIGHT */}
        <ellipse
          cx="42"
          cy="28"
          rx="7.5"
          ry="5"
          fill="#FFFFFF"
          opacity={skin === 'crystal' ? '0.95' : '0.85'}
          transform="rotate(-25 42 28)"
        />
        {/* Micro white dot */}
        <circle
          cx="39"
          cy="26"
          r="2"
          fill="#FFFFFF"
        />

        {/* Royal Crown Crest for Royal Gold */}
        {skin === 'royalGold' && (
          <path
            d="M 44 38 L 47 34 L 50 37 L 53 34 L 56 38 Z"
            fill="#FFD700"
            stroke="#B45309"
            strokeWidth="0.5"
          />
        )}

        {/* 8. RIM LIGHT ON LEFT FLANK */}
        <path
          d="M 29 32 A 24 24 0 0 0 35 54"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          opacity="0.45"
        />
      </svg>
    </div>
  );
};
