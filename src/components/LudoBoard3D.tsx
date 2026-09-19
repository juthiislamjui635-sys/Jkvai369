import React, { useState } from 'react';
import { Trophy, Star, Crown } from 'lucide-react';
import { Pawn3D, LudoColor, PawnSkinType } from './Pawn3D';

export interface TokenItem {
  id: string;
  color: LudoColor;
  index: number;
  state: 'home' | 'track' | 'homeStretch' | 'finished';
  trackPosition: number; // 0 to 51
  homeStretchPosition: number; // 0 to 4
  isMovable: boolean;
  isSelected: boolean;
}

export type BoardThemeType = 'midnightGold' | 'royalNavy' | 'emeraldEmpire' | 'classicWood';

interface LudoBoard3DProps {
  tokens: TokenItem[];
  theme?: BoardThemeType;
  pawnSkin?: PawnSkinType;
  onTokenClick: (token: TokenItem) => void;
  activeMovingTokenId?: string | null;
  movingElevation?: number;
  movingRotation?: number;
}

// 52 Main Track Coordinates on 15x15 grid [row, col] (0-indexed)
const MAIN_TRACK: Array<[number, number]> = [
  // Top-left arm going right (0-4)
  [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
  // Top arm going up & down (5-17)
  [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],
  [0, 7],
  [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8],
  // Right arm going right & down & left (18-30)
  [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14],
  [7, 14],
  [8, 14], [8, 13], [8, 12], [8, 11], [8, 10], [8, 9],
  // Bottom arm going down & up (31-43)
  [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8],
  [14, 7],
  [14, 6], [13, 6], [12, 6], [11, 6], [10, 6], [9, 6],
  // Left arm going left & up (44-51)
  [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0],
  [7, 0], [6, 0],
];

// Colored home stretches
const HOME_STRETCHES: Record<LudoColor, Array<[number, number]>> = {
  red: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]],
  green: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]],
  yellow: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]],
  blue: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]],
};

// Fixed Home Base Pawn Sockets
const HOME_BASE_SOCKETS: Record<LudoColor, Array<[number, number]>> = {
  red: [[2, 2], [2, 3], [3, 2], [3, 3]],
  green: [[2, 11], [2, 12], [3, 11], [3, 12]],
  blue: [[11, 2], [11, 3], [12, 2], [12, 3]],
  yellow: [[11, 11], [11, 12], [12, 11], [12, 12]],
};

// Safe track indices
const SAFE_TRACK_INDICES = [0, 8, 13, 21, 26, 34, 39, 47];

export const LudoBoard3D: React.FC<LudoBoard3DProps> = ({
  tokens,
  theme = 'midnightGold',
  pawnSkin = 'royalGold',
  onTokenClick,
  activeMovingTokenId,
  movingElevation = 0,
  movingRotation = 0,
}) => {
  // Helper to get row and col for a token
  const getTokenCoords = (token: TokenItem): [number, number] => {
    if (token.state === 'home') {
      const sockets = HOME_BASE_SOCKETS[token.color];
      return sockets[token.index % sockets.length];
    }
    if (token.state === 'homeStretch') {
      const stretch = HOME_STRETCHES[token.color];
      return stretch[Math.min(4, Math.max(0, token.homeStretchPosition))];
    }
    if (token.state === 'finished') {
      return [7, 7];
    }
    return MAIN_TRACK[token.trackPosition % MAIN_TRACK.length];
  };

  const themeBorderGradients: Record<BoardThemeType, { outer: string; border: string }> = {
    midnightGold: {
      outer: 'bg-gradient-to-br from-[#FFE082] via-[#FFB800] to-[#B45309]',
      border: 'border-amber-300/80',
    },
    royalNavy: {
      outer: 'bg-gradient-to-br from-[#93C5FD] via-[#3B82F6] to-[#1E3A8A]',
      border: 'border-blue-400/80',
    },
    emeraldEmpire: {
      outer: 'bg-gradient-to-br from-[#A7F3D0] via-[#10B981] to-[#064E3B]',
      border: 'border-emerald-300/80',
    },
    classicWood: {
      outer: 'bg-gradient-to-br from-[#FBBF24] via-[#D97706] to-[#78350F]',
      border: 'border-amber-700/80',
    },
  };

  const currentTheme = themeBorderGradients[theme] || themeBorderGradients.midnightGold;

  return (
    <div className={`relative w-full aspect-square max-w-[360px] mx-auto p-1.5 rounded-3xl ${currentTheme.outer} shadow-2xl border-2 ${currentTheme.border} select-none`}>
      {/* 3D Board Inner Frame */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white shadow-inner grid grid-cols-15 grid-rows-15 border border-amber-500/40">
        
        {/* =========================================
            1. FOUR HOME BASE PANELS (6x6 cells each)
            ========================================= */}

        {/* RED BASE (Top-Left: Rows 0-5, Cols 0-5) */}
        <div
          className="col-start-1 col-end-7 row-start-1 row-end-7 p-2 relative flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #FB7185 0%, #E11D48 55%, #9F1239 100%)',
          }}
        >
          {/* Inner embossed white card with sockets */}
          <div className="w-full h-full rounded-xl bg-gradient-to-b from-white to-slate-100 shadow-md border border-amber-400/40 relative flex items-center justify-center p-2">
            <Crown className="absolute w-12 h-12 text-rose-500/15" />
            <div className="grid grid-cols-2 gap-3 z-10">
              {[0, 1, 2, 3].map((socketIdx) => (
                <div
                  key={socketIdx}
                  className="w-7 h-7 rounded-full bg-rose-500/20 border border-rose-500/40 shadow-inner flex items-center justify-center"
                />
              ))}
            </div>
          </div>
        </div>

        {/* GREEN BASE (Top-Right: Rows 0-5, Cols 10-15) */}
        <div
          className="col-start-10 col-end-16 row-start-1 row-end-7 p-2 relative flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #34D399 0%, #10B981 55%, #047857 100%)',
          }}
        >
          <div className="w-full h-full rounded-xl bg-gradient-to-b from-white to-slate-100 shadow-md border border-amber-400/40 relative flex items-center justify-center p-2">
            <Crown className="absolute w-12 h-12 text-emerald-500/15" />
            <div className="grid grid-cols-2 gap-3 z-10">
              {[0, 1, 2, 3].map((socketIdx) => (
                <div
                  key={socketIdx}
                  className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 shadow-inner flex items-center justify-center"
                />
              ))}
            </div>
          </div>
        </div>

        {/* BLUE BASE (Bottom-Left: Rows 10-15, Cols 0-5) */}
        <div
          className="col-start-1 col-end-7 row-start-10 row-end-16 p-2 relative flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #60A5FA 0%, #2563EB 55%, #1D4ED8 100%)',
          }}
        >
          <div className="w-full h-full rounded-xl bg-gradient-to-b from-white to-slate-100 shadow-md border border-amber-400/40 relative flex items-center justify-center p-2">
            <Crown className="absolute w-12 h-12 text-blue-500/15" />
            <div className="grid grid-cols-2 gap-3 z-10">
              {[0, 1, 2, 3].map((socketIdx) => (
                <div
                  key={socketIdx}
                  className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/40 shadow-inner flex items-center justify-center"
                />
              ))}
            </div>
          </div>
        </div>

        {/* YELLOW BASE (Bottom-Right: Rows 10-15, Cols 10-15) */}
        <div
          className="col-start-10 col-end-16 row-start-10 row-end-16 p-2 relative flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 55%, #B45309 100%)',
          }}
        >
          <div className="w-full h-full rounded-xl bg-gradient-to-b from-white to-slate-100 shadow-md border border-amber-400/40 relative flex items-center justify-center p-2">
            <Crown className="absolute w-12 h-12 text-amber-500/15" />
            <div className="grid grid-cols-2 gap-3 z-10">
              {[0, 1, 2, 3].map((socketIdx) => (
                <div
                  key={socketIdx}
                  className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 shadow-inner flex items-center justify-center"
                />
              ))}
            </div>
          </div>
        </div>

        {/* =========================================
            2. 15x15 GRID TRACK CELLS
            ========================================= */}
        {Array.from({ length: 15 }).map((_, r) =>
          Array.from({ length: 15 }).map((_, c) => {
            // Check if cell is in base or center
            const inRedBase = r < 6 && c < 6;
            const inGreenBase = r < 6 && c >= 9;
            const inBlueBase = r >= 9 && c < 6;
            const inYellowBase = r >= 9 && c >= 9;
            const inCenter = r >= 6 && r <= 8 && c >= 6 && c <= 8;

            if (inRedBase || inGreenBase || inBlueBase || inYellowBase || inCenter) {
              return null;
            }

            // Cell colors
            let bgClass = 'bg-white';
            let isSafeStar = false;

            // Safe cells & paths
            if (r === 6 && c === 1) {
              bgClass = 'bg-rose-500';
              isSafeStar = true; // Red start
            } else if (r === 7 && c >= 1 && c <= 5) {
              bgClass = 'bg-rose-500'; // Red Home stretch
            } else if (r === 1 && c === 8) {
              bgClass = 'bg-emerald-500';
              isSafeStar = true; // Green start
            } else if (c === 7 && r >= 1 && r <= 5) {
              bgClass = 'bg-emerald-500'; // Green Home stretch
            } else if (r === 8 && c === 13) {
              bgClass = 'bg-amber-500';
              isSafeStar = true; // Yellow start
            } else if (r === 7 && c >= 9 && c <= 13) {
              bgClass = 'bg-amber-500'; // Yellow Home stretch
            } else if (r === 13 && c === 6) {
              bgClass = 'bg-blue-600';
              isSafeStar = true; // Blue start
            } else if (c === 7 && r >= 9 && r <= 13) {
              bgClass = 'bg-blue-600'; // Blue Home stretch
            } else if (
              (r === 2 && c === 6) ||
              (r === 6 && c === 12) ||
              (r === 12 && c === 8) ||
              (r === 8 && c === 2)
            ) {
              isSafeStar = true;
            }

            return (
              <div
                key={`${r}-${c}`}
                className={`border border-slate-200/80 flex items-center justify-center relative ${bgClass}`}
                style={{
                  gridRowStart: r + 1,
                  gridColumnStart: c + 1,
                }}
              >
                {isSafeStar && (
                  <Star
                    className="w-3.5 h-3.5 text-amber-300 drop-shadow fill-amber-400"
                    strokeWidth={1.5}
                  />
                )}
              </div>
            );
          })
        )}

        {/* =========================================
            3. CENTER HOME TRIANGLES (Rows 7-9, Cols 7-9)
            ========================================= */}
        <div
          className="col-start-7 col-end-10 row-start-7 row-end-10 relative overflow-hidden flex items-center justify-center"
        >
          {/* Red Left Triangle */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: 'polygon(0% 0%, 50% 50%, 0% 100%)',
              background: 'linear-gradient(90deg, #E11D48, #9F1239)',
            }}
          />
          {/* Green Top Triangle */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 50%)',
              background: 'linear-gradient(180deg, #10B981, #047857)',
            }}
          />
          {/* Yellow Right Triangle */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: 'polygon(100% 0%, 100% 100%, 50% 50%)',
              background: 'linear-gradient(270deg, #F59E0B, #B45309)',
            }}
          />
          {/* Blue Bottom Triangle */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: 'polygon(0% 100%, 50% 50%, 100% 100%)',
              background: 'linear-gradient(0deg, #2563EB, #1D4ED8)',
            }}
          />

          {/* Golden Center Crest */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border-2 border-white shadow-lg z-10 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-slate-950 fill-amber-950" />
          </div>
        </div>

        {/* =========================================
            4. 3D PAWNS / TOKENS PLACEMENT
            ========================================= */}
        {tokens.map((token) => {
          const [row, col] = getTokenCoords(token);
          const isMoving = token.id === activeMovingTokenId;

          return (
            <div
              key={token.id}
              className="z-20 flex items-center justify-center pointer-events-auto"
              style={{
                gridRowStart: row + 1,
                gridColumnStart: col + 1,
              }}
            >
              <Pawn3D
                color={token.color}
                skin={pawnSkin}
                size={23}
                isMovable={token.isMovable}
                isSelected={token.isSelected}
                elevation={isMoving ? movingElevation : 0}
                rotation={isMoving ? movingRotation : 0}
                onClick={() => onTokenClick(token)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
