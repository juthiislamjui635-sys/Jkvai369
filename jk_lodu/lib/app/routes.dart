import 'package:flutter/material.dart';
import '../auth/controllers/auth_controller.dart';
import '../auth/screens/login_screen.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_constants.dart';
import '../core/theme/theme_controller.dart';
import '../core/widgets/generic_feature_screen.dart';
import '../game/screens/game_screen.dart';
import '../home/screens/home_screen.dart';
import '../profile/screens/profile_screen.dart';
import '../room/screens/room_management_screen.dart';
import '../settings/screens/settings_screen.dart';
import '../splash/screens/splash_screen.dart';

class AppRoutes {
  AppRoutes._();

  static const String splash = '/';
  static const String login = '/login';
  static const String home = '/home';
  static const String game = '/game';
  static const String createRoom = '/create-room';
  static const String joinRoom = '/join-room';
  static const String profile = '/profile';
  static const String settings = '/settings';
  static const String leaderboard = '/leaderboard';
  static const String friends = '/friends';
  static const String matchHistory = '/match-history';

  static Route<dynamic> onGenerateRoute(
    RouteSettings settings, {
    required AuthController authController,
    required ThemeController themeController,
  }) {
    switch (settings.name) {
      case splash:
        return _buildFadeRoute(
          SplashScreen(authController: authController),
          settings,
        );

      case login:
        return _buildFadeRoute(
          LoginScreen(authController: authController),
          settings,
        );

      case home:
        return _buildSlideRoute(
          HomeScreen(authController: authController),
          settings,
        );

      case game:
        return _buildSlideRoute(
          const GameScreen(),
          settings,
        );

      case createRoom:
        return _buildSlideRoute(
          const RoomManagementScreen(isCreateMode: true),
          settings,
        );

      case joinRoom:
        return _buildSlideRoute(
          const RoomManagementScreen(isCreateMode: false),
          settings,
        );

      case profile:
        return _buildSlideRoute(
          ProfileScreen(authController: authController),
          settings,
        );

      case AppRoutes.settings:
        return _buildSlideRoute(
          SettingsScreen(
            authController: authController,
            themeController: themeController,
          ),
          settings,
        );

      case leaderboard:
        return _buildSlideRoute(
          const GenericFeatureScreen(
            title: 'Global Leaderboard',
            icon: Icons.emoji_events_rounded,
            description:
                'Compete against thousands of players worldwide. Top ranks earn exclusive dice skins and gold trophies.',
          ),
          settings,
        );

      case friends:
        return _buildSlideRoute(
          const GenericFeatureScreen(
            title: 'Friends & Social',
            icon: Icons.people_alt_rounded,
            description:
                'Add fellow Ludo masters by UID, send table invitations, and challenge companions directly.',
          ),
          settings,
        );

      case matchHistory:
        return _buildSlideRoute(
          const GenericFeatureScreen(
            title: 'Match Records',
            icon: Icons.history_rounded,
            description:
                'Review your recent matches, victory streaks, captures, and tournament trophies.',
          ),
          settings,
        );

      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('No route defined for ${settings.name}'),
            ),
          ),
        );
    }
  }

  static PageRouteBuilder _buildFadeRoute(Widget page, RouteSettings settings) {
    return PageRouteBuilder(
      settings: settings,
      transitionDuration: const Duration(milliseconds: 600),
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        return FadeTransition(
          opacity: CurvedAnimation(
            parent: animation,
            curve: Curves.easeInOut,
          ),
          child: child,
        );
      },
    );
  }

  static PageRouteBuilder _buildSlideRoute(Widget page, RouteSettings settings) {
    return PageRouteBuilder(
      settings: settings,
      transitionDuration: const Duration(milliseconds: 380),
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        final offsetAnimation = Tween<Offset>(
          begin: const Offset(1.0, 0.0),
          end: Offset.zero,
        ).animate(CurvedAnimation(
          parent: animation,
          curve: Curves.easeOutCubic,
        ));
        return SlideTransition(
          position: offsetAnimation,
          child: child,
        );
      },
    );
  }
}
