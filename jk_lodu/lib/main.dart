import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'app/app.dart';
import 'core/services/logger_service.dart';
import 'core/services/service_locator.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Lock preferred orientations for standard mobile gameplay (Portrait preferred for mobile Ludo)
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  // Set system UI overlay style (Edge-to-edge Android/iOS navigation)
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Colors.transparent,
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  try {
    // Initialize service locator & singletons
    await initServiceLocator();
    LoggerService.i('JK LODU Service Locator initialized successfully');
  } catch (e, stack) {
    LoggerService.e('Failed during service locator initialization', e, stack);
  }

  runApp(const JkLoduApp());
}
