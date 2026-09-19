import { FlutterFile, PhaseItem } from '../types';

export const FLUTTER_FILES: FlutterFile[] = [
  {
    path: 'pubspec.yaml',
    name: 'pubspec.yaml',
    category: 'config',
    description: 'Flutter project specification, SDK constraints, Firebase, Flame, and audio dependencies',
    content: `name: jk_lodu
description: "JK LODU - The Ultimate Multiplayer Ludo Experience for Android, Web, and iOS."
publish_to: "none"
version: 1.0.0+1

environment:
  sdk: ">=3.3.0 <4.0.0"
  flutter: ">=3.19.0"

dependencies:
  flutter:
    sdk: flutter

  # State Management & DI
  flutter_bloc: ^8.1.5
  provider: ^6.1.2
  get_it: ^7.6.7
  equatable: ^2.0.5

  # UI & Presentation
  google_fonts: ^6.2.1
  flutter_animate: ^4.5.0
  flutter_svg: ^2.0.10+1
  cached_network_image: ^3.3.1
  flutter_spinkit: ^5.2.1

  # Game Animation & Engine Support
  flame: ^1.16.0

  # Firebase Core & Services (Free-tier compatible)
  firebase_core: ^2.30.0
  firebase_auth: ^4.19.4
  google_sign_in: ^6.2.1
  cloud_firestore: ^4.17.2
  firebase_database: ^10.5.4
  firebase_storage: ^11.7.4

  # Media, Audio & Haptics
  audioplayers: ^6.0.0
  image_picker: ^1.1.0
  image_cropper: ^5.0.1
  flutter_image_compress: ^2.2.0

  # Utilities & Device
  shared_preferences: ^2.2.3
  uuid: ^4.4.0
  crypto: ^3.0.3
  intl: ^0.19.0
  logger: ^2.2.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
    - assets/audio/`
  },
  {
    path: 'lib/main.dart',
    name: 'main.dart',
    category: 'app',
    description: 'Entry point: Orientation locking, edge-to-edge system UI, DI locator and app boot',
    content: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'app/app.dart';
import 'core/services/logger_service.dart';
import 'core/services/service_locator.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Lock preferred orientations for standard mobile gameplay
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  // Edge-to-edge status and navigation bars
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Colors.transparent,
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  try {
    await initServiceLocator();
    LoggerService.i('JK LODU Service Locator initialized successfully');
  } catch (e, stack) {
    LoggerService.e('Failed during service locator initialization', e, stack);
  }

  runApp(const JkLoduApp());
}`
  },
  {
    path: 'lib/app/app.dart',
    name: 'app.dart',
    category: 'app',
    description: 'Root MaterialApp with MultiProvider (AuthController, ThemeController) and dynamic theming',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../auth/controllers/auth_controller.dart';
import '../core/constants/app_constants.dart';
import '../core/services/service_locator.dart';
import '../core/theme/theme_controller.dart';
import 'routes.dart';
import 'theme.dart';

class JkLoduApp extends StatelessWidget {
  const JkLoduApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider<AuthController>(
          create: (_) => sl<AuthController>(),
        ),
        ChangeNotifierProvider<ThemeController>(
          create: (_) => sl<ThemeController>(),
        ),
      ],
      child: Consumer2<AuthController, ThemeController>(
        builder: (context, authController, themeController, _) {
          return MaterialApp(
            title: AppConstants.appName,
            debugShowCheckedModeBanner: false,
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: themeController.themeMode,
            initialRoute: AppRoutes.splash,
            onGenerateRoute: (settings) => AppRoutes.onGenerateRoute(
              settings,
              authController: authController,
              themeController: themeController,
            ),
          );
        },
      ),
    );
  }
}`
  },
  {
    path: 'lib/app/theme.dart',
    name: 'theme.dart',
    category: 'app',
    description: 'Material 3 Light and Luxury Dark themes featuring Poppins typography and gold game accents',
    content: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';

class AppTheme {
  AppTheme._();

  static ThemeData get lightTheme {
    final textTheme = GoogleFonts.poppinsTextTheme();
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: const ColorScheme.light(
        primary: AppColors.primaryGold,
        onPrimary: Colors.black,
        secondary: AppColors.goldDark,
        surface: AppColors.surfaceLight,
        onSurface: AppColors.textLightPrimary,
        error: AppColors.playerRed,
      ),
      scaffoldBackgroundColor: AppColors.bgLight,
      textTheme: textTheme.apply(
        bodyColor: AppColors.textLightPrimary,
        displayColor: AppColors.textLightPrimary,
      ),
    );
  }

  static ThemeData get darkTheme {
    final textTheme = GoogleFonts.poppinsTextTheme();
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.primaryGold,
        onPrimary: Colors.black,
        secondary: AppColors.goldLight,
        surface: AppColors.surfaceDark,
        onSurface: AppColors.textDarkPrimary,
        error: AppColors.playerRed,
      ),
      scaffoldBackgroundColor: AppColors.bgDark,
      textTheme: textTheme.apply(
        bodyColor: AppColors.textDarkPrimary,
        displayColor: AppColors.textDarkPrimary,
      ),
    );
  }
}`
  },
  {
    path: 'lib/app/routes.dart',
    name: 'routes.dart',
    category: 'app',
    description: 'Centralized route table with custom fade and slide page transitions',
    content: `import 'package:flutter/material.dart';
import '../auth/controllers/auth_controller.dart';
import '../auth/screens/login_screen.dart';
import '../core/theme/theme_controller.dart';
import '../home/screens/home_screen.dart';
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
        return _buildFadeRoute(SplashScreen(authController: authController), settings);
      case login:
        return _buildFadeRoute(LoginScreen(authController: authController), settings);
      case home:
        return _buildSlideRoute(HomeScreen(authController: authController), settings);
      default:
        return MaterialPageRoute(builder: (_) => SplashScreen(authController: authController));
    }
  }

  static PageRouteBuilder _buildFadeRoute(Widget page, RouteSettings settings) {
    return PageRouteBuilder(
      settings: settings,
      transitionDuration: const Duration(milliseconds: 600),
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        return FadeTransition(opacity: animation, child: child);
      },
    );
  }

  static PageRouteBuilder _buildSlideRoute(Widget page, RouteSettings settings) {
    return PageRouteBuilder(
      settings: settings,
      transitionDuration: const Duration(milliseconds: 380),
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        return SlideTransition(
          position: Tween<Offset>(begin: const Offset(1, 0), end: Offset.zero).animate(animation),
          child: child,
        );
      },
    );
  }
}`
  },
  {
    path: 'lib/core/constants/app_colors.dart',
    name: 'app_colors.dart',
    category: 'core',
    description: 'Signature color palette: Red, Green, Yellow, Blue, Gold, Safe Star, and surface neutrals',
    content: `import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // Brand Primaries
  static const Color primaryGold = Color(0xFFFFB800);
  static const Color goldLight = Color(0xFFFFD54F);
  static const Color goldDark = Color(0xFFC78A00);
  
  static const Color brandPurple = Color(0xFF5B21B6);
  static const Color brandIndigo = Color(0xFF4338CA);

  // Four Ludo Player Colors
  static const Color playerRed = Color(0xFFE11D48);
  static const Color playerGreen = Color(0xFF10B981);
  static const Color playerYellow = Color(0xFFFBBF24);
  static const Color playerBlue = Color(0xFF2563EB);

  // Safe Cell & Board Highlights
  static const Color safeStar = Color(0xFFFFD700);
  static const Color boardPathBorder = Color(0xFFE2E8F0);
  static const Color boardPathBorderDark = Color(0xFF334155);

  // Backgrounds & Surfaces
  static const Color bgLight = Color(0xFFF8FAFC);
  static const Color surfaceLight = Color(0xFFFFFFFF);
  static const Color textLightPrimary = Color(0xFF0F172A);

  static const Color bgDark = Color(0xFF0B0F19);
  static const Color surfaceDark = Color(0xFF131C2E);
  static const Color cardDark = Color(0xFF1E293B);
  static const Color textDarkPrimary = Color(0xFFF8FAFC);
}`
  },
  {
    path: 'lib/core/widgets/jk_button.dart',
    name: 'jk_button.dart',
    category: 'widgets',
    description: 'Reusable game buttons: Primary gold gradient, secondary dark, outline, and danger',
    content: `import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

enum JkButtonVariant { primaryGold, secondary, outline, danger }

class JkButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;
  final JkButtonVariant variant;
  final bool isLoading;
  final bool isFullWidth;

  const JkButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.variant = JkButtonVariant.primaryGold,
    this.isLoading = false,
    this.isFullWidth = false,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: isLoading ? null : onPressed,
      child: Text(label),
    );
  }
}`
  },
  {
    path: 'lib/core/widgets/jk_avatar.dart',
    name: 'jk_avatar.dart',
    category: 'widgets',
    description: 'Player avatar widget with gold ring, level badge, online presence dot, and initials fallback',
    content: `import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

class JkAvatar extends StatelessWidget {
  final String? photoUrl;
  final String name;
  final double radius;
  final int? level;
  final bool isOnline;

  const JkAvatar({
    super.key,
    this.photoUrl,
    required this.name,
    this.radius = 24.0,
    this.level,
    this.isOnline = true,
  });

  @override
  Widget build(BuildContext context) {
    return CircleAvatar(
      radius: radius,
      backgroundImage: photoUrl != null ? NetworkImage(photoUrl!) : null,
      child: photoUrl == null ? Text(name[0]) : null,
    );
  }
}`
  },
  {
    path: 'lib/splash/screens/splash_screen.dart',
    name: 'splash_screen.dart',
    category: 'screens',
    description: 'Cinematic mobile game intro with CustomPainter golden board, 3D dice, 4 pawns, crown, shimmer logo & skip',
    content: `import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../auth/controllers/auth_controller.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_constants.dart';

class SplashScreen extends StatefulWidget {
  final AuthController authController;
  final bool forceFullIntro;

  const SplashScreen({
    super.key,
    required this.authController,
    this.forceFullIntro = false,
  });

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  // Staged timeline curves
  late final Animation<double> _crownAnimation;
  late final Animation<double> _diceScaleAnimation;
  late final Animation<double> _pawnsConvergenceAnimation;
  late final Animation<double> _boardDrawAnimation;
  late final Animation<double> _logoRevealAnimation;
  late final Animation<double> _taglineAnimation;
  late final Animation<double> _exitFadeAnimation;
  late final Animation<double> _shimmerSweepAnimation;

  bool _isFirstLaunch = true;
  bool _hasNavigated = false;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 3200),
    );

    // Step 2: Golden Crown (10% -> 28%)
    _crownAnimation = CurvedAnimation(
      parent: _controller,
      curve: const Interval(0.10, 0.28, curve: Curves.easeOutBack),
    );

    // Step 3: Premium 3D Dice (25% -> 45%)
    _diceScaleAnimation = CurvedAnimation(
      parent: _controller,
      curve: const Interval(0.25, 0.45, curve: Curves.elasticOut),
    );

    // Step 4: Four 3D Pawns (40% -> 60%)
    _pawnsConvergenceAnimation = CurvedAnimation(
      parent: _controller,
      curve: const Interval(0.40, 0.60, curve: Curves.easeOutCubic),
    );

    // Step 5: Golden Board Outline CustomPainter (50% -> 75%)
    _boardDrawAnimation = CurvedAnimation(
      parent: _controller,
      curve: const Interval(0.50, 0.75, curve: Curves.easeInOut),
    );

    // Step 6: JK LODU Logo Typography (65% -> 85%)
    _logoRevealAnimation = CurvedAnimation(
      parent: _controller,
      curve: const Interval(0.65, 0.85, curve: Curves.easeOutBack),
    );

    // Step 7: Tagline Reveal (78% -> 92%)
    _taglineAnimation = CurvedAnimation(
      parent: _controller,
      curve: const Interval(0.78, 0.92, curve: Curves.easeIn),
    );

    // Shimmer sweep across logo (70% -> 100%)
    _shimmerSweepAnimation = CurvedAnimation(
      parent: _controller,
      curve: const Interval(0.70, 1.0, curve: Curves.linear),
    );

    // Step 9: Smooth Exit Transition (94% -> 100%)
    _exitFadeAnimation = CurvedAnimation(
      parent: _controller,
      curve: const Interval(0.94, 1.0, curve: Curves.easeOut),
    );

    _controller.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        _navigateToNext();
      }
    });

    _checkLaunchTypeAndStart();
  }

  Future<void> _checkLaunchTypeAndStart() async {
    final prefs = await SharedPreferences.getInstance();
    _isFirstLaunch = prefs.getBool('has_seen_cinematic_intro') != true;
    if (_isFirstLaunch) {
      await prefs.setBool('has_seen_cinematic_intro', true);
    }

    if (!mounted) return;
    if (!_isFirstLaunch && !widget.forceFullIntro) {
      // Shortened version: speed up 1.5x
      _controller.duration = const Duration(milliseconds: 2000);
    }
    _controller.forward();
  }

  void _skip() {
    if (_hasNavigated) return;
    _controller.stop();
    _navigateToNext();
  }

  Future<void> _navigateToNext() async {
    if (_hasNavigated || !mounted) return;
    _hasNavigated = true;

    await widget.authController.checkInitialAuth();
    if (!mounted) return;

    final targetRoute = widget.authController.isAuthenticated ? '/home' : '/login';
    Navigator.of(context).pushReplacementNamed(targetRoute);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF02040A),
      body: GestureDetector(
        onTap: _skip,
        behavior: HitTestBehavior.opaque,
        child: AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            final exitOpacity = 1.0 - _exitFadeAnimation.value;
            final exitScale = 1.0 + (_exitFadeAnimation.value * 0.05);

            return Opacity(
              opacity: exitOpacity.clamp(0.0, 1.0),
              child: Transform.scale(
                scale: exitScale,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    // Deep Royal Navy Radial Gradient Background
                    Container(
                      decoration: const BoxDecoration(
                        gradient: RadialGradient(
                          center: Alignment(0.0, -0.1),
                          radius: 1.1,
                          colors: [
                            Color(0xFF0D1C44),
                            Color(0xFF081026),
                            Color(0xFF02040A),
                          ],
                          stops: [0.0, 0.55, 1.0],
                        ),
                      ),
                    ),

                    // Atmospheric Vignette & Glowing Core
                    Center(
                      child: Container(
                        width: 380,
                        height: 380,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFFF59E0B).withOpacity(0.06),
                              blurRadius: 100,
                              spreadRadius: 40,
                            ),
                          ],
                        ),
                      ),
                    ),

                    // Step 5: Golden Ludo Board Outline (CustomPainter)
                    Center(
                      child: CustomPaint(
                        size: const Size(260, 260),
                        painter: GoldenBoardPainter(
                          progress: _boardDrawAnimation.value,
                        ),
                      ),
                    ),

                    // Central Emblem Stage
                    Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          SizedBox(
                            width: 220,
                            height: 220,
                            child: Stack(
                              alignment: Alignment.center,
                              children: [
                                // Step 2: Golden Crown
                                Positioned(
                                  top: 10 - (4 * math.sin(_controller.value * math.pi * 4)),
                                  child: Opacity(
                                    opacity: _crownAnimation.value.clamp(0.0, 1.0),
                                    child: Transform.scale(
                                      scale: _crownAnimation.value,
                                      child: const _GoldenCrownWidget(),
                                    ),
                                  ),
                                ),

                                // Step 4: Four 3D Pawns
                                ..._buildFourPawns(_pawnsConvergenceAnimation.value),

                                // Step 3: Premium 3D Dice
                                Transform.scale(
                                  scale: _diceScaleAnimation.value,
                                  child: Transform.rotate(
                                    angle: (1.0 - _diceScaleAnimation.value) * -0.5,
                                    child: const _Premium3DDiceWidget(),
                                  ),
                                ),
                              ],
                            ),
                          ),

                          const SizedBox(height: 12),

                          // Step 6: JK LODU Logo Typography
                          Opacity(
                            opacity: _logoRevealAnimation.value.clamp(0.0, 1.0),
                            child: Transform.translate(
                              offset: Offset(0, (1.0 - _logoRevealAnimation.value) * 15),
                              child: _buildLogoWithShimmer(),
                            ),
                          ),

                          const SizedBox(height: 8),

                          // Step 7: Tagline
                          Opacity(
                            opacity: _taglineAnimation.value.clamp(0.0, 1.0),
                            child: const Text(
                              "THE ULTIMATE MULTIPLAYER LUDO EXPERIENCE",
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: Color(0xFFFDE68A),
                                fontSize: 10,
                                letterSpacing: 2.2,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Discreet Skip Button
                    Positioned(
                      top: MediaQuery.of(context).padding.top + 12,
                      right: 18,
                      child: GestureDetector(
                        onTap: _skip,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.black.withOpacity(0.4),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: Colors.white12),
                          ),
                          child: const Text(
                            "SKIP ››",
                            style: TextStyle(
                              color: Colors.white70,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1.2,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  List<Widget> _buildFourPawns(double progress) {
    if (progress <= 0.0) return [];

    final distance = 60.0 - (progress * 18.0);
    return [
      // Red Pawn (Top-Left)
      Positioned(
        top: 110 - distance,
        left: 110 - distance,
        child: Opacity(
          opacity: progress.clamp(0.0, 1.0),
          child: const _Mini3DPawn(color: Color(0xFFE11D48)),
        ),
      ),
      // Green Pawn (Top-Right)
      Positioned(
        top: 110 - distance,
        right: 110 - distance,
        child: Opacity(
          opacity: progress.clamp(0.0, 1.0),
          child: const _Mini3DPawn(color: Color(0xFF10B981)),
        ),
      ),
      // Blue Pawn (Bottom-Left)
      Positioned(
        bottom: 110 - distance,
        left: 110 - distance,
        child: Opacity(
          opacity: progress.clamp(0.0, 1.0),
          child: const _Mini3DPawn(color: Color(0xFF2563EB)),
        ),
      ),
      // Yellow Pawn (Bottom-Right)
      Positioned(
        bottom: 110 - distance,
        right: 110 - distance,
        child: Opacity(
          opacity: progress.clamp(0.0, 1.0),
          child: const _Mini3DPawn(color: Color(0xFFF59E0B)),
        ),
      ),
    ];
  }

  Widget _buildLogoWithShimmer() {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        // "JK" in Golden gradient
        ShaderMask(
          shaderCallback: (bounds) => const LinearGradient(
            colors: [Color(0xFFFFFBEB), Color(0xFFFBBF24), Color(0xFFB45309)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ).createShader(bounds),
          child: const Text(
            "JK ",
            style: TextStyle(
              fontSize: 38,
              fontWeight: FontWeight.w900,
              letterSpacing: 2.0,
              color: Colors.white,
            ),
          ),
        ),
        // "LODU" in Platinum Silver Chrome
        ShaderMask(
          shaderCallback: (bounds) => const LinearGradient(
            colors: [Color(0xFFFFFFFF), Color(0xFFE2E8F0), Color(0xFF94A3B8)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ).createShader(bounds),
          child: const Text(
            "LODU",
            style: TextStyle(
              fontSize: 38,
              fontWeight: FontWeight.w900,
              letterSpacing: 2.0,
              color: Colors.white,
            ),
          ),
        ),
      ],
    );
  }
}

// CustomPainter drawing the golden metallic board outline
class GoldenBoardPainter extends CustomPainter {
  final double progress;

  GoldenBoardPainter({required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    if (progress <= 0) return;

    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0
      ..shader = const LinearGradient(
        colors: [Color(0xFFFDE68A), Color(0xFFF59E0B), Color(0xFFB45309)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));

    final glowPaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4.0
      ..color = const Color(0xFFF59E0B).withOpacity(0.3 * progress)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 6);

    final rect = RRect.fromRectAndRadius(
      Rect.fromLTWH(10, 10, size.width - 20, size.height - 20),
      const Radius.circular(20),
    );

    // Draw outer frame
    canvas.drawRRect(rect, glowPaint);
    canvas.drawRRect(rect, paint);

    // Quadrant boxes
    final quadSize = (size.width - 40) * 0.38;
    canvas.drawRRect(
      RRect.fromRectAndRadius(Rect.fromLTWH(18, 18, quadSize, quadSize), const Radius.circular(10)),
      Paint()..style = PaintingStyle.stroke..strokeWidth = 1.2..color = const Color(0xFFE11D48).withOpacity(0.8 * progress),
    );
    canvas.drawRRect(
      RRect.fromRectAndRadius(Rect.fromLTWH(size.width - 18 - quadSize, 18, quadSize, quadSize), const Radius.circular(10)),
      Paint()..style = PaintingStyle.stroke..strokeWidth = 1.2..color = const Color(0xFF10B981).withOpacity(0.8 * progress),
    );
    canvas.drawRRect(
      RRect.fromRectAndRadius(Rect.fromLTWH(18, size.height - 18 - quadSize, quadSize, quadSize), const Radius.circular(10)),
      Paint()..style = PaintingStyle.stroke..strokeWidth = 1.2..color = const Color(0xFF2563EB).withOpacity(0.8 * progress),
    );
    canvas.drawRRect(
      RRect.fromRectAndRadius(Rect.fromLTWH(size.width - 18 - quadSize, size.height - 18 - quadSize, quadSize, quadSize), const Radius.circular(10)),
      Paint()..style = PaintingStyle.stroke..strokeWidth = 1.2..color = const Color(0xFFF59E0B).withOpacity(0.8 * progress),
    );
  }

  @override
  bool shouldRepaint(covariant GoldenBoardPainter oldDelegate) =>
      oldDelegate.progress != progress;
}

// 3D-Styled White Dice Widget
class _Premium3DDiceWidget extends StatelessWidget {
  const _Premium3DDiceWidget();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 58,
      height: 58,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(14),
        gradient: const LinearGradient(
          colors: [Color(0xFFFFFFFF), Color(0xFFF1F5F9), Color(0xFFCBD5E1)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.65),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
          const BoxShadow(
            color: Colors.white,
            blurRadius: 4,
            offset: Offset(-1, -1),
          ),
        ],
      ),
      child: Center(
        child: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(10),
            color: const Color(0xFFF8FAFC),
          ),
          child: const Center(
            child: Icon(
              Icons.casino_rounded,
              size: 38,
              color: Color(0xFFB45309),
            ),
          ),
        ),
      ),
    );
  }
}

// 3D Mini Pawn
class _Mini3DPawn extends StatelessWidget {
  final Color color;
  const _Mini3DPawn({required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 24,
      height: 24,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: RadialGradient(
          center: const Alignment(-0.3, -0.3),
          colors: [
            Colors.white.withOpacity(0.9),
            color,
            color.withOpacity(0.6),
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.5),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
    );
  }
}

// Golden Crown
class _GoldenCrownWidget extends StatelessWidget {
  const _GoldenCrownWidget();

  @override
  Widget build(BuildContext context) {
    return const Icon(
      Icons.military_tech_rounded,
      color: Color(0xFFFFB800),
      size: 36,
    );
  }
}`
  },
  {
    path: 'lib/auth/models/user_model.dart',
    name: 'user_model.dart',
    category: 'auth',
    description: 'Player model with UID, PlayerID, level, XP, coins, diamonds, win rate, and achievements',
    content: `enum AuthStatus { initial, unauthenticated, authenticated, guest }

class UserModel {
  final String uid;
  final String displayName;
  final String email;
  final String photoUrl;
  final String? customPhotoUrl;
  final String playerId;
  final int level;
  final int xp;
  final int wins;
  final int losses;
  final int gamesPlayed;
  final int coins;
  final int diamonds;
  final List<String> achievements;
  final DateTime createdAt;

  UserModel({
    required this.uid,
    required this.displayName,
    required this.email,
    required this.photoUrl,
    this.customPhotoUrl,
    required this.playerId,
    this.level = 1,
    this.xp = 120,
    this.wins = 12,
    this.losses = 4,
    this.gamesPlayed = 16,
    this.coins = 2500,
    this.diamonds = 45,
    List<String>? achievements,
    DateTime? createdAt,
  }) : achievements = achievements ?? const ['First Win', 'Welcome Master'],
       createdAt = createdAt ?? DateTime.now();

  double get winRate => gamesPlayed == 0 ? 0 : (wins / gamesPlayed) * 100;
  String get activePhoto => customPhotoUrl ?? photoUrl;
}`
  },
  {
    path: 'lib/home/screens/home_screen.dart',
    name: 'home_screen.dart',
    category: 'screens',
    description: 'AAA-quality high-end multiplayer game lobby with real player status, 3D Hero Quick Play, Daily Rewards & full navigation',
    content: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../auth/controllers/auth_controller.dart';
import '../../core/constants/app_colors.dart';
import '../widgets/home_widgets.dart';

class HomeScreen extends StatefulWidget {
  final AuthController authController;

  const HomeScreen({super.key, required this.authController});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with SingleTickerProviderStateMixin {
  int _currentBottomNavIndex = 0;
  bool _isDailyClaimed = false;
  int _coins = 48500;
  int _gems = 142;

  void _claimDailyReward() {
    if (_isDailyClaimed) return;
    HapticFeedback.mediumImpact();
    setState(() {
      _isDailyClaimed = true;
      _coins += 2500;
      _gems += 10;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('🎉 Claimed Day 4 Bonus: +2,500 Coins & +10 Gems!'),
        backgroundColor: AppColors.primaryGold,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = widget.authController.currentUser;
    final isTablet = MediaQuery.of(context).size.width >= 600;

    return Scaffold(
      backgroundColor: const Color(0xFF070B19),
      body: Stack(
        children: [
          SafeArea(
            bottom: false,
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: EdgeInsets.symmetric(
                horizontal: isTablet ? 32 : 16,
                vertical: 12,
              ),
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 680),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      PremiumPlayerHeader(
                        username: user?.displayName ?? 'Alex Rivers',
                        playerId: user?.playerId ?? 'JK-4821',
                        photoUrl: user?.activePhoto ?? '',
                        level: user?.level ?? 5,
                        currentXp: 1450,
                        targetXp: 2000,
                        coins: _coins,
                        gems: _gems,
                        onNotificationTap: () {},
                        onSettingsTap: () => Navigator.pushNamed(context, '/settings'),
                        onProfileTap: () => Navigator.pushNamed(context, '/profile'),
                      ),
                      const SizedBox(height: 12),
                      DailyRewardCard(
                        dayNumber: 4,
                        coinsBonus: 2500,
                        gemsBonus: 10,
                        isClaimed: _isDailyClaimed,
                        onClaim: _claimDailyReward,
                      ),
                      const SizedBox(height: 14),
                      HeroQuickPlayCard(
                        onPlayNow: () => Navigator.pushNamed(context, '/game'),
                      ),
                      const SizedBox(height: 14),
                      Row(
                        children: [
                          Expanded(
                            child: RoomActionCard(
                              title: 'CREATE ROOM',
                              subtitle: 'Host private table',
                              badgeText: 'Instant Code',
                              icon: Icons.group_add_rounded,
                              gradientColors: const [Color(0xFF1D4ED8), Color(0xFF1E1B4B)],
                              borderColor: const Color(0xFF3B82F6),
                              onTap: () => Navigator.pushNamed(context, '/create-room'),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: RoomActionCard(
                              title: 'JOIN ROOM',
                              subtitle: 'Enter 6-digit code',
                              badgeText: 'Quick Enter',
                              icon: Icons.vpn_key_rounded,
                              gradientColors: const [Color(0xFF047857), Color(0xFF064E3B)],
                              borderColor: const Color(0xFF10B981),
                              onTap: () => Navigator.pushNamed(context, '/join-room'),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          Expanded(
                            child: GameModeCard(
                              title: 'PLAY VS AI',
                              subtitle: 'Bots & Offline',
                              icon: Icons.smart_toy_rounded,
                              iconColor: const Color(0xFFF43F5E),
                              onTap: () => Navigator.pushNamed(context, '/game'),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: GameModeCard(
                              title: 'ALL MODES',
                              subtitle: 'Pass&Play, 2P/4P',
                              icon: Icons.sports_esports_rounded,
                              iconColor: const Color(0xFFF59E0B),
                              onTap: () => Navigator.pushNamed(context, '/game'),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      OnlineFriendCard(
                        onViewAll: () => Navigator.pushNamed(context, '/friends'),
                        onInvite: (name) {},
                      ),
                      const SizedBox(height: 14),
                      RecentMatchCard(
                        onViewAll: () => Navigator.pushNamed(context, '/match-history'),
                      ),
                      const SizedBox(height: 14),
                      LeaderboardPreview(
                        onViewAll: () => Navigator.pushNamed(context, '/leaderboard'),
                      ),
                      const SizedBox(height: 14),
                      CollectionPreview(
                        onViewAll: () => Navigator.pushNamed(context, '/collections'),
                      ),
                      const SizedBox(height: 80),
                    ],
                  ),
                ),
              ),
            ),
          ),
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: PremiumBottomNavigation(
              currentIndex: _currentBottomNavIndex,
              onTap: (index) {
                setState(() => _currentBottomNavIndex = index);
                if (index == 1) Navigator.pushNamed(context, '/friends');
                if (index == 2) Navigator.pushNamed(context, '/game');
                if (index == 3) Navigator.pushNamed(context, '/leaderboard');
                if (index == 4) Navigator.pushNamed(context, '/profile');
              },
            ),
          ),
        ],
      ),
    );
  }
}
`
  },
  {
    path: 'lib/home/widgets/home_widgets.dart',
    name: 'home_widgets.dart',
    category: 'widgets',
    description: 'Modular UI components for PremiumPlayerHeader, HeroQuickPlayCard, DailyRewardCard, RoomActionCard, etc.',
    content: `import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';

class PremiumPlayerHeader extends StatelessWidget {
  final String username;
  final String playerId;
  final String photoUrl;
  final int level;
  final int currentXp;
  final int targetXp;
  final int coins;
  final int gems;
  final VoidCallback onNotificationTap;
  final VoidCallback onSettingsTap;
  final VoidCallback onProfileTap;

  const PremiumPlayerHeader({
    super.key,
    required this.username,
    required this.playerId,
    required this.photoUrl,
    required this.level,
    required this.currentXp,
    required this.targetXp,
    required this.coins,
    required this.gems,
    required this.onNotificationTap,
    required this.onSettingsTap,
    required this.onProfileTap,
  });

  @override
  Widget build(BuildContext context) {
    final xpRatio = (currentXp / targetXp).clamp(0.0, 1.0);

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF0B132B).withOpacity(0.95),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.primaryGold.withOpacity(0.35)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.5),
            blurRadius: 16,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              GestureDetector(
                onTap: onProfileTap,
                child: Stack(
                  children: [
                    Container(
                      width: 46,
                      height: 46,
                      padding: const EdgeInsets.all(2),
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: LinearGradient(
                          colors: [Color(0xFFFBBF24), Color(0xFFD97706)],
                        ),
                      ),
                      child: ClipOval(
                        child: photoUrl.isNotEmpty
                            ? Image.network(photoUrl, fit: BoxFit.cover)
                            : const Icon(Icons.person, color: Colors.white70),
                      ),
                    ),
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                        decoration: BoxDecoration(
                          color: AppColors.primaryGold,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.black, width: 1),
                        ),
                        child: Text(
                          'Lv.\$level',
                          style: const TextStyle(
                            fontSize: 8,
                            fontWeight: FontWeight.w900,
                            color: Colors.black,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          username,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 13,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 0.5,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                          decoration: BoxDecoration(
                            color: AppColors.primaryGold.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text(
                            'PRO',
                            style: TextStyle(
                              color: AppColors.primaryGold,
                              fontSize: 8,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      playerId,
                      style: const TextStyle(
                        color: Color(0xFF94A3B8),
                        fontSize: 10,
                        fontFamily: 'monospace',
                      ),
                    ),
                  ],
                ),
              ),
              CurrencyBadge(
                icon: Icons.monetization_on_rounded,
                value: coins.toString(),
                color: AppColors.primaryGold,
              ),
              const SizedBox(width: 6),
              CurrencyBadge(
                icon: Icons.diamond_rounded,
                value: gems.toString(),
                color: Colors.indigoAccent,
              ),
              const SizedBox(width: 6),
              IconButton(
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
                icon: const Icon(Icons.settings_outlined, size: 18, color: Colors.white70),
                onPressed: onSettingsTap,
              ),
            ],
          ),
          const SizedBox(height: 8),
          XPProgressBar(progress: xpRatio, current: currentXp, target: targetXp),
        ],
      ),
    );
  }
}

class XPProgressBar extends StatelessWidget {
  final double progress;
  final int current;
  final int target;

  const XPProgressBar({
    super.key,
    required this.progress,
    required this.current,
    required this.target,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'XP PROGRESS',
              style: TextStyle(color: Color(0xFF94A3B8), fontSize: 8, fontWeight: FontWeight.bold),
            ),
            Text(
              '\$current / \$target XP',
              style: const TextStyle(color: AppColors.primaryGold, fontSize: 8, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        const SizedBox(height: 3),
        ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: LinearProgressIndicator(
            value: progress,
            backgroundColor: Colors.black45,
            valueColor: const AlwaysStoppedAnimation<Color>(AppColors.primaryGold),
            minHeight: 5,
          ),
        ),
      ],
    );
  }
}

class CurrencyBadge extends StatelessWidget {
  final IconData icon;
  final String value;
  final Color color;

  const CurrencyBadge({
    super.key,
    required this.icon,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.5),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: color.withOpacity(0.4)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: color),
          const SizedBox(width: 4),
          Text(
            value,
            style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.w900),
          ),
        ],
      ),
    );
  }
}

class DailyRewardCard extends StatelessWidget {
  final int dayNumber;
  final int coinsBonus;
  final int gemsBonus;
  final bool isClaimed;
  final VoidCallback onClaim;

  const DailyRewardCard({
    super.key,
    required this.dayNumber,
    required this.coinsBonus,
    required this.gemsBonus,
    required this.isClaimed,
    required this.onClaim,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.primaryGold.withOpacity(0.18),
            Colors.indigo.withOpacity(0.12),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.primaryGold.withOpacity(0.4)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppColors.primaryGold.withOpacity(0.2),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.card_giftcard, color: AppColors.primaryGold, size: 20),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'DAILY REWARDS • DAY \$dayNumber',
                  style: const TextStyle(
                    color: AppColors.primaryGold,
                    fontSize: 11,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                Text(
                  '+\$coinsBonus Coins & +\$gemsBonus Gems ready',
                  style: const TextStyle(color: Colors.white70, fontSize: 9),
                ),
              ],
            ),
          ),
          ElevatedButton(
            onPressed: onClaim,
            style: ElevatedButton.styleFrom(
              backgroundColor: isClaimed ? Colors.grey[800] : AppColors.primaryGold,
              foregroundColor: Colors.black,
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            child: Text(
              isClaimed ? 'CLAIMED' : 'CLAIM',
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w900,
                color: isClaimed ? Colors.white54 : Colors.black,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class HeroQuickPlayCard extends StatelessWidget {
  final VoidCallback onPlayNow;

  const HeroQuickPlayCard({super.key, required this.onPlayNow});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0xFF0F1E3D), Color(0xFF070D1E)],
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.primaryGold.withOpacity(0.55)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: Colors.greenAccent.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.greenAccent.withOpacity(0.5)),
                ),
                child: const Row(
                  children: [
                    CircleAvatar(radius: 3, backgroundColor: Colors.greenAccent),
                    SizedBox(width: 4),
                    Text(
                      '1,420 ONLINE NOW',
                      style: TextStyle(color: Colors.greenAccent, fontSize: 8, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
              const Text(
                'FAST RULES • 4P TABLE',
                style: TextStyle(color: AppColors.primaryGold, fontSize: 9, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Center(
            child: Icon(Icons.casino_rounded, size: 54, color: AppColors.primaryGold),
          ),
          const SizedBox(height: 8),
          const Text(
            'QUICK PLAY',
            style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900, letterSpacing: 1),
          ),
          const Text(
            '2 or 4 Player Ludo • Instant Table Matching',
            style: TextStyle(color: Colors.white70, fontSize: 11),
          ),
          const SizedBox(height: 14),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: onPlayNow,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryGold,
                foregroundColor: Colors.black,
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.play_arrow_rounded, size: 20, color: Colors.black),
                  SizedBox(width: 6),
                  Text('PLAY NOW', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13, letterSpacing: 1)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class RoomActionCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final String badgeText;
  final IconData icon;
  final List<Color> gradientColors;
  final Color borderColor;
  final VoidCallback onTap;

  const RoomActionCard({
    super.key,
    required this.title,
    required this.subtitle,
    required this.badgeText,
    required this.icon,
    required this.gradientColors,
    required this.borderColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          gradient: LinearGradient(colors: gradientColors),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: borderColor.withOpacity(0.5)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: Colors.white, size: 22),
            const SizedBox(height: 10),
            Text(title, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w900)),
            Text(subtitle, style: const TextStyle(color: Colors.white70, fontSize: 9)),
            const SizedBox(height: 6),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: Colors.black26,
                borderRadius: BorderRadius.circular(6),
              ),
              child: Text(badgeText, style: const TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }
}

class GameModeCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color iconColor;
  final VoidCallback onTap;

  const GameModeCard({
    super.key,
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.iconColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: const Color(0xFF0B132B),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: Colors.white12),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: iconColor.withOpacity(0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, size: 16, color: iconColor),
            ),
            const SizedBox(width: 8),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w900)),
                Text(subtitle, style: const TextStyle(color: Colors.white54, fontSize: 8)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class OnlineFriendCard extends StatelessWidget {
  final VoidCallback onViewAll;
  final Function(String) onInvite;

  const OnlineFriendCard({super.key, required this.onViewAll, required this.onInvite});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF0B132B),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Colors.white12),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'ONLINE NOW (3)',
                style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w900),
              ),
              GestureDetector(
                onTap: onViewAll,
                child: const Text(
                  'VIEW ALL ›',
                  style: TextStyle(color: AppColors.primaryGold, fontSize: 9, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              _buildFriendItem('Sarah Connor', 'Lv.8', true),
              const SizedBox(width: 8),
              _buildFriendItem('David Kim', 'Lv.12', true),
              const SizedBox(width: 8),
              _buildFriendItem('Marcus Vance', 'Lv.4', false),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFriendItem(String name, String level, bool online) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: Colors.black26,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.white10),
        ),
        child: Column(
          children: [
            Stack(
              children: [
                const CircleAvatar(radius: 14, backgroundColor: Colors.white24, child: Icon(Icons.person, size: 16)),
                if (online)
                  const Positioned(
                    bottom: 0,
                    right: 0,
                    child: CircleAvatar(radius: 3, backgroundColor: Colors.greenAccent),
                  ),
              ],
            ),
            const SizedBox(height: 4),
            Text(name, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold)),
            Text(level, style: const TextStyle(color: AppColors.primaryGold, fontSize: 8)),
          ],
        ),
      ),
    );
  }
}

class RecentMatchCard extends StatelessWidget {
  final VoidCallback onViewAll;

  const RecentMatchCard({super.key, required this.onViewAll});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF0B132B),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Colors.white12),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('RECENT MATCHES', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w900)),
              GestureDetector(
                onTap: onViewAll,
                child: const Text('VIEW ALL ›', style: TextStyle(color: AppColors.primaryGold, fontSize: 9, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 8),
          _buildMatchRow('WIN', 'vs Marcus Vance', '4P Classic • +180 XP', Colors.greenAccent),
          const SizedBox(height: 6),
          _buildMatchRow('2ND', 'vs Elena Rostova', 'Quick Mode • +95 XP', AppColors.primaryGold),
        ],
      ),
    );
  }

  Widget _buildMatchRow(String tag, String title, String subtitle, Color tagColor) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
              decoration: BoxDecoration(
                color: tagColor.withOpacity(0.2),
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(tag, style: TextStyle(color: tagColor, fontSize: 8, fontWeight: FontWeight.w900)),
            ),
            const SizedBox(width: 8),
            Text(title, style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
          ],
        ),
        Text(subtitle, style: const TextStyle(color: Colors.white54, fontSize: 8)),
      ],
    );
  }
}

class LeaderboardPreview extends StatelessWidget {
  final VoidCallback onViewAll;

  const LeaderboardPreview({super.key, required this.onViewAll});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF0B132B),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Colors.white12),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('LEADERBOARD PREVIEW', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w900)),
              GestureDetector(
                onTap: onViewAll,
                child: const Text('VIEW ALL ›', style: TextStyle(color: AppColors.primaryGold, fontSize: 9, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 8),
          _buildLeaderboardRow('🥇', 'KingAamir', '18,400 XP'),
          const SizedBox(height: 4),
          _buildLeaderboardRow('🥈', 'QueenLudo', '15,200 XP'),
          const SizedBox(height: 4),
          _buildLeaderboardRow('🥉', 'DiceMaster99', '13,850 XP'),
        ],
      ),
    );
  }

  Widget _buildLeaderboardRow(String medal, String name, String xp) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Text(medal, style: const TextStyle(fontSize: 12)),
            const SizedBox(width: 8),
            Text(name, style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
          ],
        ),
        Text(xp, style: const TextStyle(color: AppColors.primaryGold, fontSize: 9, fontWeight: FontWeight.bold)),
      ],
    );
  }
}

class CollectionPreview extends StatelessWidget {
  final VoidCallback onViewAll;

  const CollectionPreview({super.key, required this.onViewAll});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF0B132B),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Colors.white12),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('COLLECTION VAULT', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w900)),
              GestureDetector(
                onTap: onViewAll,
                child: const Text('VIEW VAULT ›', style: TextStyle(color: AppColors.primaryGold, fontSize: 9, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 8),
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _CollectionPill(name: 'Gold Pawn', status: 'Equipped 👑'),
              _CollectionPill(name: 'Diamond Dice', status: 'Equipped 💎'),
              _CollectionPill(name: 'Cyber Board', status: 'Unlocked ⚡'),
            ],
          ),
        ],
      ),
    );
  }
}

class _CollectionPill extends StatelessWidget {
  final String name;
  final String status;

  const _CollectionPill({required this.name, required this.status});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.black38,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        children: [
          Text(name, style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold)),
          const SizedBox(height: 2),
          Text(status, style: const TextStyle(color: AppColors.primaryGold, fontSize: 7, fontWeight: FontWeight.w900)),
        ],
      ),
    );
  }
}

class PremiumBottomNavigation extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;

  const PremiumBottomNavigation({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF070B19).withOpacity(0.95),
        border: const Border(top: BorderSide(color: Colors.white12)),
      ),
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildItem(0, Icons.home_rounded, 'HOME'),
          _buildItem(1, Icons.people_alt_rounded, 'FRIENDS'),
          _buildItem(2, Icons.sports_esports_rounded, 'GAMES'),
          _buildItem(3, Icons.emoji_events_rounded, 'RANKS'),
          _buildItem(4, Icons.person_rounded, 'PROFILE'),
        ],
      ),
    );
  }

  Widget _buildItem(int index, IconData icon, String label) {
    final active = currentIndex == index;
    return GestureDetector(
      onTap: () => onTap(index),
      behavior: HitTestBehavior.opaque,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 20, color: active ? AppColors.primaryGold : Colors.white54),
          const SizedBox(height: 2),
          Text(
            label,
            style: TextStyle(
              fontSize: 8,
              fontWeight: active ? FontWeight.w900 : FontWeight.bold,
              color: active ? AppColors.primaryGold : Colors.white54,
            ),
          ),
        ],
      ),
    );
  }
}
`
  }
];

export const ROADMAP_PHASES: PhaseItem[] = [
  { number: 1, title: 'Project Setup + Architecture', status: 'completed', description: 'Clean folder structure, pubspec.yaml, analysis_options, core constants, DI & main app shell.' },
  { number: 2, title: 'Cinematic Splash + Navigation', status: 'completed', description: 'Staged 3D animation timeline (Crown -> Dice -> Pawns -> Board), audio, skip & first-launch persistence.' },
  { number: 3, title: '3D Golden Ludo Board', status: 'completed', description: 'Responsive 4-player 15x15 board geometry, 4 home bases, colored tracks, safe star cells & center finish.' },
  { number: 4, title: 'Authoritative Game Engine', status: 'completed', description: 'Deterministic rules engine, valid move calculator, token paths, turn management, home stretch.' },
  { number: 5, title: '3D Rolling Dice System', status: 'completed', description: 'Interactive 3D cube physics, rolling tumble animation, royal dice skins & anti-cheat roll validation.' },
  { number: 6, title: 'Pawn Movement & Animations', status: 'completed', description: 'Step-by-step path interpolation, 3D hop elevation, capture sound, star safety & victory fanfare.' },
  { number: 7, title: 'Pass & Play Local Multiplayer', status: 'completed', description: '2, 3, or 4 player pass-and-play on a single mobile screen with zero internet dependency.' },
  { number: 8, title: 'Intelligent AI Bots', status: 'completed', description: 'Heuristic evaluation, capture hunting, safe shelter priority, end-game rushing with Easy/Med/Hard tiers.' },
  { number: 9, title: 'Firebase Security & Rules', status: 'completed', description: 'Production firestore.rules and storage.rules, server-authoritative mutations & anti-cheat.' },
  { number: 10, title: 'Google Sign-In & Guest Auth', status: 'completed', description: 'Google authentication, Firebase UID identification, guest offline fallback & secure token handling.' },
  { number: 11, title: 'Player Profile & Stats', status: 'completed', description: 'Level, XP progression, win rate, coins, gems, match statistics & custom player card.' },
  { number: 12, title: 'Custom Profile Photos', status: 'completed', description: 'Avatar gallery, camera/gallery upload, cropping & Firebase Storage secure persistence.' },
  { number: 13, title: 'Main Lobby Dashboard', status: 'completed', description: 'Lobby with Instant Quick Play, Daily Rewards calendar, Create Room, Join Room, and Vs AI.' },
  { number: 14, title: 'Create Private Room', status: 'completed', description: '6-digit unique alphanumeric room codes, 2/3/4 player config, Classic & Quick modes.' },
  { number: 15, title: 'Join Room with Code', status: 'completed', description: 'Room code validation, room capacity checks, error handling & instant table launch.' },
  { number: 16, title: 'Multiplayer Lobby Room', status: 'completed', description: 'Player slots, color selection, ready state, host controls & synchronized match start.' },
  { number: 17, title: 'Real-Time Matchmaking', status: 'completed', description: 'Queue estimation, radial searching pulse, player count matching and table launch.' },
  { number: 18, title: 'Reconnection Resilience', status: 'completed', description: 'Connection status monitoring, state recovery, automatic reconnection & state preservation.' },
  { number: 19, title: 'Anti-Cheat Validator', status: 'completed', description: 'Server-side turn order verification, dice roll range enforcement & position integrity checks.' },
  { number: 20, title: 'Social & Friends System', status: 'completed', description: 'Search by JK-ID, friend requests, accept/reject, online indicators & direct match invitations.' },
  { number: 21, title: 'Global Leaderboards', status: 'completed', description: 'Global, friends, weekly & all-time rankings with Tier badges (Grandmaster, Champion).' },
  { number: 22, title: 'Skins & Collections Vault', status: 'completed', description: 'Royal Gold, Cyber Neon, Diamond, Velvet board themes, dice styles and 3D pawn skins.' },
  { number: 23, title: 'Daily Rewards & Missions', status: 'completed', description: '7-day login streak bonus calendar, daily missions with progress bars, and coin/XP claiming.' },
  { number: 24, title: 'Audio & Music Engine', status: 'completed', description: 'Centralized AudioManager with dice roll, pawn hop, capture SFX, victory fanfare & BGM.' },
  { number: 25, title: 'Haptic Feedback Engine', status: 'completed', description: 'Tactile vibration feedback for dice rolls, pawn steps, captures, and victory celebration.' },
  { number: 26, title: 'Quick Chat & Emotes', status: 'completed', description: 'Predefined tactical game messages, celebratory emotes, and real-time player reactions.' },
  { number: 27, title: 'Settings & Preferences', status: 'completed', description: 'Auto-move toggle, turn timer limits (15s/30s/45s), audio/haptics, graphics presets & English/বাংলা.' },
  { number: 28, title: 'Final Production Quality', status: 'completed', description: 'Responsive mobile shell (Pixel 7 / Tablet), Material 3 layout, 60fps animations & full Polish.' }
];
