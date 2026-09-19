import 'package:flutter/material.dart';
import '../../auth/controllers/auth_controller.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_constants.dart';

class ProfileScreen extends StatelessWidget {
  final AuthController authController;

  const ProfileScreen({
    super.key,
    required this.authController,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final user = authController.currentUser;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Player Profile', style: TextStyle(fontWeight: FontWeight.w800)),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            // Center Avatar & Badges
            Center(
              child: Stack(
                children: [
                  Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: const LinearGradient(
                        colors: [AppColors.primaryGold, AppColors.goldDark],
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.primaryGold.withOpacity(0.3),
                          blurRadius: 16,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    padding: const EdgeInsets.all(3),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(50),
                      child: Image.network(
                        user?.activePhoto ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => const Icon(Icons.person, size: 50, color: Colors.white),
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: const BoxDecoration(
                        color: AppColors.primaryGold,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.edit, size: 14, color: Colors.black),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            Text(
              user?.displayName ?? 'Player',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w900,
                color: isDark ? Colors.white : AppColors.textLightPrimary,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'UID: ${user?.playerId ?? "JK-0000"}',
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: isDark ? AppColors.textDarkSecondary : AppColors.textLightSecondary,
              ),
            ),

            const SizedBox(height: 24),

            // Win / Loss / Stats Card
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
              child: Padding(
                padding: const EdgeInsets.all(18.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildStatColumn(context, '${user?.gamesPlayed ?? 0}', 'Played', AppColors.playerBlue),
                    _buildStatDivider(context),
                    _buildStatColumn(context, '${user?.wins ?? 0}', 'Victories', AppColors.playerGreen),
                    _buildStatDivider(context),
                    _buildStatColumn(context, '${(user?.winRate ?? 0).toStringAsFixed(0)}%', 'Win Rate', AppColors.primaryGold),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 20),

            // Balances
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  children: [
                    Expanded(
                      child: Row(
                        children: [
                          const Icon(Icons.monetization_on_rounded, color: AppColors.primaryGold, size: 30),
                          const SizedBox(width: 12),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '${user?.coins ?? 0}',
                                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
                              ),
                              const Text('Coins', style: TextStyle(fontSize: 11, color: Colors.grey)),
                            ],
                          ),
                        ],
                      ),
                    ),
                    Container(height: 36, width: 1, color: Colors.grey.withOpacity(0.2)),
                    Expanded(
                      child: Row(
                        children: [
                          const SizedBox(width: 16),
                          const Icon(Icons.diamond_rounded, color: Colors.cyanAccent, size: 30),
                          const SizedBox(width: 12),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '${user?.diamonds ?? 0}',
                                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
                              ),
                              const Text('Diamonds', style: TextStyle(fontSize: 11, color: Colors.grey)),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 20),

            // Quick Actions
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () => Navigator.pushNamed(context, '/match-history'),
                icon: const Icon(Icons.history_rounded),
                label: const Text('View Match Records & Statistics'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatColumn(BuildContext context, String value, String label, Color color) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w900,
            color: color,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: Colors.grey,
          ),
        ),
      ],
    );
  }

  Widget _buildStatDivider(BuildContext context) {
    return Container(
      height: 32,
      width: 1,
      color: Colors.grey.withOpacity(0.2),
    );
  }
}
