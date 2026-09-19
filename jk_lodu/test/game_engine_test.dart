import 'package:flutter_test/flutter_test.dart';
import 'package:jk_lodu/game/engine/ludo_engine.dart';
import 'package:jk_lodu/game/models/game_models.dart';
import 'package:jk_lodu/ai/ai_player_engine.dart';

void main() {
  group('JK LODU Game Engine Unit Tests', () {
    late List<PlayerInfo> players;
    late LudoEngine engine;

    setUp(() {
      players = [
        const PlayerInfo(id: 'p1', name: 'Alex', color: LudoPlayerColor.red, isYou: true),
        const PlayerInfo(id: 'p2', name: 'Rahat', color: LudoPlayerColor.green),
        const PlayerInfo(id: 'p3', name: 'Sami', color: LudoPlayerColor.yellow),
        const PlayerInfo(id: 'p4', name: 'Tania', color: LudoPlayerColor.blue),
      ];
      engine = LudoEngine(players: players);
    });

    test('Initial state has 4 players and all tokens at home', () {
      expect(engine.players.length, 4);
      expect(engine.activePlayer.color, LudoPlayerColor.red);
      expect(engine.phase, GamePhase.waitingForRoll);

      for (final player in players) {
        final tokens = engine.tokens[player.color]!;
        expect(tokens.length, 4);
        expect(tokens.every((t) => t.isAtHome), isTrue);
      }
    });

    test('Rolling non-6 when all tokens are at home yields no legal moves and passes turn', () {
      engine.rollDice(forcedValue: 4);
      expect(engine.currentDiceValue, 4);
      // Because no moves were possible, the engine automatically passes turn
      expect(engine.activePlayer.color, LudoPlayerColor.green);
      expect(engine.phase, GamePhase.waitingForRoll);
    });

    test('Rolling 6 allows token to leave home to starting cell (index 1 for Red)', () {
      engine.rollDice(forcedValue: 6);
      expect(engine.phase, GamePhase.waitingForMove);

      final legalMoves = engine.getLegalMoves(LudoPlayerColor.red, 6);
      expect(legalMoves.length, 4);
      expect(legalMoves.first.targetTrackPosition, 1);

      final tokenToMove = engine.tokens[LudoPlayerColor.red]!.first;
      final success = engine.executeMove(tokenToMove);

      expect(success, isTrue);
      expect(tokenToMove.isOnTrack, isTrue);
      expect(tokenToMove.trackPosition, 1);
      // Rolling 6 grants a bonus turn!
      expect(engine.activePlayer.color, LudoPlayerColor.red);
      expect(engine.phase, GamePhase.waitingForRoll);
    });

    test('Token moves forward on track by dice amount', () {
      // Setup token on track at position 1
      final redToken = engine.tokens[LudoPlayerColor.red]!.first;
      redToken.state = TokenState.onTrack;
      redToken.trackPosition = 1;

      engine.rollDice(forcedValue: 3);
      final legalMoves = engine.getLegalMoves(LudoPlayerColor.red, 3);
      final move = legalMoves.firstWhere((m) => m.token.id == redToken.id);
      expect(move.targetTrackPosition, 4);

      engine.executeMove(redToken);
      expect(redToken.trackPosition, 4);
      // Turn passes after non-6 move
      expect(engine.activePlayer.color, LudoPlayerColor.green);
    });

    test('Capturing an opponent returns their token to home base and awards bonus turn', () {
      final redToken = engine.tokens[LudoPlayerColor.red]!.first;
      redToken.state = TokenState.onTrack;
      redToken.trackPosition = 4;

      final greenToken = engine.tokens[LudoPlayerColor.green]!.first;
      greenToken.state = TokenState.onTrack;
      greenToken.trackPosition = 7; // Non-safe regular track cell

      engine.rollDice(forcedValue: 3); // 4 + 3 = 7 (lands on Green!)
      final legalMoves = engine.getLegalMoves(LudoPlayerColor.red, 3);
      final captureMove = legalMoves.firstWhere((m) => m.token.id == redToken.id);

      expect(captureMove.isCapture, isTrue);
      engine.executeMove(redToken);

      expect(redToken.trackPosition, 7);
      expect(greenToken.isAtHome, isTrue);
      expect(greenToken.trackPosition, -1);
      // Capture awards bonus turn!
      expect(engine.activePlayer.color, LudoPlayerColor.red);
    });

    test('Safe star cell prevents capture', () {
      final redToken = engine.tokens[LudoPlayerColor.red]!.first;
      redToken.state = TokenState.onTrack;
      redToken.trackPosition = 5;

      final greenToken = engine.tokens[LudoPlayerColor.green]!.first;
      greenToken.state = TokenState.onTrack;
      greenToken.trackPosition = 8; // Cell 8 is a Safe Star!

      engine.rollDice(forcedValue: 3);
      final legalMoves = engine.getLegalMoves(LudoPlayerColor.red, 3);
      final move = legalMoves.firstWhere((m) => m.token.id == redToken.id);

      expect(move.isCapture, isFalse); // Safe star protects green!
    });

    test('AI Player Engine generates valid decisions', () {
      final easyAI = AIPlayerEngine(difficulty: AIDifficulty.easy);
      final medAI = AIPlayerEngine(difficulty: AIDifficulty.medium);
      final hardAI = AIPlayerEngine(difficulty: AIDifficulty.hard);

      engine.rollDice(forcedValue: 6);
      final moves = engine.getLegalMoves(LudoPlayerColor.red, 6);

      final easyChoice = easyAI.chooseMove(engine: engine, legalMoves: moves);
      final medChoice = medAI.chooseMove(engine: engine, legalMoves: moves);
      final hardChoice = hardAI.chooseMove(engine: engine, legalMoves: moves);

      expect(easyChoice, isNotNull);
      expect(medChoice, isNotNull);
      expect(hardChoice, isNotNull);
    });
  });
}
