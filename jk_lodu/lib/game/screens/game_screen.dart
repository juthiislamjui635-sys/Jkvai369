import 'dart:async';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../models/game_models.dart';
import '../widgets/dice_3d_widget.dart';
import '../widgets/game_controls_bar.dart';
import '../widgets/game_player_card.dart';
import '../widgets/ludo_board_3d.dart';
import '../widgets/turn_indicator_widget.dart';

/// Premium JK LODU Game Screen
/// Features:
/// - 3D Ludo board with gold bezel and glossy player home bases
/// - 3D physical pawn tokens with realistic specular lighting and contact shadows
/// - Animated step-by-step token hops with elevation & tilt
/// - 3D physics dice with multi-axis rotation and bounce
/// - Turn timer with glowing "YOUR TURN" indicator
/// - Player cards with custom avatars and crown icons
/// - Bottom game controls bar with sound/music/chat/leave utilities
/// - Responsive layout for both phones and tablets
class GameScreen extends StatefulWidget {
  const GameScreen({super.key});

  @override
  State<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends State<GameScreen> with TickerProviderStateMixin {
  // Players
  late List<PlayerInfo> _players;
  int _currentTurnIndex = 0; // 0 = You (Red), 1 = Opponent (Green)

  // Dice state
  int _diceValue = 6;
  bool _isDiceRolling = false;
  bool _hasRolled = false;

  // Tokens state: 4 tokens for Red, 4 tokens for Green, 4 for Blue, 4 for Yellow
  late List<LudoTokenModel> _tokens;

  // Token Movement Animation State
  String? _activeMovingTokenId;
  double _movingTokenElevation = 0.0;
  double _movingTokenRotation = 0.0;
  BoardCoordinate? _movingTokenCoordinate;
  bool _isTokenMoving = false;

  // Turn Timer
  Timer? _turnTimer;
  int _turnTimeRemaining = 15;

  // Sound & Music Toggles
  bool _soundEnabled = true;
  bool _musicEnabled = true;

  @override
  void initState() {
    super.initState();
    _initGame();
  }

  void _initGame() {
    _players = const [
      PlayerInfo(
        id: 'user_p1',
        name: 'You',
        color: LudoPlayerColor.red,
        isYou: true,
        isHost: true,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        level: 8,
      ),
      PlayerInfo(
        id: 'opp_p2',
        name: 'Rahat',
        color: LudoPlayerColor.green,
        avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
        level: 6,
      ),
      PlayerInfo(
        id: 'opp_p3',
        name: 'Tanvir',
        color: LudoPlayerColor.yellow,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        level: 7,
      ),
      PlayerInfo(
        id: 'opp_p4',
        name: 'Amina',
        color: LudoPlayerColor.blue,
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        level: 5,
      ),
    ];

    // Initialize 4 tokens for each player
    _tokens = [];
    for (final p in _players) {
      for (int i = 0; i < 4; i++) {
        _tokens.add(
          LudoTokenModel(
            id: '${p.color.name}_t$i',
            color: p.color,
            index: i,
            state: TokenState.home,
          ),
        );
      }
    }

    // Place one token of each active player on track for instant gameplay engagement!
    _tokens[0].state = TokenState.onTrack;
    _tokens[0].trackPosition = 0; // Red start (row 6, col 1)

    _tokens[4].state = TokenState.onTrack;
    _tokens[4].trackPosition = 13; // Green start (row 1, col 8)

    _tokens[8].state = TokenState.onTrack;
    _tokens[8].trackPosition = 26; // Yellow start (row 8, col 13)

    _tokens[12].state = TokenState.onTrack;
    _tokens[12].trackPosition = 39; // Blue start (row 13, col 6)

    _startTurnTimer();
    _checkMovableTokens();
  }

  @override
  void dispose() {
    _turnTimer?.cancel();
    super.dispose();
  }

  void _startTurnTimer() {
    _turnTimer?.cancel();
    _turnTimeRemaining = 15;
    _turnTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) return;
      if (_turnTimeRemaining > 0) {
        setState(() {
          _turnTimeRemaining--;
        });
      } else {
        _nextTurn();
      }
    });
  }

  void _nextTurn() {
    if (!mounted) return;
    setState(() {
      _hasRolled = false;
      _currentTurnIndex = (_currentTurnIndex + 1) % _players.length;
      for (var t in _tokens) {
        t.isMovable = false;
        t.isSelected = false;
      }
    });

    _startTurnTimer();

    // If opponent's turn, trigger auto-play simulation after a short delay
    final currentPlayer = _players[_currentTurnIndex];
    if (!currentPlayer.isYou) {
      Future.delayed(const Duration(milliseconds: 900), () {
        if (mounted && _players[_currentTurnIndex] == currentPlayer) {
          _rollDice();
        }
      });
    }
  }

  void _rollDice() {
    if (_isDiceRolling || _isTokenMoving || _hasRolled) return;

    setState(() {
      _isDiceRolling = true;
    });

    // Rapid value cycling effect
    int cycleCount = 0;
    Timer.periodic(const Duration(milliseconds: 70), (t) {
      cycleCount++;
      if (cycleCount > 7) {
        t.cancel();
      } else if (mounted) {
        setState(() {
          _diceValue = (math.Random().nextInt(6)) + 1;
        });
      }
    });

    Future.delayed(const Duration(milliseconds: 650), () {
      if (!mounted) return;
      final finalValue = (math.Random().nextInt(6)) + 1;
      setState(() {
        _diceValue = finalValue;
        _isDiceRolling = false;
        _hasRolled = true;
      });

      _checkMovableTokens();

      // Check if current player has any valid moves
      final activeTokens = _tokens.where((t) => t.color == _players[_currentTurnIndex].color).toList();
      final movableTokens = activeTokens.where((t) => t.isMovable).toList();

      if (movableTokens.isEmpty) {
        // No moves possible with this roll, advance turn after brief delay
        Future.delayed(const Duration(milliseconds: 800), () {
          if (mounted) _nextTurn();
        });
      } else if (!_players[_currentTurnIndex].isYou) {
        // AI chooses a movable token automatically
        Future.delayed(const Duration(milliseconds: 700), () {
          if (mounted && movableTokens.isNotEmpty) {
            _animateMoveToken(movableTokens.first);
          }
        });
      }
    });
  }

  void _checkMovableTokens() {
    final currentColor = _players[_currentTurnIndex].color;
    for (var token in _tokens) {
      if (token.color != currentColor) {
        token.isMovable = false;
        token.isSelected = false;
        continue;
      }

      if (token.isAtHome) {
        // Token at home can only enter track on roll of 6
        token.isMovable = _diceValue == 6 && _hasRolled;
      } else if (token.isOnTrack || token.isInHomeStretch) {
        token.isMovable = _hasRolled;
      } else {
        token.isMovable = false;
      }
    }
  }

  Future<void> _animateMoveToken(LudoTokenModel token) async {
    if (_isTokenMoving || !token.isMovable) return;

    setState(() {
      _isTokenMoving = true;
      _activeMovingTokenId = token.id;
    });

    // 1. If at home and rolled 6 -> Move to start cell
    if (token.isAtHome && _diceValue == 6) {
      final startTrackIndex = _players.firstWhere((p) => p.color == token.color).startTrackIndex;

      // Hop animation onto board
      for (double elev = 0.0; elev <= 1.0; elev += 0.2) {
        if (!mounted) return;
        setState(() {
          _movingTokenElevation = elev;
        });
        await Future.delayed(const Duration(milliseconds: 25));
      }

      setState(() {
        token.state = TokenState.onTrack;
        token.trackPosition = startTrackIndex;
        _movingTokenElevation = 0.0;
        _movingTokenRotation = 0.0;
        _activeMovingTokenId = null;
        _isTokenMoving = false;
      });

      _checkCaptures(token);
      _postMoveRoutine();
      return;
    }

    // 2. Animate step-by-step along path
    final steps = _diceValue;
    for (int step = 0; step < steps; step++) {
      if (!mounted) return;

      // Parabolic jump elevation & tilt
      for (double t = 0.0; t <= 1.0; t += 0.25) {
        if (!mounted) return;
        final hopElevation = math.sin(t * math.pi);
        final tilt = math.sin(t * math.pi * 2) * 0.15;

        setState(() {
          _movingTokenElevation = hopElevation;
          _movingTokenRotation = tilt;
        });
        await Future.delayed(const Duration(milliseconds: 25));
      }

      // Increment track position
      setState(() {
        if (token.isOnTrack) {
          final entranceIndex = _players.firstWhere((p) => p.color == token.color).homeEntranceTrackIndex;
          if (token.trackPosition == entranceIndex) {
            token.state = TokenState.homeStretch;
            token.homeStretchPosition = 0;
          } else {
            token.trackPosition = (token.trackPosition + 1) % LudoBoardPath.mainTrack.length;
          }
        } else if (token.isInHomeStretch) {
          if (token.homeStretchPosition < 4) {
            token.homeStretchPosition++;
          } else {
            token.state = TokenState.finished;
          }
        }
      });

      await Future.delayed(const Duration(milliseconds: 50));
    }

    setState(() {
      _movingTokenElevation = 0.0;
      _movingTokenRotation = 0.0;
      _activeMovingTokenId = null;
      _isTokenMoving = false;
    });

    // Check for captures & celebrations
    _checkCaptures(token);
    _postMoveRoutine();
  }

  void _checkCaptures(LudoTokenModel movedToken) {
    if (!movedToken.isOnTrack) return;

    // Check if on safe star cell
    if (LudoBoardPath.safeTrackIndices.contains(movedToken.trackPosition)) {
      return; // Safe from capture!
    }

    // Check for opponent tokens on the same cell
    for (var otherToken in _tokens) {
      if (otherToken.id != movedToken.id &&
          otherToken.color != movedToken.color &&
          otherToken.isOnTrack &&
          otherToken.trackPosition == movedToken.trackPosition) {
        // Capture! Send opponent token back to home
        setState(() {
          otherToken.state = TokenState.home;
          otherToken.trackPosition = -1;
        });

        // Show capture notification banner
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: const Color(0xFF0F172A),
            duration: const Duration(milliseconds: 1400),
            content: Row(
              children: [
                const Icon(Icons.flash_on_rounded, color: AppColors.primaryGold, size: 20),
                const SizedBox(width: 8),
                Text(
                  '${movedToken.color.name.toUpperCase()} captured ${otherToken.color.name.toUpperCase()}!',
                  style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
                ),
              ],
            ),
          ),
        );
        break;
      }
    }
  }

  void _postMoveRoutine() {
    // If rolled a 6, player gets another turn!
    if (_diceValue == 6) {
      setState(() {
        _hasRolled = false;
      });
      _startTurnTimer();

      // If AI, trigger next roll
      if (!_players[_currentTurnIndex].isYou) {
        Future.delayed(const Duration(milliseconds: 800), () {
          if (mounted) _rollDice();
        });
      }
    } else {
      _nextTurn();
    }
  }

  void _showQuickChatSheet() {
    final messages = [
      'Good luck! 🎲',
      'Nice move! 🔥',
      'Hurry up! ⏱️',
      'Well played! 👏',
      'Oops! 😅',
      'Victory is mine! 👑',
    ];

    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF0F172A),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'QUICK EMOTES & MESSAGES',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primaryGold,
                    letterSpacing: 0.8,
                  ),
                ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: messages.map((msg) {
                    return ActionChip(
                      backgroundColor: const Color(0xFF1E293B),
                      side: BorderSide(color: Colors.white.withOpacity(0.1)),
                      label: Text(msg, style: const TextStyle(color: Colors.white, fontSize: 13)),
                      onPressed: () {
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('You: $msg'),
                            duration: const Duration(seconds: 1),
                            backgroundColor: const Color(0xFF1E293B),
                          ),
                        );
                      },
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showLeaveConfirmation() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF0F172A),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: const Text('Leave Match?', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        content: const Text(
          'Leaving now will forfeit your game points and count as a loss.',
          style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Stay', style: TextStyle(color: Color(0xFF94A3B8))),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFEF4444),
              foregroundColor: Colors.white,
            ),
            onPressed: () {
              Navigator.pop(context);
              Navigator.pop(context);
            },
            child: const Text('Leave Game'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final currentPlayer = _players[_currentTurnIndex];
    final isMyTurn = currentPlayer.isYou;

    return Scaffold(
      backgroundColor: const Color(0xFF070B14),
      body: Stack(
        children: [
          // 1. Decorative Dark Navy / Blue Game Background with Radial Glows
          Positioned.fill(
            child: Container(
              decoration: const BoxDecoration(
                gradient: RadialGradient(
                  center: Alignment(0.0, -0.2),
                  radius: 1.2,
                  colors: [
                    Color(0xFF0F1A30),
                    Color(0xFF0B1323),
                    Color(0xFF060911),
                  ],
                ),
              ),
            ),
          ),

          // Geometric Subtle Background Accents
          Positioned(
            top: 40,
            left: -30,
            child: Container(
              width: 140,
              height: 140,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0xFFE11D48).withOpacity(0.06),
              ),
            ),
          ),
          Positioned(
            bottom: 120,
            right: -40,
            child: Container(
              width: 180,
              height: 180,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0xFF2563EB).withOpacity(0.06),
              ),
            ),
          ),

          // 2. Main Game Screen Column
          SafeArea(
            child: Column(
              children: [
                // Top Navigation Bar
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 6.0),
                  child: Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white, size: 20),
                        onPressed: _showLeaveConfirmation,
                      ),
                      const SizedBox(width: 4),
                      // JK LODU Logo
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(4),
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                colors: [AppColors.primaryGold, AppColors.goldDark],
                              ),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Icon(Icons.casino_rounded, color: Colors.black, size: 16),
                          ),
                          const SizedBox(width: 6),
                          const Text(
                            'JK LODU',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 1.2,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                      const Spacer(),
                      // Turn Indicator Banner
                      TurnIndicatorWidget(
                        currentPlayer: currentPlayer,
                        isMyTurn: isMyTurn,
                        timeLeftSeconds: _turnTimeRemaining,
                      ),
                    ],
                  ),
                ),

                // Player Information Cards (You vs Opponents)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 4.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Red (You)
                      GamePlayerCard(
                        player: _players[0],
                        isCurrentTurn: _currentTurnIndex == 0,
                      ),
                      // Green (Rahat)
                      GamePlayerCard(
                        player: _players[1],
                        isCurrentTurn: _currentTurnIndex == 1,
                      ),
                    ],
                  ),
                ),

                // Secondary Opponents Row (for 4-player display)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 2.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Blue (Amina)
                      GamePlayerCard(
                        player: _players[3],
                        isCurrentTurn: _currentTurnIndex == 3,
                      ),
                      // Yellow (Tanvir)
                      GamePlayerCard(
                        player: _players[2],
                        isCurrentTurn: _currentTurnIndex == 2,
                      ),
                    ],
                  ),
                ),

                // 3. Central Responsive 3D Ludo Board Area
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
                    child: Center(
                      child: AspectRatio(
                        aspectRatio: 1.0,
                        child: LudoBoard3DWidget(
                          tokens: _tokens,
                          onTokenTap: _animateMoveToken,
                          activeMovingTokenId: _activeMovingTokenId,
                          movingTokenElevation: _movingTokenElevation,
                          movingTokenRotation: _movingTokenRotation,
                          movingTokenCoordinate: _movingTokenCoordinate,
                        ),
                      ),
                    ),
                  ),
                ),

                // 4. Center Rolling Dice Display (when dice is in play)
                Padding(
                  padding: const EdgeInsets.only(bottom: 6.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Dice3DWidget(
                        value: _diceValue,
                        isRolling: _isDiceRolling,
                        isEnabled: isMyTurn && !_hasRolled,
                        onRoll: _rollDice,
                        size: 60.0,
                      ),
                    ],
                  ),
                ),

                // 5. Bottom Controls Bar
                GameControlsBar(
                  onRollDice: _rollDice,
                  isRollEnabled: isMyTurn && !_hasRolled && !_isTokenMoving,
                  isRolling: _isDiceRolling,
                  movesLeft: _hasRolled ? _diceValue : 0,
                  currentDiceResult: _diceValue,
                  soundEnabled: _soundEnabled,
                  musicEnabled: _musicEnabled,
                  onToggleSound: () => setState(() => _soundEnabled = !_soundEnabled),
                  onToggleMusic: () => setState(() => _musicEnabled = !_musicEnabled),
                  onOpenChat: _showQuickChatSheet,
                  onOpenSettings: () => Navigator.pushNamed(context, '/settings'),
                  onLeaveGame: _showLeaveConfirmation,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
