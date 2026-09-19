import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../models/game_models.dart';

/// Compact and responsive Game Player Card
/// Shows player name, crown (if host/you), color badge, level, and active turn highlight
class GamePlayerCard extends StatelessWidget {
  final PlayerInfo player;
  final bool isCurrentTurn;
  final int activeTokensOnBoard;

  const GamePlayerCard({
    super.key,
    required this.player,
    this.isCurrentTurn = false,
    this.activeTokensOnBoard = 0,
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: isCurrentTurn
            ? const Color(0xFF1E293B)
            : const Color(0xFF0F172A).withOpacity(0.8),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: isCurrentTurn
              ? player.displayColor
              : Colors.white.withOpacity(0.12),
          width: isCurrentTurn ? 2.0 : 1.0,
        ),
        boxShadow: isCurrentTurn
            ? [
                BoxShadow(
                  color: player.displayColor.withOpacity(0.35),
                  blurRadius: 10,
                  offset: const Offset(0, 2),
                ),
              ]
            : null,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Circular Avatar with Gold Ring & Color Flag
          Stack(
            clipBehavior: Clip.none,
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: isCurrentTurn ? AppColors.primaryGold : Colors.white,
                    width: 1.5,
                  ),
                ),
                child: ClipOval(
                  child: player.avatarUrl != null
                      ? Image.network(
                          player.avatarUrl!,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => _buildAvatarFallback(),
                        )
                      : _buildAvatarFallback(),
                ),
              ),

              // Player Color Dot
              Positioned(
                bottom: -2,
                right: -2,
                child: Container(
                  width: 11,
                  height: 11,
                  decoration: BoxDecoration(
                    color: player.displayColor,
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 1.5),
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(width: 8),

          // Name and Stats
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    player.isYou ? 'You' : player.name,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: isCurrentTurn ? FontWeight.w800 : FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                  if (player.isYou || player.isHost) ...[
                    const SizedBox(width: 3),
                    const Text('👑', style: TextStyle(fontSize: 10)),
                  ],
                ],
              ),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    player.color.name.toUpperCase(),
                    style: TextStyle(
                      fontSize: 9,
                      fontWeight: FontWeight.bold,
                      color: player.lightColor,
                    ),
                  ),
                  const SizedBox(width: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      'Lv.${player.level}',
                      style: const TextStyle(
                        fontSize: 8,
                        fontWeight: FontWeight.w700,
                        color: AppColors.primaryGold,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildAvatarFallback() {
    return Container(
      color: player.darkColor,
      alignment: Alignment.center,
      child: Text(
        player.name.isNotEmpty ? player.name[0].toUpperCase() : 'P',
        style: const TextStyle(
          fontSize: 13,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      ),
    );
  }
}
