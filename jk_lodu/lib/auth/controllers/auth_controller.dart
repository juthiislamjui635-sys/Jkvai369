import 'package:flutter/material.dart';
import '../../core/services/logger_service.dart';
import '../models/user_model.dart';

class AuthController extends ChangeNotifier {
  AuthStatus _status = AuthStatus.initial;
  UserModel? _currentUser;
  bool _isLoading = false;

  AuthStatus get status => _status;
  UserModel? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _status == AuthStatus.authenticated || _status == AuthStatus.guest;
  bool get isGuest => _status == AuthStatus.guest;

  Future<void> checkInitialAuth() async {
    _isLoading = true;
    notifyListeners();

    // Check stored session or authenticate state
    await Future.delayed(const Duration(milliseconds: 900));
    // Default to unauthenticated initially so user sees login options,
    // or can tap Play Offline / Google Sign-in
    _status = AuthStatus.unauthenticated;
    _isLoading = false;
    notifyListeners();
    LoggerService.i('Auth state checked: $_status');
  }

  Future<void> loginWithGoogle() async {
    _isLoading = true;
    notifyListeners();

    try {
      // In Phase 2: Flow mock for UI routing; real Firebase in Phase 9
      await Future.delayed(const Duration(milliseconds: 1100));
      _currentUser = const UserModel(
        uid: 'goog_8872194',
        displayName: 'Alex Rivers',
        email: 'alex.rivers@gmail.com',
        photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        playerId: 'JK-4821',
        level: 5,
        xp: 640,
        wins: 28,
        losses: 9,
        gamesPlayed: 37,
        coins: 8400,
        diamonds: 120,
      );
      _status = AuthStatus.authenticated;
      LoggerService.i('Logged in via Google as: ${_currentUser?.displayName}');
    } catch (e) {
      LoggerService.e('Google login failed', e);
      _status = AuthStatus.unauthenticated;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> playAsGuest() async {
    _isLoading = true;
    notifyListeners();

    await Future.delayed(const Duration(milliseconds: 600));
    _currentUser = UserModel.guest();
    _status = AuthStatus.guest;
    _isLoading = false;
    notifyListeners();
    LoggerService.i('Proceeding as Guest offline: ${_currentUser?.displayName}');
  }

  Future<void> logout() async {
    _isLoading = true;
    notifyListeners();

    await Future.delayed(const Duration(milliseconds: 400));
    _currentUser = null;
    _status = AuthStatus.unauthenticated;
    _isLoading = false;
    notifyListeners();
    LoggerService.i('User logged out');
  }
}
