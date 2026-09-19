import 'package:flutter/material.dart';

enum PawnSkin {
  classic('Classic', 'Original physical polished resin finish', Colors.amber),
  crystal('Crystal Ice', 'Translucent frosted glass with prism refraction', Colors.cyanAccent),
  diamond('Diamond Gloss', 'Faceted specular luster with diamond sparkle', Colors.lightBlueAccent),
  neon('Cyber Neon', 'High-energy emissive tron-style neon glow', Colors.purpleAccent),
  royalGold('Royal Gold', 'Burnished 24K imperial gold with ornate crest', Color(0xFFFFD700));

  final String title;
  final String description;
  final Color accentColor;
  const PawnSkin(this.title, this.description, this.accentColor);
}

enum DiceSkin {
  classic('Classic Ivory', 'Glossy ivory beveled cube with obsidian pips'),
  royal('Royal Emperor', 'Midnight sapphire with gold foil pips'),
  crystal('Crystal Prism', 'Semitransparent optical glass with laser pips'),
  neon('Neon Pulse', 'Matte dark carbon with glowing emerald pips'),
  gold('Solid Gold 24K', 'Heated gold metallic cube with ruby pips');

  final String title;
  final String description;
  const DiceSkin(this.title, this.description);
}

enum BoardThemeMode {
  midnightGold('Midnight Gold', 'Luxury obsidian stone with 24K chamfered gold rim'),
  royalNavy('Royal Navy', 'Deep maritime blue with polished silver bezels'),
  emeraldEmpire('Emerald Empire', 'Lush jade marble with warm bronze border'),
  classicWood('Classic Wood', 'Warm mahogany wood grain with brass corner studs');

  final String title;
  final String description;
  const BoardThemeMode(this.title, this.description);
}

class CollectionsService extends ChangeNotifier {
  static final CollectionsService _instance = CollectionsService._internal();
  factory CollectionsService() => _instance;
  CollectionsService._internal();

  PawnSkin _activePawnSkin = PawnSkin.royalGold;
  DiceSkin _activeDiceSkin = DiceSkin.royal;
  BoardThemeMode _activeBoardTheme = BoardThemeMode.midnightGold;

  // Unlocked collections
  final Set<PawnSkin> _unlockedPawnSkins = {
    PawnSkin.classic,
    PawnSkin.royalGold,
    PawnSkin.crystal,
    PawnSkin.neon,
  };

  final Set<DiceSkin> _unlockedDiceSkins = {
    DiceSkin.classic,
    DiceSkin.royal,
    DiceSkin.neon,
    DiceSkin.gold,
  };

  final Set<BoardThemeMode> _unlockedBoardThemes = {
    BoardThemeMode.midnightGold,
    BoardThemeMode.royalNavy,
    BoardThemeMode.emeraldEmpire,
    BoardThemeMode.classicWood,
  };

  PawnSkin get activePawnSkin => _activePawnSkin;
  DiceSkin get activeDiceSkin => _activeDiceSkin;
  BoardThemeMode get activeBoardTheme => _activeBoardTheme;

  bool isPawnSkinUnlocked(PawnSkin skin) => _unlockedPawnSkins.contains(skin);
  bool isDiceSkinUnlocked(DiceSkin skin) => _unlockedDiceSkins.contains(skin);
  bool isBoardThemeUnlocked(BoardThemeMode theme) => _unlockedBoardThemes.contains(theme);

  void selectPawnSkin(PawnSkin skin) {
    _activePawnSkin = skin;
    notifyListeners();
  }

  void selectDiceSkin(DiceSkin skin) {
    _activeDiceSkin = skin;
    notifyListeners();
  }

  void selectBoardTheme(BoardThemeMode theme) {
    _activeBoardTheme = theme;
    notifyListeners();
  }
}
