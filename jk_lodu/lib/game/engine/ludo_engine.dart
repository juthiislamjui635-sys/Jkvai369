import 'dart:math';
import '../models/game_models.dart';

enum GamePhase {
  waitingForRoll,
  waitingForMove,
  movingToken,
  turnEnded,
  gameOver,
}

enum AIDifficulty {
  easy,
  medium,
  hard,
}

class LudoMove {
  final LudoTokenModel token;
  final int diceValue;
  final TokenState targetState;
  final int targetTrackPosition;
  final int targetHomeStretchPosition;
  final bool isCapture;
  final bool isEnteringHome;
  final bool isFinishing;

  const LudoMove({
    required this.token,
    required this.diceValue,
    required this.targetState,
    required this.targetTrackPosition,
    required this.targetHomeStretchPosition,
    this.isCapture = false,
    this.isEnteringHome = false,
    this.isFinishing = false,
  });
}

class GameResult {
  final bool isGameOver;
  final PlayerInfo? winner;
  final List<PlayerInfo> standings;
  final Duration matchDuration;

  const GameResult({
    required this.isGameOver,
    this.winner,
    this.standings = const [],
    this.matchDuration = Duration.zero,
  });
}

/// Headless, fully unit-testable Ludo Game Engine
class LudoEngine {
  final List<PlayerInfo> players;
  final Map<LudoPlayerColor, List<LudoTokenModel>> tokens;
  
  int _currentTurnIndex = 0;
  int _currentDiceValue = 1;
  bool _hasRolledDice = false;
  GamePhase _phase = GamePhase.waitingForRoll;
  int _consecutiveSixes = 0;
  final Random _random = Random();
  final DateTime _startTime = DateTime.now();
  PlayerInfo? _winner;
  final List<PlayerInfo> _finishedRankings = [];

  LudoEngine({
    required this.players,
    Map<LudoPlayerColor, List<LudoTokenModel>>? initialTokens,
  }) : tokens = initialTokens ?? _createDefaultTokens(players);

  static Map<LudoPlayerColor, List<LudoTokenModel>> _createDefaultTokens(List<PlayerInfo> playerList) {
    final map = <LudoPlayerColor, List<LudoTokenModel>>{};
    for (final player in playerList) {
      map[player.color] = List.generate(4, (i) {
        return LudoTokenModel(
          id: '${player.color.name}_$i',
          color: player.color,
          index: i,
          state: TokenState.home,
        );
      });
    }
    return map;
  }

  // Getters
  PlayerInfo get activePlayer => players[_currentTurnIndex];
  int get currentDiceValue => _currentDiceValue;
  bool get hasRolledDice => _hasRolledDice;
  GamePhase get phase => _phase;
  PlayerInfo? get winner => _winner;
  bool get isGameOver => _winner != null;

  List<LudoTokenModel> get activePlayerTokens => tokens[activePlayer.color] ?? [];

  /// Roll the dice with authentic rules:
  /// - 1 to 6
  /// - 3 consecutive 6s forfeits turn
  int rollDice({int? forcedValue}) {
    if (_phase != GamePhase.waitingForRoll && _phase != GamePhase.turnEnded) {
      return _currentDiceValue;
    }

    _currentDiceValue = forcedValue ?? (_random.nextInt(6) + 1);
    _hasRolledDice = true;

    if (_currentDiceValue == 6) {
      _consecutiveSixes++;
      if (_consecutiveSixes >= 3) {
        // Penalty: three sixes in a row loses turn
        _consecutiveSixes = 0;
        _phase = GamePhase.turnEnded;
        passTurn();
        return _currentDiceValue;
      }
    } else {
      _consecutiveSixes = 0;
    }

    // Check legal moves
    final moves = getLegalMoves(activePlayer.color, _currentDiceValue);
    if (moves.isEmpty) {
      // Auto-pass if no move is possible
      _phase = GamePhase.turnEnded;
      passTurn();
    } else {
      _phase = GamePhase.waitingForMove;
      _markMovableTokens(moves);
    }

    return _currentDiceValue;
  }

  void _markMovableTokens(List<LudoMove> legalMoves) {
    for (final token in activePlayerTokens) {
      token.isMovable = legalMoves.any((m) => m.token.id == token.id);
    }
  }

  /// Calculates legal moves for a given player and dice value
  List<LudoMove> getLegalMoves(LudoPlayerColor color, int diceVal) {
    final playerTokens = tokens[color];
    if (playerTokens == null) return [];

    final legalMoves = <LudoMove>[];
    final player = players.firstWhere((p) => p.color == color);

    for (final token in playerTokens) {
      if (token.isFinished) continue;

      if (token.isAtHome) {
        // Can only leave base on a 6
        if (diceVal == 6) {
          final startIdx = player.startTrackIndex;
          legalMoves.add(LudoMove(
            token: token,
            diceValue: diceVal,
            targetState: TokenState.onTrack,
            targetTrackPosition: startIdx,
            targetHomeStretchPosition: -1,
            isEnteringHome: false,
          ));
        }
      } else if (token.isOnTrack) {
        final currentPos = token.trackPosition;
        final entrance = player.homeEntranceTrackIndex;

        // Calculate distance to entrance
        int distToEntrance = (entrance - currentPos) % 52;
        if (distToEntrance < 0) distToEntrance += 52;

        if (diceVal <= distToEntrance) {
          // Stays on main track
          final newPos = (currentPos + diceVal) % 52;
          final isCapture = _isCellEnemyOccupiedAndCapturable(color, newPos);

          legalMoves.add(LudoMove(
            token: token,
            diceValue: diceVal,
            targetState: TokenState.onTrack,
            targetTrackPosition: newPos,
            targetHomeStretchPosition: -1,
            isCapture: isCapture,
          ));
        } else {
          // Enters home stretch
          final stretchSteps = diceVal - distToEntrance - 1;
          if (stretchSteps <= 5) {
            final isFinishing = stretchSteps == 5;
            legalMoves.add(LudoMove(
              token: token,
              diceValue: diceVal,
              targetState: isFinishing ? TokenState.finished : TokenState.homeStretch,
              targetTrackPosition: -1,
              targetHomeStretchPosition: stretchSteps,
              isEnteringHome: true,
              isFinishing: isFinishing,
            ));
          }
        }
      } else if (token.isInHomeStretch) {
        final currentStretch = token.homeStretchPosition;
        final targetStretch = currentStretch + diceVal;

        if (targetStretch == 5) {
          // Exact roll to finish!
          legalMoves.add(LudoMove(
            token: token,
            diceValue: diceVal,
            targetState: TokenState.finished,
            targetTrackPosition: -1,
            targetHomeStretchPosition: 5,
            isFinishing: true,
          ));
        } else if (targetStretch < 5) {
          // Move forward inside home stretch
          legalMoves.add(LudoMove(
            token: token,
            diceValue: diceVal,
            targetState: TokenState.homeStretch,
            targetTrackPosition: -1,
            targetHomeStretchPosition: targetStretch,
          ));
        }
        // If targetStretch > 5, cannot overshoot finish
      }
    }

    return legalMoves;
  }

  bool _isCellEnemyOccupiedAndCapturable(LudoPlayerColor currentColor, int trackPos) {
    if (LudoBoardPath.isSafeTrackIndex(trackPos)) {
      return false; // Safe star protection!
    }

    for (final entry in tokens.entries) {
      if (entry.key == currentColor) continue;
      for (final enemyToken in entry.value) {
        if (enemyToken.isOnTrack && enemyToken.trackPosition == trackPos) {
          return true;
        }
      }
    }
    return false;
  }

  /// Execute a move on a chosen token
  bool executeMove(LudoTokenModel token) {
    if (_phase != GamePhase.waitingForMove) return false;

    final legalMoves = getLegalMoves(activePlayer.color, _currentDiceValue);
    final chosenMove = legalMoves.where((m) => m.token.id == token.id).firstOrNull;

    if (chosenMove == null) return false;

    _phase = GamePhase.movingToken;

    // Apply move updates
    token.state = chosenMove.targetState;
    token.trackPosition = chosenMove.targetTrackPosition;
    token.homeStretchPosition = chosenMove.targetHomeStretchPosition;

    // Clear movable flags
    for (final t in activePlayerTokens) {
      t.isMovable = false;
      t.isSelected = false;
    }

    bool earnedBonusTurn = _currentDiceValue == 6;

    // Handle captures
    if (chosenMove.isCapture) {
      earnedBonusTurn = true; // Bonus turn for capturing an opponent!
      _captureEnemyAtCell(activePlayer.color, chosenMove.targetTrackPosition);
    }

    // Check if player won
    if (_checkPlayerWon(activePlayer.color)) {
      if (!_finishedRankings.contains(activePlayer)) {
        _finishedRankings.add(activePlayer);
        if (_winner == null) {
          _winner = activePlayer;
        }
      }
      if (_finishedRankings.length >= players.length - 1) {
        _phase = GamePhase.gameOver;
        return true;
      }
    }

    // Pass turn or award bonus turn
    if (earnedBonusTurn) {
      _phase = GamePhase.waitingForRoll;
      _hasRolledDice = false;
    } else {
      _phase = GamePhase.turnEnded;
      passTurn();
    }

    return true;
  }

  void _captureEnemyAtCell(LudoPlayerColor attackerColor, int trackPos) {
    for (final entry in tokens.entries) {
      if (entry.key == attackerColor) continue;
      for (final enemyToken in entry.value) {
        if (enemyToken.isOnTrack && enemyToken.trackPosition == trackPos) {
          // Return enemy piece to base!
          enemyToken.state = TokenState.home;
          enemyToken.trackPosition = -1;
          enemyToken.homeStretchPosition = -1;
        }
      }
    }
  }

  bool _checkPlayerWon(LudoPlayerColor color) {
    final playerTokens = tokens[color];
    if (playerTokens == null) return false;
    return playerTokens.every((t) => t.isFinished);
  }

  void passTurn() {
    _consecutiveSixes = 0;
    _hasRolledDice = false;

    // Advance to next active player
    int attempts = 0;
    do {
      _currentTurnIndex = (_currentTurnIndex + 1) % players.length;
      attempts++;
    } while (_checkPlayerWon(players[_currentTurnIndex].color) && attempts < players.length);

    _phase = GamePhase.waitingForRoll;

    // Clear all token movable states
    for (final list in tokens.values) {
      for (final t in list) {
        t.isMovable = false;
        t.isSelected = false;
      }
    }
  }

  GameResult getResult() {
    return GameResult(
      isGameOver: isGameOver,
      winner: _winner,
      standings: _finishedRankings,
      matchDuration: DateTime.now().difference(_startTime),
    );
  }
}
