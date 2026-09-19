import 'dart:async';
import '../core/services/logger_service.dart';
import '../game/models/game_models.dart';
import '../game/engine/ludo_engine.dart';
import 'anti_cheat_validator.dart';

enum ConnectionState {
  disconnected,
  connecting,
  connected,
  reconnecting,
}

enum MatchmakingStatus {
  idle,
  searching,
  playersFound,
  matchReady,
}

class MultiplayerService {
  static final MultiplayerService _instance = MultiplayerService._internal();
  factory MultiplayerService() => _instance;
  MultiplayerService._internal();

  ConnectionState _connectionState = ConnectionState.disconnected;
  MatchmakingStatus _matchmakingStatus = MatchmakingStatus.idle;
  String? _activeRoomCode;
  bool _isHost = false;

  final _stateController = StreamController<ConnectionState>.broadcast();
  final _matchmakingController = StreamController<MatchmakingStatus>.broadcast();

  Stream<ConnectionState> get connectionStateStream => _stateController.stream;
  Stream<MatchmakingStatus> get matchmakingStream => _matchmakingController.stream;

  ConnectionState get connectionState => _connectionState;
  MatchmakingStatus get matchmakingStatus => _matchmakingStatus;
  String? get activeRoomCode => _activeRoomCode;
  bool get isHost => _isHost;

  /// Quick Play Matchmaking simulation with realistic network handshake states
  Future<void> startQuickPlayMatchmaking({
    required int playerCount,
    required Function(List<PlayerInfo> matchedPlayers) onMatchFound,
  }) async {
    _matchmakingStatus = MatchmakingStatus.searching;
    _matchmakingController.add(_matchmakingStatus);
    LoggerService.i('QuickPlay: Searching for $playerCount players...');

    // Finding players delay
    await Future.delayed(const Duration(milliseconds: 1400));
    _matchmakingStatus = MatchmakingStatus.playersFound;
    _matchmakingController.add(_matchmakingStatus);

    await Future.delayed(const Duration(milliseconds: 900));
    _matchmakingStatus = MatchmakingStatus.matchReady;
    _matchmakingController.add(_matchmakingStatus);

    final players = <PlayerInfo>[
      const PlayerInfo(
        id: 'usr_you',
        name: 'Alex Rivers',
        color: LudoPlayerColor.red,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
        isHost: true,
        isYou: true,
      ),
      const PlayerInfo(
        id: 'usr_rahat',
        name: 'Rahat',
        color: LudoPlayerColor.green,
        avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100',
      ),
    ];

    if (playerCount >= 3) {
      players.add(const PlayerInfo(
        id: 'usr_sami',
        name: 'Sami',
        color: LudoPlayerColor.yellow,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      ));
    }

    if (playerCount == 4) {
      players.add(const PlayerInfo(
        id: 'usr_tania',
        name: 'Tania',
        color: LudoPlayerColor.blue,
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      ));
    }

    _connectionState = ConnectionState.connected;
    _stateController.add(_connectionState);
    onMatchFound(players);
  }

  /// Create Private Room with unique 6-character room code (e.g. JK7L9P)
  String createPrivateRoom({required int maxPlayers, required int entryFee}) {
    final chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    final random = DateTime.now().millisecondsSinceEpoch;
    String code = 'JK';
    for (int i = 0; i < 4; i++) {
      code += chars[(random ~/ (i + 1) * 7) % chars.length];
    }
    _activeRoomCode = code;
    _isHost = true;
    _connectionState = ConnectionState.connected;
    LoggerService.i('Created private room: $_activeRoomCode');
    return _activeRoomCode!;
  }

  /// Dispatch action through server validation pipeline
  Future<bool> dispatchAction({
    required String actionType,
    required Map<String, dynamic> payload,
    required LudoEngine engine,
  }) async {
    if (actionType == 'ROLL_DICE') {
      final senderId = payload['senderId'] as String;
      final validation = AntiCheatValidator.validateRollAction(
        engine: engine,
        senderPlayerId: senderId,
      );
      if (!validation.isValid) {
        LoggerService.w('Action validation failed: ${validation.message}');
        return false;
      }
      engine.rollDice();
      return true;
    } else if (actionType == 'MOVE_TOKEN') {
      final senderId = payload['senderId'] as String;
      final tokenId = payload['tokenId'] as String;
      final validation = AntiCheatValidator.validateMoveAction(
        engine: engine,
        senderPlayerId: senderId,
        tokenId: tokenId,
      );
      if (!validation.isValid) {
        LoggerService.w('Action validation failed: ${validation.message}');
        return false;
      }
      final token = engine.activePlayerTokens.firstWhere((t) => t.id == tokenId);
      return engine.executeMove(token);
    }
    return false;
  }

  void leaveRoom() {
    _activeRoomCode = null;
    _isHost = false;
    _connectionState = ConnectionState.disconnected;
    _matchmakingStatus = MatchmakingStatus.idle;
    _stateController.add(_connectionState);
    _matchmakingController.add(_matchmakingStatus);
  }
}
