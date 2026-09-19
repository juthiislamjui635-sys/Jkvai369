import 'package:flutter/material.dart';
import '../../auth/controllers/auth_controller.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_constants.dart';

class HomeScreen extends StatelessWidget {
  final AuthController authController;

  const HomeScreen({
    super.key,
    required this.authController,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final user = authController.currentUser;

    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: isDark
                ? [const Color(0xFF0B0F19), const Color(0xFF131C2E), const Color(0xFF1E1B4B)]
                : [const Color(0xFFF8FAFC), const Color(0xFFF1F5F9), const Color(0xFFE2E8F0)],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Top Player Profile Bar & Stats
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
                child: Row(
                  children: [
                    // Avatar with Level badge
                    GestureDetector(
                      onTap: () => Navigator.pushNamed(context, '/profile'),
                      child: Stack(
                        clipBehavior: Clip.none,
                        children: [
                          Container(
                            width: 50,
                            height: 50,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: const LinearGradient(
                                colors: [AppColors.primaryGold, AppColors.goldDark],
                              ),
                              border: Border.all(color: Colors.amber, width: 2),
                              boxShadow: [
                                BoxShadow(
                                  color: AppColors.primaryGold.withOpacity(0.3),
                                  blurRadius: 10,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(25),
                              child: Image.network(
                                user?.activePhoto ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
                                fit: BoxFit.cover,
                                errorBuilder: (_, __, ___) => const Icon(Icons.person, color: Colors.black),
                              ),
                            ),
                          ),
                          Positioned(
                            bottom: -4,
                            right: -4,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                              decoration: BoxDecoration(
                                color: AppColors.brandPurple,
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: Colors.white, width: 1),
                              ),
                              child: Text(
                                'Lv.${user?.level ?? 1}',
                                style: const TextStyle(
                                  fontSize: 9,
                                  fontWeight: FontWeight.w900,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(width: 12),

                    // Name & XP Bar
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                user?.displayName ?? 'Player',
                                style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w800,
                                  color: isDark ? Colors.white : AppColors.textLightPrimary,
                                ),
                              ),
                              const SizedBox(width: 6),
                              if (authController.isGuest)
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                                  decoration: BoxDecoration(
                                    color: Colors.amber.withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: const Text(
                                    'OFFLINE',
                                    style: TextStyle(
                                      fontSize: 8,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.amber,
                                    ),
                                  ),
                                ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          // XP progress track
                          ClipRRect(
                            borderRadius: BorderRadius.circular(4),
                            child: Container(
                              height: 6,
                              width: 140,
                              color: isDark ? Colors.white12 : Colors.black12,
                              child: FractionallySizedBox(
                                alignment: Alignment.centerLeft,
                                widthFactor: 0.65,
                                child: Container(
                                  color: AppColors.primaryGold,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Quick Coins & Gems
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: isDark ? AppColors.surfaceDark : Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: isDark ? AppColors.boardPathBorderDark : AppColors.boardPathBorder,
                        ),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.monetization_on_rounded, size: 16, color: AppColors.primaryGold),
                          const SizedBox(width: 4),
                          Text(
                            '${user?.coins ?? 1000}',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: isDark ? Colors.white : AppColors.textLightPrimary,
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(width: 8),

                    // Settings Icon
                    IconButton(
                      icon: Icon(
                        Icons.settings_outlined,
                        color: isDark ? Colors.white70 : Colors.black89,
                      ),
                      onPressed: () => Navigator.pushNamed(context, '/settings'),
                    ),
                  ],
                ),
              ),

              const Divider(height: 1, color: Colors.black12),

              // Main Game Modes Scroll Area
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(18.0),
                  child: Column(
                    children: [
                      // Featured Banner / Quick Play
                      _buildFeaturedPlayCard(
                        context,
                        isDark,
                        title: 'QUICK PLAY',
                        subtitle: 'Fast 2-Player or 4-Player Instant Match',
                        icon: Icons.flash_on_rounded,
                        accentColor: AppColors.primaryGold,
                        onTap: () => Navigator.pushNamed(context, '/game'),
                      ),

                      const SizedBox(height: 14),

                      // 2-Column Grid: Create Room & Join Room
                      Row(
                        children: [
                          Expanded(
                            child: _buildActionTile(
                              context,
                              isDark,
                              title: 'CREATE ROOM',
                              subtitle: 'Host private table',
                              icon: Icons.add_circle_outline_rounded,
                              gradientColors: [const Color(0xFF2563EB), const Color(0xFF1D4ED8)],
                              onTap: () => Navigator.pushNamed(context, '/create-room'),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _buildActionTile(
                              context,
                              isDark,
                              title: 'JOIN ROOM',
                              subtitle: 'Enter room code',
                              icon: Icons.vpn_key_rounded,
                              gradientColors: [const Color(0xFF10B981), const Color(0xFF047857)],
                              onTap: () => Navigator.pushNamed(context, '/join-room'),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 14),

                      // Play with AI Mode
                      _buildFeaturedPlayCard(
                        context,
                        isDark,
                        title: 'PLAY WITH AI',
                        subtitle: 'Practice offline with Easy, Medium, or Hard AI',
                        icon: Icons.smart_toy_rounded,
                        accentColor: AppColors.playerRed,
                        onTap: () => Navigator.pushNamed(context, '/game'),
                      ),

                      const SizedBox(height: 22),

                      // Social / Community Section
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          'COMMUNITY & PROGRESS',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 1.2,
                            color: isDark ? AppColors.textDarkSecondary : AppColors.textLightSecondary,
                          ),
                        ),
                      ),
                      const SizedBox(height: 10),

                      // Navigation Bar of 4 features
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          _buildMiniNav(context, isDark, Icons.people_alt_rounded, 'FRIENDS', '/friends'),
                          _buildMiniNav(context, isDark, Icons.emoji_events_rounded, 'LEADERBOARD', '/leaderboard'),
                          _buildMiniNav(context, isDark, Icons.person_rounded, 'PROFILE', '/profile'),
                          _buildMiniNav(context, isDark, Icons.history_rounded, 'HISTORY', '/match-history'),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              // Bottom Brand Footer
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 10.0),
                child: Text(
                  'JK LODU • Real-Time Engine Active',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: isDark ? Colors.white24 : Colors.black26,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFeaturedPlayCard(
    BuildContext context,
    bool isDark, {
    required String title,
    required String subtitle,
    required IconData icon,
    required Color accentColor,
    required VoidCallback onTap,
  }) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: isDark ? AppColors.surfaceDark : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isDark ? AppColors.boardPathBorderDark : AppColors.boardPathBorder,
        ),
        boxShadow: [
          BoxShadow(
            color: accentColor.withOpacity(0.15),
            blurRadius: 18,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(18.0),
            child: Row(
              children: [
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    color: accentColor.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Icon(icon, color: accentColor, size: 30),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 0.5,
                          color: isDark ? Colors.white : AppColors.textLightPrimary,
                        ),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        subtitle,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: isDark ? AppColors.textDarkSecondary : AppColors.textLightSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                const Icon(Icons.arrow_forward_ios_rounded, size: 16, color: Colors.grey),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildActionTile(
    BuildContext context,
    bool isDark, {
    required String title,
    required String subtitle,
    required IconData icon,
    required List<Color> gradientColors,
    required VoidCallback onTap,
  }) {
    return Container(
      height: 120,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: gradientColors,
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: gradientColors[0].withOpacity(0.3),
            blurRadius: 14,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(18),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(14.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(icon, color: Colors.white, size: 22),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                      ),
                    ),
                    Text(
                      subtitle,
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w500,
                        color: Colors.white.withOpacity(0.8),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMiniNav(
    BuildContext context,
    bool isDark,
    IconData icon,
    String label,
    String route,
  ) {
    return GestureDetector(
      onTap: () => Navigator.pushNamed(context, route),
      child: Container(
        width: 76,
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isDark ? AppColors.surfaceDark : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isDark ? AppColors.boardPathBorderDark : AppColors.boardPathBorder,
          ),
        ),
        child: Column(
          children: [
            Icon(icon, size: 22, color: AppColors.primaryGold),
            const SizedBox(height: 6),
            Text(
              label,
              style: TextStyle(
                fontSize: 9,
                fontWeight: FontWeight.w800,
                color: isDark ? Colors.white70 : AppColors.textLightPrimary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
