class FriendModel {
  final String uid;
  final String playerId;
  final String displayName;
  final String photoUrl;
  final int level;
  final bool isOnline;
  final bool isInGame;
  final DateTime lastSeen;

  const FriendModel({
    required this.uid,
    required this.playerId,
    required this.displayName,
    required this.photoUrl,
    required this.level,
    this.isOnline = false,
    this.isInGame = false,
    required this.lastSeen,
  });
}

class LeaderboardEntry {
  final int rank;
  final String uid;
  final String playerId;
  final String displayName;
  final String photoUrl;
  final int level;
  final int xp;
  final int wins;
  final int gamesPlayed;
  final double winRate;

  const LeaderboardEntry({
    required this.rank,
    required this.uid,
    required this.playerId,
    required this.displayName,
    required this.photoUrl,
    required this.level,
    required this.xp,
    required this.wins,
    required this.gamesPlayed,
    required this.winRate,
  });
}
