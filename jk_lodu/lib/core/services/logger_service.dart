import 'package:flutter/foundation.dart';
import 'package:logger/logger.dart';

class LoggerService {
  static final Logger _logger = Logger(
    printer: PrettyPrinter(
      methodCount: 2,
      errorMethodCount: 8,
      lineLength: 80,
      colors: true,
      printEmojis: true,
      dateTimeFormat: DateTimeFormat.onlyTimeAndSinceStart,
    ),
  );

  static void d(String message) {
    if (kDebugMode) {
      _logger.d('[JK LODU] $message');
    }
  }

  static void i(String message) {
    _logger.i('[JK LODU] $message');
  }

  static void w(String message) {
    _logger.w('[JK LODU] $message');
  }

  static void e(String message, [dynamic error, StackTrace? stackTrace]) {
    _logger.e('[JK LODU] $message', error: error, stackTrace: stackTrace);
  }
}
