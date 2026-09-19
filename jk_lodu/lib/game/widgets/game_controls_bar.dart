import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';

/// Premium Bottom Game Controls Bar
/// Features:
/// - [ ROLL DICE ] primary button with 3D gradient & active glow
/// - Moves Left indicator
/// - Current dice result display
/// - Sound, Music, Chat, Settings, and Leave Game action buttons
class GameControlsBar extends StatelessWidget {
  final VoidCallback? onRollDice;
  final bool isRollEnabled;
  final bool isRolling;
  final int movesLeft;
  final int currentDiceResult;
  final bool soundEnabled;
  final bool musicEnabled;
  final VoidCallback onToggleSound;
  final VoidCallback onToggleMusic;
  final VoidCallback onOpenChat;
  final VoidCallback onOpenSettings;
  final VoidCallback onLeaveGame;

  const GameControlsBar({
    super.key,
    required this.onRollDice,
    required this.isRollEnabled,
    required this.isRolling,
    required this.movesLeft,
    required this.currentDiceResult,
    required this.soundEnabled,
    required this.musicEnabled,
    required this.onToggleSound,
    required this.onToggleMusic,
    required this.onOpenChat,
    required this.onOpenSettings,
    required this.onLeaveGame,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A).withOpacity(0.95),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        border: Border.all(
          color: Colors.white.withOpacity(0.1),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.4),
            blurRadius: 16,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Upper Row: Action Utilities (Sound, Music, Chat, Settings, Leave)
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Sound Toggle
              _buildUtilityButton(
                icon: soundEnabled ? Icons.volume_up_rounded : Icons.volume_off_rounded,
                isActive: soundEnabled,
                tooltip: 'Sound FX',
                onTap: onToggleSound,
              ),

              // Music Toggle
              _buildUtilityButton(
                icon: musicEnabled ? Icons.music_note_rounded : Icons.music_off_rounded,
                isActive: musicEnabled,
                tooltip: 'Background Music',
                onTap: onToggleMusic,
              ),

              // Quick Chat
              _buildUtilityButton(
                icon: Icons.chat_bubble_outline_rounded,
                isActive: true,
                tooltip: 'Quick Chat & Emotes',
                onTap: onOpenChat,
              ),

              // Settings
              _buildUtilityButton(
                icon: Icons.settings_outlined,
                isActive: false,
                tooltip: 'Table Settings',
                onTap: onOpenSettings,
              ),

              // Leave Game (Red danger accent)
              _buildUtilityButton(
                icon: Icons.exit_to_app_rounded,
                isActive: false,
                isDanger: true,
                tooltip: 'Leave Game',
                onTap: onLeaveGame,
              ),
            ],
          ),

          const SizedBox(height: 10),

          // Lower Row: [ ROLL DICE ] Button & Status
          Row(
            children: [
              // Dice Result & Moves Left
              Expanded(
                flex: 4,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E293B),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: Colors.white.withOpacity(0.08)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'MOVES LEFT',
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF94A3B8),
                              letterSpacing: 0.5,
                            ),
                          ),
                          Text(
                            '$movesLeft',
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w900,
                              color: AppColors.primaryGold,
                            ),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.primaryGold.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          'DICE: $currentDiceResult',
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w900,
                            color: AppColors.primaryGold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(width: 10),

              // Big [ ROLL DICE ] Action Button
              Expanded(
                flex: 5,
                child: GestureDetector(
                  onTap: isRollEnabled && !isRolling ? onRollDice : null,
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    decoration: BoxDecoration(
                      gradient: isRollEnabled
                          ? const LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: [
                                Color(0xFFFFD54F),
                                Color(0xFFFFB800),
                                Color(0xFFD97706),
                              ],
                            )
                          : LinearGradient(
                              colors: [
                                Colors.grey.shade700,
                                Colors.grey.shade800,
                              ],
                            ),
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: isRollEnabled
                          ? [
                              BoxShadow(
                                color: AppColors.primaryGold.withOpacity(0.45),
                                blurRadius: 14,
                                offset: const Offset(0, 4),
                              ),
                            ]
                          : null,
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.casino_rounded,
                          size: 20,
                          color: isRollEnabled ? const Color(0xFF0F172A) : Colors.white54,
                        ),
                        const SizedBox(width: 6),
                        Text(
                          isRolling ? 'ROLLING...' : 'ROLL DICE',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 0.8,
                            color: isRollEnabled ? const Color(0xFF0F172A) : Colors.white54,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildUtilityButton({
    required IconData icon,
    required bool isActive,
    required String tooltip,
    required VoidCallback onTap,
    bool isDanger = false,
  }) {
    Color bg;
    Color border;
    Color iconColor;

    if (isDanger) {
      bg = const Color(0xFFEF4444).withOpacity(0.15);
      border = const Color(0xFFEF4444).withOpacity(0.3);
      iconColor = const Color(0xFFF87171);
    } else if (isActive) {
      bg = AppColors.primaryGold.withOpacity(0.18);
      border = AppColors.primaryGold.withOpacity(0.4);
      iconColor = AppColors.primaryGold;
    } else {
      bg = const Color(0xFF1E293B);
      border = Colors.white.withOpacity(0.08);
      iconColor = const Color(0xFF94A3B8);
    }

    return Tooltip(
      message: tooltip,
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: bg,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: border),
          ),
          child: Icon(icon, size: 18, color: iconColor),
        ),
      ),
    );
  }
}
