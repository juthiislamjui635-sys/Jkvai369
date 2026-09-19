import 'package:flutter/services.dart';
import 'package:audioplayers/audioplayers.dart';
import '../core/services/logger_service.dart';

enum SoundEffect {
  buttonClick,
  diceRoll,
  tokenMove,
  tokenCapture,
  safeCell,
  tokenFinish,
  victoryFanfare,
  notification,
}

class AudioManager {
  static final AudioManager _instance = AudioManager._internal();
  factory AudioManager() => _instance;
  AudioManager._internal();

  final AudioPlayer _sfxPlayer = AudioPlayer();
  final AudioPlayer _musicPlayer = AudioPlayer();

  bool _isSoundEnabled = true;
  bool _isMusicEnabled = true;
  bool _isVibrationEnabled = true;

  bool get isSoundEnabled => _isSoundEnabled;
  bool get isMusicEnabled => _isMusicEnabled;
  bool get isVibrationEnabled => _isVibrationEnabled;

  void setSoundEnabled(bool enabled) {
    _isSoundEnabled = enabled;
  }

  void setMusicEnabled(bool enabled) {
    _isMusicEnabled = enabled;
    if (!_isMusicEnabled) {
      _musicPlayer.stop();
    }
  }

  void setVibrationEnabled(bool enabled) {
    _isVibrationEnabled = enabled;
  }

  /// Play sound effects safely with fallback handling
  Future<void> playSound(SoundEffect effect) async {
    if (!_isSoundEnabled) return;

    try {
      // Trigger appropriate haptic feedback alongside audio
      if (_isVibrationEnabled) {
        switch (effect) {
          case SoundEffect.buttonClick:
            HapticFeedback.lightImpact();
            break;
          case SoundEffect.diceRoll:
            HapticFeedback.mediumImpact();
            break;
          case SoundEffect.tokenMove:
            HapticFeedback.selectionClick();
            break;
          case SoundEffect.tokenCapture:
          case SoundEffect.victoryFanfare:
            HapticFeedback.heavyImpact();
            break;
          case SoundEffect.safeCell:
          case SoundEffect.tokenFinish:
            HapticFeedback.mediumImpact();
            break;
          case SoundEffect.notification:
            HapticFeedback.lightImpact();
            break;
        }
      }

      String assetPath = '';
      switch (effect) {
        case SoundEffect.buttonClick:
          assetPath = 'audio/sfx_click.mp3';
          break;
        case SoundEffect.diceRoll:
          assetPath = 'audio/sfx_dice_roll.mp3';
          break;
        case SoundEffect.tokenMove:
          assetPath = 'audio/sfx_pawn_hop.mp3';
          break;
        case SoundEffect.tokenCapture:
          assetPath = 'audio/sfx_capture.mp3';
          break;
        case SoundEffect.safeCell:
          assetPath = 'audio/sfx_safe_star.mp3';
          break;
        case SoundEffect.tokenFinish:
          assetPath = 'audio/sfx_finish.mp3';
          break;
        case SoundEffect.victoryFanfare:
          assetPath = 'audio/sfx_victory.mp3';
          break;
        case SoundEffect.notification:
          assetPath = 'audio/sfx_notification.mp3';
          break;
      }

      // Safe playback: in dev/testing where audio files might be bundled or mocked
      await _sfxPlayer.stop();
      await _sfxPlayer.play(AssetSource(assetPath));
    } catch (e) {
      // Audio playback fails gracefully if assets are not present in headless environments
      LoggerService.d('Audio play skipped or unsupported: $e');
    }
  }

  Future<void> playBackgroundMusic({bool loop = true}) async {
    if (!_isMusicEnabled) return;
    try {
      await _musicPlayer.setReleaseMode(loop ? ReleaseMode.loop : ReleaseMode.release);
      await _musicPlayer.play(AssetSource('audio/bgm_ambient_table.mp3'), volume: 0.35);
    } catch (e) {
      LoggerService.d('BGM play skipped or unsupported: $e');
    }
  }

  void stopBackgroundMusic() {
    try {
      _musicPlayer.stop();
    } catch (e) {
      LoggerService.d('BGM stop error: $e');
    }
  }

  void dispose() {
    _sfxPlayer.dispose();
    _musicPlayer.dispose();
  }
}
