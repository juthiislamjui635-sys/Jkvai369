enum AuthStatus {
  initial,
  unauthenticated,
  authenticated,
  guest,
}

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
  })  : achievements = achievements ?? const ['First Win', 'Welcome Master'],
        createdAt = createdAt ?? DateTime.now();

  double get winRate => gamesPlayed == 0 ? 0 : (wins / gamesPlayed) * 100;

  String get activePhoto => customPhotoUrl ?? photoUrl;

  factory UserModel.guest() {
    return UserModel(
      uid: 'guest_local_001',
      displayName: 'Guest Player',
      email: '',
      photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      playerId: 'JK-9942',
      level: 1,
      xp: 50,
      wins: 0,
      losses: 0,
      gamesPlayed: 0,
      coins: 1000,
      diamonds: 10,
      achievements: const ['Welcome Master'],
      createdAt: DateTime.now(),
    );
  }

  UserModel copyWith({
    String? uid,
    String? displayName,
    String? email,
    String? photoUrl,
    String? customPhotoUrl,
    String? playerId,
    int? level,
    int? xp,
    int? wins,
    int? losses,
    int? gamesPlayed,
    int? coins,
    int? diamonds,
    List<String>? achievements,
    DateTime? createdAt,
  }) {
    return UserModel(
      uid: uid ?? this.uid,
      displayName: displayName ?? this.displayName,
      email: email ?? this.email,
      photoUrl: photoUrl ?? this.photoUrl,
      customPhotoUrl: customPhotoUrl ?? this.customPhotoUrl,
      playerId: playerId ?? this.playerId,
      level: level ?? this.level,
      xp: xp ?? this.xp,
      wins: wins ?? this.wins,
      losses: losses ?? this.losses,
      gamesPlayed: gamesPlayed ?? this.gamesPlayed,
      coins: coins ?? this.coins,
      diamonds: diamonds ?? this.diamonds,
      achievements: achievements ?? this.achievements,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
