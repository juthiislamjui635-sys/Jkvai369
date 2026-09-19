import '../game/models/game_models.dart';
import '../game/engine/ludo_engine.dart';
import '../core/services/logger_service.dart';

enum ValidationErrorCode {
  notPlayersTurn,
  diceNotRolled,
  invalidDiceValue,
  invalidTokenMove,
  illegalCellTarget,
  illegalCaptureAttempt,
  tamperedState,
}

class ValidationResult {
  final bool isValid;
  final ValidationErrorCode? errorCode;
  final String? message;

  const ValidationResult.valid() : isValid = true, errorCode = null, message = null;
  const ValidationResult.invalid(this.errorCode, this.message) : isValid = false;
}

/// Server/Trusted Host Anti-Cheat Validator
/// Ensures clients cannot spoof turns, fake dice rolls, jump across illegal board coordinates,
/// or grant unauthorized victories.
class AntiCheatValidator {
  AntiCheatValidator._();

  /// Validates a roll action request
  static ValidationResult validateRollAction({
    required LudoEngine engine,
    required String senderPlayerId,
  }) {
    if (engine.activePlayer.id != senderPlayerId) {
      LoggerService.w('AntiCheat: Action rejected! Not player $senderPlayerId turn.');
      return const ValidationResult.invalid(
        ValidationErrorCode.notPlayersTurn,
        'Action rejected: It is not your turn to roll.',
      );
    }

    if (engine.phase != GamePhase.waitingForRoll) {
      LoggerService.w('AntiCheat: Dice already rolled or turn is in invalid phase.');
      return const ValidationResult.invalid(
        ValidationErrorCode.diceNotRolled,
        'Action rejected: Dice has already been rolled for this turn.',
      );
    }

    return const ValidationResult.valid();
  }

  /// Validates a move action request
  static ValidationResult validateMoveAction({
    required LudoEngine engine,
    required String senderPlayerId,
    required String tokenId,
  }) {
    if (engine.activePlayer.id != senderPlayerId) {
      return const ValidationResult.invalid(
        ValidationErrorCode.notPlayersTurn,
        'Action rejected: You cannot move when it is not your turn.',
      );
    }

    if (engine.phase != GamePhase.waitingForMove) {
      return const ValidationResult.invalid(
        ValidationErrorCode.diceNotRolled,
        'Action rejected: You must roll the dice before selecting a token.',
      );
    }

    final legalMoves = engine.getLegalMoves(engine.activePlayer.color, engine.currentDiceValue);
    final targetMove = legalMoves.where((m) => m.token.id == tokenId).firstOrNull;

    if (targetMove == null) {
      LoggerService.w('AntiCheat: Illegal move detected for token $tokenId!');
      return const ValidationResult.invalid(
        ValidationErrorCode.invalidTokenMove,
        'Action rejected: The requested move violates Ludo movement rules.',
      );
    }

    // Check safe star capture rule
    if (targetMove.isCapture && LudoBoardPath.isSafeTrackIndex(targetMove.targetTrackPosition)) {
      return const ValidationResult.invalid(
        ValidationErrorCode.illegalCaptureAttempt,
        'Action rejected: Capturing on a safe star cell is strictly forbidden.',
      );
    }

    return const ValidationResult.valid();
  }
}
