import 'package:flutter/material.dart';
import '../../auth/controllers/auth_controller.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_constants.dart';
import '../../core/theme/theme_controller.dart';

class SettingsScreen extends StatelessWidget {
  final AuthController authController;
  final ThemeController themeController;

  const SettingsScreen({
    super.key,
    required this.authController,
    required this.themeController,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Settings',
          style: TextStyle(fontWeight: FontWeight.w800),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: AnimatedBuilder(
        animation: Listenable.merge([authController, themeController]),
        builder: (context, _) {
          return ListView(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            children: [
              // Appearance Section
              _buildSectionHeader(context, 'APPEARANCE'),
              Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: Column(
                    children: [
                      ListTile(
                        leading: const Icon(Icons.brightness_6_rounded, color: AppColors.primaryGold),
                        title: const Text('Theme Mode', style: TextStyle(fontWeight: FontWeight.w700)),
                        subtitle: Text(themeController.themeMode == ThemeMode.system
                            ? 'System Default'
                            : (themeController.isDarkMode ? 'Dark Luxury' : 'Light Clean')),
                        trailing: DropdownButton<ThemeMode>(
                          value: themeController.themeMode,
                          underline: const SizedBox(),
                          borderRadius: BorderRadius.circular(12),
                          items: const [
                            DropdownMenuItem(value: ThemeMode.system, child: Text('System')),
                            DropdownMenuItem(value: ThemeMode.dark, child: Text('Dark')),
                            DropdownMenuItem(value: ThemeMode.light, child: Text('Light')),
                          ],
                          onChanged: (mode) {
                            if (mode != null) themeController.setThemeMode(mode);
                          },
                        ),
                      ),
                      const Divider(height: 1),
                      SwitchListTile(
                        secondary: const Icon(Icons.dark_mode_rounded, color: AppColors.playerBlue),
                        title: const Text('Force Dark Theme', style: TextStyle(fontWeight: FontWeight.w600)),
                        subtitle: const Text('High-contrast night gaming table'),
                        value: themeController.isDarkMode,
                        activeColor: AppColors.primaryGold,
                        onChanged: (val) {
                          themeController.setThemeMode(val ? ThemeMode.dark : ThemeMode.light);
                        },
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 20),

              // Audio & Feedback
              _buildSectionHeader(context, 'SOUND & HAPTICS'),
              Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Column(
                  children: [
                    SwitchListTile(
                      secondary: const Icon(Icons.volume_up_rounded, color: AppColors.playerGreen),
                      title: const Text('Sound Effects', style: TextStyle(fontWeight: FontWeight.w600)),
                      subtitle: const Text('Dice roll, pawn movement, captures'),
                      value: true,
                      activeColor: AppColors.primaryGold,
                      onChanged: (val) {},
                    ),
                    const Divider(height: 1),
                    SwitchListTile(
                      secondary: const Icon(Icons.music_note_rounded, color: AppColors.primaryGold),
                      title: const Text('Ambient Music', style: TextStyle(fontWeight: FontWeight.w600)),
                      subtitle: const Text('Traditional gaming hall soundtrack'),
                      value: false,
                      activeColor: AppColors.primaryGold,
                      onChanged: (val) {},
                    ),
                    const Divider(height: 1),
                    SwitchListTile(
                      secondary: const Icon(Icons.vibration_rounded, color: AppColors.playerYellow),
                      title: const Text('Vibration Feedback', style: TextStyle(fontWeight: FontWeight.w600)),
                      subtitle: const Text('Haptics on turn notification and sixes'),
                      value: true,
                      activeColor: AppColors.primaryGold,
                      onChanged: (val) {},
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // Account / Session Section
              _buildSectionHeader(context, 'ACCOUNT & DATA'),
              Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Column(
                  children: [
                    ListTile(
                      leading: const Icon(Icons.person_pin_rounded, color: AppColors.brandPurple),
                      title: Text(
                        authController.currentUser?.displayName ?? 'Not logged in',
                        style: const TextStyle(fontWeight: FontWeight.w700),
                      ),
                      subtitle: Text(
                        'ID: ${authController.currentUser?.playerId ?? "JK-0000"} • ${authController.isGuest ? "Guest" : "Google Cloud Sync"}',
                      ),
                      trailing: TextButton(
                        onPressed: () {
                          Navigator.pushNamed(context, '/profile');
                        },
                        child: const Text('Edit Profile'),
                      ),
                    ),
                    const Divider(height: 1),
                    ListTile(
                      leading: const Icon(Icons.logout_rounded, color: AppColors.playerRed),
                      title: const Text('Log Out', style: TextStyle(fontWeight: FontWeight.w700, color: AppColors.playerRed)),
                      subtitle: const Text('Sign out and return to welcome login'),
                      onTap: () async {
                        await authController.logout();
                        if (context.mounted) {
                          Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
                        }
                      },
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Build Info
              Center(
                child: Column(
                  children: [
                    Text(
                      '${AppConstants.appName} v${AppConstants.appVersion}',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: isDark ? AppColors.textDarkSecondary : AppColors.textLightSecondary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Multiplayer Ludo Architecture Engine • Phase 2',
                      style: TextStyle(
                        fontSize: 11,
                        color: isDark ? AppColors.textDarkSecondary.withOpacity(0.7) : AppColors.textLightSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 30),
            ],
          );
        },
      ),
    );
  }

  Widget _buildSectionHeader(BuildContext context, String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 8),
      child: Text(
        title,
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w800,
          letterSpacing: 1.2,
          color: Theme.of(context).brightness == Brightness.dark
              ? AppColors.textDarkSecondary
              : AppColors.textLightSecondary,
        ),
      ),
    );
  }
}
