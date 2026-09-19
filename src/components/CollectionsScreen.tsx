import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Check, Crown, Palette, Dices } from 'lucide-react';
import { Pawn3D, PawnSkinType } from './Pawn3D';
import { Dice3D, DiceSkinType } from './Dice3D';
import { BoardThemeType } from './LudoBoard3D';

interface CollectionsScreenProps {
  onBack: () => void;
  activePawnSkin: PawnSkinType;
  onSelectPawnSkin: (skin: PawnSkinType) => void;
  activeDiceSkin: DiceSkinType;
  onSelectDiceSkin: (skin: DiceSkinType) => void;
  activeBoardTheme: BoardThemeType;
  onSelectBoardTheme: (theme: BoardThemeType) => void;
}

export const CollectionsScreen: React.FC<CollectionsScreenProps> = ({
  onBack,
  activePawnSkin,
  onSelectPawnSkin,
  activeDiceSkin,
  onSelectDiceSkin,
  activeBoardTheme,
  onSelectBoardTheme,
}) => {
  const [activeTab, setActiveTab] = useState<'pawns' | 'dice' | 'themes'>('pawns');

  const pawnSkins: Array<{ id: PawnSkinType; name: string; desc: string; rarity: string }> = [
    { id: 'royalGold', name: 'Royal 24K Gold', desc: 'Burnished imperial gold with ornate crest and gilded trim', rarity: 'Legendary' },
    { id: 'neon', name: 'Cyber Neon', desc: 'Emissive cyber matrix with glowing pulse rings', rarity: 'Epic' },
    { id: 'crystal', name: 'Crystal Ice', desc: 'Translucent frosted glass with prism refraction', rarity: 'Rare' },
    { id: 'diamond', name: 'Diamond Gloss', desc: 'Faceted geometric luster with diamond cuts', rarity: 'Epic' },
    { id: 'classic', name: 'Classic Resin', desc: 'Traditional tournament physical polished finish', rarity: 'Standard' },
  ];

  const diceSkins: Array<{ id: DiceSkinType; name: string; desc: string; rarity: string }> = [
    { id: 'royal', name: 'Royal Emperor', desc: 'Midnight sapphire cube with burnished gold leaf pips', rarity: 'Legendary' },
    { id: 'gold', name: 'Solid Gold 24K', desc: 'Solid cast gold cube with blood ruby pips', rarity: 'Legendary' },
    { id: 'neon', name: 'Neon Pulse', desc: 'Matte dark carbon with emerald glowing pips', rarity: 'Epic' },
    { id: 'crystal', name: 'Crystal Prism', desc: 'Semitransparent optical glass with sapphire pips', rarity: 'Rare' },
    { id: 'classic', name: 'Classic Ivory', desc: 'Glossy ivory beveled cube with obsidian pips', rarity: 'Standard' },
  ];

  const boardThemes: Array<{ id: BoardThemeType; name: string; desc: string; previewColor: string }> = [
    { id: 'midnightGold', name: 'Midnight Gold', desc: 'Luxury obsidian stone with 24K chamfered gold rim', previewColor: 'from-[#FFE082] to-[#B45309]' },
    { id: 'royalNavy', name: 'Royal Navy', desc: 'Deep maritime blue with polished silver bezels', previewColor: 'from-[#93C5FD] to-[#1E3A8A]' },
    { id: 'emeraldEmpire', name: 'Emerald Empire', desc: 'Lush jade marble with warm bronze border', previewColor: 'from-[#A7F3D0] to-[#064E3B]' },
    { id: 'classicWood', name: 'Classic Wood', desc: 'Warm mahogany wood grain with brass corner studs', previewColor: 'from-[#FBBF24] to-[#78350F]' },
  ];

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
        <span className="font-bold text-base text-amber-400">Collections & Skins</span>
        <div className="w-9" />
      </div>

      {/* Tabs */}
      <div className="p-4 pb-2">
        <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('pawns')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'pawns'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            Pawns
          </button>
          <button
            onClick={() => setActiveTab('dice')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'dice'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Dices className="w-3.5 h-3.5" />
            Dice
          </button>
          <button
            onClick={() => setActiveTab('themes')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'themes'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            Themes
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* PAWNS TAB */}
        {activeTab === 'pawns' && (
          <div className="space-y-3">
            {pawnSkins.map((skin) => {
              const isEquipped = activePawnSkin === skin.id;
              return (
                <div
                  key={skin.id}
                  onClick={() => onSelectPawnSkin(skin.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                    isEquipped
                      ? 'bg-gradient-to-r from-slate-900 to-slate-900/90 border-amber-400/80 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Pawn 3D Live Preview */}
                  <div className="w-16 h-20 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center p-1">
                    <Pawn3D color="red" skin={skin.id} size={32} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-white truncate">{skin.name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          skin.rarity === 'Legendary'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : skin.rarity === 'Epic'
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                        }`}
                      >
                        {skin.rarity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{skin.desc}</p>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col items-end">
                    {isEquipped ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <Check className="w-3.5 h-3.5" /> Equipped
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400 hover:text-amber-400">
                        Equip
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* DICE TAB */}
        {activeTab === 'dice' && (
          <div className="space-y-3">
            {diceSkins.map((skin) => {
              const isEquipped = activeDiceSkin === skin.id;
              return (
                <div
                  key={skin.id}
                  onClick={() => onSelectDiceSkin(skin.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                    isEquipped
                      ? 'bg-gradient-to-r from-slate-900 to-slate-900/90 border-amber-400/80 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Dice 3D Live Preview */}
                  <div className="w-16 h-20 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center p-1">
                    <Dice3D value={6} skin={skin.id} size={42} isEnabled={false} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-white truncate">{skin.name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          skin.rarity === 'Legendary'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : skin.rarity === 'Epic'
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                        }`}
                      >
                        {skin.rarity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{skin.desc}</p>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col items-end">
                    {isEquipped ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <Check className="w-3.5 h-3.5" /> Equipped
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400 hover:text-amber-400">
                        Equip
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* BOARD THEMES TAB */}
        {activeTab === 'themes' && (
          <div className="space-y-3">
            {boardThemes.map((theme) => {
              const isEquipped = activeBoardTheme === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => onSelectBoardTheme(theme.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                    isEquipped
                      ? 'bg-gradient-to-r from-slate-900 to-slate-900/90 border-amber-400/80 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Theme Preview Color swatch */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${theme.previewColor} border-2 border-slate-700 p-1 flex items-center justify-center shadow-md`}>
                    <div className="w-10 h-10 rounded-lg bg-slate-950/60 border border-white/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-sm text-white block mb-1">{theme.name}</span>
                    <p className="text-xs text-slate-400 line-clamp-2">{theme.desc}</p>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col items-end">
                    {isEquipped ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <Check className="w-3.5 h-3.5" /> Equipped
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400 hover:text-amber-400">
                        Select
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
