/// Global constants for JK LODU
class AppConstants {
  AppConstants._();

  static const String appName = 'JK LODU';
  static const String appTagline = 'The Ultimate Multiplayer Ludo Experience';
  static const String appVersion = '1.0.0';

  // Game Board Metrics
  static const int totalTokensPerPlayer = 4;
  static const int totalBoardCells = 52;
  static const int homeStretchLength = 5;
  static const int totalPlayersMax = 4;
  static const int turnTimeoutSeconds = 15;

  // Storage Keys
  static const String keyThemeMode = 'jk_lodu_theme_mode';
  static const String keySoundEnabled = 'jk_lodu_sound_enabled';
  static const String keyMusicEnabled = 'jk_lodu_music_enabled';
  static const String keyHapticEnabled = 'jk_lodu_haptic_enabled';
  static const String keyUserData = 'jk_lodu_user_cached';
}
