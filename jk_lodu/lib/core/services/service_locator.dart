import 'package:get_it/get_it.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../auth/controllers/auth_controller.dart';
import '../theme/theme_controller.dart';

final GetIt sl = GetIt.instance;

/// Initialize all core dependencies and singletons for JK LODU
Future<void> initServiceLocator() async {
  // Shared Preferences for local persistence
  final sharedPreferences = await SharedPreferences.getInstance();
  sl.registerLazySingleton<SharedPreferences>(() => sharedPreferences);

  // Theme Controller
  sl.registerLazySingleton<ThemeController>(() => ThemeController());

  // Auth State Controller
  sl.registerLazySingleton<AuthController>(() => AuthController());
}
