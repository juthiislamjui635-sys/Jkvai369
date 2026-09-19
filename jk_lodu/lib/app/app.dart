import 'package:flutter/material.dart';
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
}
