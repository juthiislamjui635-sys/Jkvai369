import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../models/game_models.dart';

/// Premium "YOUR TURN" and Active Player Banner
/// Features glowing animated border, timer circle, and player color highlights
class TurnIndicatorWidget extends StatefulWidget {
  final PlayerInfo currentPlayer;
  final bool isMyTurn;
  final int timeLeftSeconds;
  final int maxTimeSeconds;

  const TurnIndicatorWidget({
    super.key,
    required this.currentPlayer,
    required this.isMyTurn,
    this.timeLeftSeconds = 15,
    this.maxTimeSeconds = 15,
  });

  @override
  State<TurnIndicatorWidget> createState() => _TurnIndicatorWidgetState();
}

class _TurnIndicatorWidgetState extends State<TurnIndicatorWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _glowController;

  @override
  void initState() {
    super.initState();
    _glowController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _glowController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final progress = (widget.timeLeftSeconds / widget.maxTimeSeconds).clamp(0.0, 1.0);
    final isUrgent = widget.timeLeftSeconds <= 4;

    return AnimatedBuilder(
      animation: _glowController,
      builder: (context, child) {
        final glow = _glowController.value;

        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                const Color(0xFF131C2E),
                const Color(0xFF0F172A),
              ],
            ),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: widget.isMyTurn
                  ? AppColors.primaryGold.withOpacity(0.6 + glow * 0.4)
                  : widget.currentPlayer.displayColor.withOpacity(0.5),
              width: widget.isMyTurn ? 2.0 : 1.2,
            ),
            boxShadow: [
              if (widget.isMyTurn)
                BoxShadow(
                  color: AppColors.primaryGold.withOpacity(0.25 + glow * 0.25),
                  blurRadius: 14 + glow * 6,
                  spreadRadius: 1,
                ),
            ],
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Player Color Indicator Dot with Ripple
              Container(
                width: 12,
                height: 12,
                decoration: BoxDecoration(
                  color: widget.currentPlayer.displayColor,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: widget.currentPlayer.displayColor.withOpacity(0.8),
                      blurRadius: 6,
                    ),
                  ],
                ),
              ),

              const SizedBox(width: 8),

              // Turn Label
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    widget.isMyTurn ? 'YOUR TURN' : '${widget.currentPlayer.name.toUpperCase()}\'S TURN',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 0.8,
                      color: widget.isMyTurn ? AppColors.primaryGold : Colors.white,
                    ),
                  ),
                  Text(
                    widget.isMyTurn ? 'Roll dice to move' : 'Waiting for move...',
                    style: const TextStyle(
                      fontSize: 9,
                      color: Color(0xFF94A3B8),
                    ),
                  ),
                ],
              ),

              const SizedBox(width: 12),

              // Circular Countdown Timer
              SizedBox(
                width: 26,
                height: 26,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    CircularProgressIndicator(
                      value: progress,
                      strokeWidth: 3.0,
                      backgroundColor: Colors.white.withOpacity(0.12),
                      valueColor: AlwaysStoppedAnimation<Color>(
                        isUrgent ? const Color(0xFFEF4444) : AppColors.primaryGold,
                      ),
                    ),
                    Text(
                      '${widget.timeLeftSeconds}',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: isUrgent ? const Color(0xFFEF4444) : Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
