import 'dart:math';
import '../game/engine/ludo_engine.dart';
import '../game/models/game_models.dart';

/// Intelligent AI Decision Maker with 3 difficulty modes: Easy, Medium, Hard
class AIPlayerEngine {
  final AIDifficulty difficulty;
  final Random _random = Random();

  AIPlayerEngine({this.difficulty = AIDifficulty.medium});

  /// Evaluates legal moves and selects the best token to move
  LudoTokenModel? chooseMove({
    required LudoEngine engine,
    required List<LudoMove> legalMoves,
  }) {
    if (legalMoves.isEmpty) return null;
    if (legalMoves.length == 1) return legalMoves.first.token;

    switch (difficulty) {
      case AIDifficulty.easy:
        return _chooseEasy(legalMoves);
      case AIDifficulty.medium:
        return _chooseMedium(engine, legalMoves);
      case AIDifficulty.hard:
        return _chooseHard(engine, legalMoves);
    }
  }

  /// Easy AI: Mostly random legal choice with a slight preference to leave home
  LudoTokenModel _chooseEasy(List<LudoMove> legalMoves) {
    // 60% random choice, 40% leave home or capture if available
    if (_random.nextDouble() < 0.4) {
      final leaveHome = legalMoves.where((m) => m.token.isAtHome).firstOrNull;
      if (leaveHome != null) return leaveHome.token;
    }
    return legalMoves[_random.nextInt(legalMoves.length)].token;
  }

  /// Medium AI: Captures enemy pieces, prioritizes finishing, moves tokens out of home
  LudoTokenModel _chooseMedium(LudoEngine engine, List<LudoMove> legalMoves) {
    // 1. Finish token if possible
    final finishMove = legalMoves.where((m) => m.isFinishing).firstOrNull;
    if (finishMove != null) return finishMove.token;

    // 2. Capture opponent if possible
    final captureMove = legalMoves.where((m) => m.isCapture).firstOrNull;
    if (captureMove != null) return captureMove.token;

    // 3. Move token out of home on 6
    final leaveHomeMove = legalMoves.where((m) => m.token.isAtHome).firstOrNull;
    if (leaveHomeMove != null) return leaveHomeMove.token;

    // 4. Enter safe star
    final safeMove = legalMoves.where((m) => 
      m.targetTrackPosition != -1 && LudoBoardPath.isSafeTrackIndex(m.targetTrackPosition)
    ).firstOrNull;
    if (safeMove != null) return safeMove.token;

    // 5. Advance furthest token
    legalMoves.sort((a, b) => b.targetTrackPosition.compareTo(a.targetTrackPosition));
    return legalMoves.first.token;
  }

  /// Hard AI: Minimax-style strategic heuristic
  /// Scores moves based on:
  /// - Capture reward (+120)
  /// - Finishing token (+150)
  /// - Reaching safe star (+80)
  /// - Escaping threat from behind (+90)
  /// - Leaving home base on 6 (+70)
  /// - Advancing into home stretch (+60)
  /// - Penalty for moving into threat zone without safe star (-50)
  LudoTokenModel _chooseHard(LudoEngine engine, List<LudoMove> legalMoves) {
    LudoMove bestMove = legalMoves.first;
    double highestScore = -999999;

    for (final move in legalMoves) {
      double score = 0;

      // 1. Finishing token
      if (move.isFinishing) {
        score += 180;
      }

      // 2. Captures
      if (move.isCapture) {
        score += 140;
      }

      // 3. Safe star
      if (move.targetTrackPosition != -1 && LudoBoardPath.isSafeTrackIndex(move.targetTrackPosition)) {
        score += 85;
      }

      // 4. Moving out of home base
      if (move.token.isAtHome) {
        score += 75;
      }

      // 5. Entering protected home stretch
      if (move.isEnteringHome) {
        score += 65;
      }

      // 6. Threat evaluation: was the token under threat?
      if (move.token.isOnTrack && _isTokenUnderThreat(engine, move.token.color, move.token.trackPosition)) {
        score += 90; // Escaping danger!
      }

      // 7. Danger evaluation: does this move land within 1-6 cells of an enemy behind?
      if (move.targetTrackPosition != -1 && 
          !LudoBoardPath.isSafeTrackIndex(move.targetTrackPosition) &&
          _isCellUnderThreat(engine, move.token.color, move.targetTrackPosition)) {
        score -= 45; // Moving into enemy firing line!
      }

      // 8. Progress weight (tokens closer to finishing given moderate preference)
      if (move.targetTrackPosition != -1) {
        score += (move.targetTrackPosition % 52) * 0.5;
      }

      // Add a tiny random jitter (0-2) to avoid predictable ties
      score += _random.nextDouble() * 2.0;

      if (score > highestScore) {
        highestScore = score;
        bestMove = move;
      }
    }

    return bestMove.token;
  }

  bool _isTokenUnderThreat(LudoEngine engine, LudoPlayerColor color, int trackPos) {
    if (LudoBoardPath.isSafeTrackIndex(trackPos)) return false;
    return _isCellUnderThreat(engine, color, trackPos);
  }

  bool _isCellUnderThreat(LudoEngine engine, LudoPlayerColor color, int trackPos) {
    for (final entry in engine.tokens.entries) {
      if (entry.key == color) continue;
      for (final enemy in entry.value) {
        if (enemy.isOnTrack) {
          int dist = (trackPos - enemy.trackPosition) % 52;
          if (dist < 0) dist += 52;
          if (dist >= 1 && dist <= 6) {
            return true; // Enemy is within 1 roll distance behind us!
          }
        }
      }
    }
    return false;
  }
}
