import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';

enum LudoPlayerColor {
  red,
  green,
  yellow,
  blue,
}

enum TokenState {
  home,
  onTrack,
  homeStretch,
  finished,
}

class LudoTokenModel {
  final String id;
  final LudoPlayerColor color;
  final int index; // 0, 1, 2, 3
  TokenState state;
  int trackPosition; // 0 to 51 on main track
  int homeStretchPosition; // 0 to 5 on home track
  bool isSelected;
  bool isMovable;

  LudoTokenModel({
    required this.id,
    required this.color,
    required this.index,
    this.state = TokenState.home,
    this.trackPosition = -1,
    this.homeStretchPosition = -1,
    this.isSelected = false,
    this.isMovable = false,
  });

  bool get isAtHome => state == TokenState.home;
  bool get isOnTrack => state == TokenState.onTrack;
  bool get isInHomeStretch => state == TokenState.homeStretch;
  bool get isFinished => state == TokenState.finished;

  LudoTokenModel copyWith({
    TokenState? state,
    int? trackPosition,
    int? homeStretchPosition,
    bool? isSelected,
    bool? isMovable,
  }) {
    return LudoTokenModel(
      id: id,
      color: color,
      index: index,
      state: state ?? this.state,
      trackPosition: trackPosition ?? this.trackPosition,
      homeStretchPosition: homeStretchPosition ?? this.homeStretchPosition,
      isSelected: isSelected ?? this.isSelected,
      isMovable: isMovable ?? this.isMovable,
    );
  }
}

class PlayerInfo {
  final String id;
  final String name;
  final LudoPlayerColor color;
  final String? avatarUrl;
  final bool isHost;
  final bool isYou;
  final int coins;
  final int level;

  const PlayerInfo({
    required this.id,
    required this.name,
    required this.color,
    this.avatarUrl,
    this.isHost = false,
    this.isYou = false,
    this.coins = 2500,
    this.level = 5,
  });

  Color get displayColor {
    switch (color) {
      case LudoPlayerColor.red:
        return AppColors.playerRed;
      case LudoPlayerColor.green:
        return AppColors.playerGreen;
      case LudoPlayerColor.yellow:
        return AppColors.playerYellow;
      case LudoPlayerColor.blue:
        return AppColors.playerBlue;
    }
  }

  Color get lightColor {
    switch (color) {
      case LudoPlayerColor.red:
        return AppColors.playerRedLight;
      case LudoPlayerColor.green:
        return AppColors.playerGreenLight;
      case LudoPlayerColor.yellow:
        return AppColors.playerYellowLight;
      case LudoPlayerColor.blue:
        return AppColors.playerBlueLight;
    }
  }

  Color get darkColor {
    switch (color) {
      case LudoPlayerColor.red:
        return AppColors.playerRedDark;
      case LudoPlayerColor.green:
        return AppColors.playerGreenDark;
      case LudoPlayerColor.yellow:
        return AppColors.playerYellowDark;
      case LudoPlayerColor.blue:
        return AppColors.playerBlueDark;
    }
  }

  int get startTrackIndex {
    switch (color) {
      case LudoPlayerColor.red:
        return 1;
      case LudoPlayerColor.green:
        return 14;
      case LudoPlayerColor.yellow:
        return 27;
      case LudoPlayerColor.blue:
        return 40;
    }
  }

  int get homeEntranceTrackIndex {
    switch (color) {
      case LudoPlayerColor.red:
        return 51;
      case LudoPlayerColor.green:
        return 12;
      case LudoPlayerColor.yellow:
        return 25;
      case LudoPlayerColor.blue:
        return 38;
    }
  }
}

/// Standard Ludo board cell coordinate mapping (0 to 14 for x and y on 15x15 board)
class BoardCoordinate {
  final int row;
  final int col;

  const BoardCoordinate(this.row, this.col);

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is BoardCoordinate && runtimeType == other.runtimeType && row == other.row && col == other.col;

  @override
  int get hashCode => row.hashCode ^ col.hashCode;
}

class LudoBoardPath {
  LudoBoardPath._();

  /// 52 track cell coordinates in clockwise order starting from Red start cell (Row 6, Col 1)
  static const List<BoardCoordinate> mainTrack = [
    // Top-left horizontal arm (going right)
    BoardCoordinate(6, 1),  // 0: Red Start (Safe)
    BoardCoordinate(6, 2),  // 1
    BoardCoordinate(6, 3),  // 2
    BoardCoordinate(6, 4),  // 3
    BoardCoordinate(6, 5),  // 4

    // Top arm (going up)
    BoardCoordinate(5, 6),  // 5
    BoardCoordinate(4, 6),  // 6
    BoardCoordinate(3, 6),  // 7
    BoardCoordinate(2, 6),  // 8: Safe Star
    BoardCoordinate(1, 6),  // 9
    BoardCoordinate(0, 6),  // 10
    BoardCoordinate(0, 7),  // 11
    BoardCoordinate(0, 8),  // 12
    BoardCoordinate(1, 8),  // 13: Green Start (Safe)

    // Top-right arm (going down)
    BoardCoordinate(2, 8),  // 14
    BoardCoordinate(3, 8),  // 15
    BoardCoordinate(4, 8),  // 16
    BoardCoordinate(5, 8),  // 17

    // Right arm (going right)
    BoardCoordinate(6, 9),  // 18
    BoardCoordinate(6, 10), // 19
    BoardCoordinate(6, 11), // 20
    BoardCoordinate(6, 12), // 21: Safe Star
    BoardCoordinate(6, 13), // 22
    BoardCoordinate(6, 14), // 23
    BoardCoordinate(7, 14), // 24
    BoardCoordinate(8, 14), // 25
    BoardCoordinate(8, 13), // 26: Yellow Start (Safe)

    // Bottom-right arm (going left)
    BoardCoordinate(8, 12), // 27
    BoardCoordinate(8, 11), // 28
    BoardCoordinate(8, 10), // 29
    BoardCoordinate(8, 9),  // 30

    // Bottom arm (going down)
    BoardCoordinate(9, 8),  // 31
    BoardCoordinate(10, 8), // 32
    BoardCoordinate(11, 8), // 33
    BoardCoordinate(12, 8), // 34: Safe Star
    BoardCoordinate(13, 8), // 35
    BoardCoordinate(14, 8), // 36
    BoardCoordinate(14, 7), // 37
    BoardCoordinate(14, 6), // 38
    BoardCoordinate(13, 6), // 39: Blue Start (Safe)

    // Bottom-left arm (going up)
    BoardCoordinate(12, 6), // 40
    BoardCoordinate(11, 6), // 41
    BoardCoordinate(10, 6), // 42
    BoardCoordinate(9, 6),  // 43

    // Left arm (going left)
    BoardCoordinate(8, 5),  // 44
    BoardCoordinate(8, 4),  // 45
    BoardCoordinate(8, 3),  // 46
    BoardCoordinate(8, 2),  // 47: Safe Star
    BoardCoordinate(8, 1),  // 48
    BoardCoordinate(8, 0),  // 49
    BoardCoordinate(7, 0),  // 50
    BoardCoordinate(6, 0),  // 51
  ];

  /// Colored home stretches (5 cells each leading to center victory cell)
  static const List<BoardCoordinate> redHomeStretch = [
    BoardCoordinate(7, 1),
    BoardCoordinate(7, 2),
    BoardCoordinate(7, 3),
    BoardCoordinate(7, 4),
    BoardCoordinate(7, 5),
  ];

  static const List<BoardCoordinate> greenHomeStretch = [
    BoardCoordinate(1, 7),
    BoardCoordinate(2, 7),
    BoardCoordinate(3, 7),
    BoardCoordinate(4, 7),
    BoardCoordinate(5, 7),
  ];

  static const List<BoardCoordinate> yellowHomeStretch = [
    BoardCoordinate(7, 13),
    BoardCoordinate(7, 12),
    BoardCoordinate(7, 11),
    BoardCoordinate(7, 10),
    BoardCoordinate(7, 9),
  ];

  static const List<BoardCoordinate> blueHomeStretch = [
    BoardCoordinate(13, 7),
    BoardCoordinate(12, 7),
    BoardCoordinate(11, 7),
    BoardCoordinate(10, 7),
    BoardCoordinate(9, 7),
  ];

  /// Fixed Home Base Pawn Sockets (for row, col in 15x15 board)
  static const Map<LudoPlayerColor, List<BoardCoordinate>> homeBaseSockets = {
    LudoPlayerColor.red: [
      BoardCoordinate(2, 2),
      BoardCoordinate(2, 3),
      BoardCoordinate(3, 2),
      BoardCoordinate(3, 3),
    ],
    LudoPlayerColor.green: [
      BoardCoordinate(2, 11),
      BoardCoordinate(2, 12),
      BoardCoordinate(3, 11),
      BoardCoordinate(3, 12),
    ],
    LudoPlayerColor.blue: [
      BoardCoordinate(11, 2),
      BoardCoordinate(11, 3),
      BoardCoordinate(12, 2),
      BoardCoordinate(12, 3),
    ],
    LudoPlayerColor.yellow: [
      BoardCoordinate(11, 11),
      BoardCoordinate(11, 12),
      BoardCoordinate(12, 11),
      BoardCoordinate(12, 12),
    ],
  };

  /// 8 Safe Star Positions (on 52-cell track)
  static const List<int> safeTrackIndices = [0, 8, 13, 21, 26, 34, 39, 47];

  static bool isSafeTrackIndex(int index) => safeTrackIndices.contains(index);
}
