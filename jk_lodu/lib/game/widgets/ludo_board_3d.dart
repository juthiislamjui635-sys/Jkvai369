import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../models/game_models.dart';
import 'pawn_3d_widget.dart';

/// Premium 3D Interactive Ludo Board Widget
/// Features:
/// - Exact 15x15 Ludo geometry with classic track arms and center victory triangle
/// - Red top-left, Green top-right, Blue bottom-left, Yellow bottom-right
/// - Gold metallic outer border with 3D beveled relief and soft drop shadows
/// - Glossy player base panels with embossed inner relief and crown emblems
/// - Distinctive safe cells with golden 3D stars
/// - Dynamic 3D Pawn tokens with live animation and tap callbacks
class LudoBoard3DWidget extends StatelessWidget {
  final List<LudoTokenModel> tokens;
  final Function(LudoTokenModel token)? onTokenTap;
  final String? activeMovingTokenId;
  final double movingTokenElevation;
  final double movingTokenRotation;
  final BoardCoordinate? movingTokenCoordinate;

  const LudoBoard3DWidget({
    super.key,
    required this.tokens,
    this.onTokenTap,
    this.activeMovingTokenId,
    this.movingTokenElevation = 0.0,
    this.movingTokenRotation = 0.0,
    this.movingTokenCoordinate,
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final boardSize = math.min(constraints.maxWidth, constraints.maxHeight);
        final cellSize = boardSize / 15.0;

        return Center(
          child: Container(
            width: boardSize,
            height: boardSize,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(boardSize * 0.045),
              boxShadow: [
                // Deep ambient outer shadow
                BoxShadow(
                  color: Colors.black.withOpacity(0.55),
                  blurRadius: 28,
                  offset: const Offset(0, 12),
                  spreadRadius: 4,
                ),
                // Metallic gold glow
                BoxShadow(
                  color: AppColors.primaryGold.withOpacity(0.28),
                  blurRadius: 16,
                  spreadRadius: 2,
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(boardSize * 0.045),
              child: Stack(
                children: [
                  // 1. Custom Painted 3D Board Background & Grid
                  Positioned.fill(
                    child: CustomPaint(
                      painter: Board3DPainter(boardSize: boardSize),
                    ),
                  ),

                  // 2. Interactive Tokens
                  ...tokens.map((token) {
                    final isCurrentlyMoving = token.id == activeMovingTokenId;
                    final coord = isCurrentlyMoving && movingTokenCoordinate != null
                        ? movingTokenCoordinate!
                        : _getTokenCoordinate(token);

                    final left = coord.col * cellSize + (cellSize - 28.0) / 2;
                    final top = coord.row * cellSize + (cellSize - 34.0) / 2;

                    return Positioned(
                      left: left,
                      top: top,
                      width: 28.0,
                      height: 38.0,
                      child: Pawn3DWidget(
                        color: token.color,
                        size: 26.0,
                        isSelected: token.isSelected,
                        isMovable: token.isMovable,
                        elevation: isCurrentlyMoving ? movingTokenElevation : 0.0,
                        rotationAngle: isCurrentlyMoving ? movingTokenRotation : 0.0,
                        onTap: () => onTokenTap?.call(token),
                      ),
                    );
                  }),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  BoardCoordinate _getTokenCoordinate(LudoTokenModel token) {
    if (token.isAtHome) {
      final sockets = LudoBoardPath.homeBaseSockets[token.color]!;
      return sockets[token.index % sockets.length];
    }

    if (token.isInHomeStretch) {
      switch (token.color) {
        case LudoPlayerColor.red:
          return LudoBoardPath.redHomeStretch[token.homeStretchPosition.clamp(0, 4)];
        case LudoPlayerColor.green:
          return LudoBoardPath.greenHomeStretch[token.homeStretchPosition.clamp(0, 4)];
        case LudoPlayerColor.yellow:
          return LudoBoardPath.yellowHomeStretch[token.homeStretchPosition.clamp(0, 4)];
        case LudoPlayerColor.blue:
          return LudoBoardPath.blueHomeStretch[token.homeStretchPosition.clamp(0, 4)];
      }
    }

    if (token.isFinished) {
      return const BoardCoordinate(7, 7); // Center victory cell
    }

    // On main track
    final trackIndex = token.trackPosition % LudoBoardPath.mainTrack.length;
    return LudoBoardPath.mainTrack[trackIndex];
  }
}

/// CustomPainter rendering the complete 15x15 3D Ludo board
class Board3DPainter extends CustomPainter {
  final double boardSize;

  Board3DPainter({required this.boardSize});

  @override
  void paint(Canvas canvas, Size size) {
    final s = size.width;
    final cell = s / 15.0;

    // 1. BOARD FOUNDATION (Light glossy ivory table)
    final boardRect = Rect.fromLTWH(0, 0, s, s);
    final bgGradient = RadialGradient(
      center: Alignment.center,
      radius: 0.9,
      colors: const [
        Color(0xFFFFFFFF),
        Color(0xFFF8FAFC),
        Color(0xFFEDE9FE),
      ],
      stops: const [0.0, 0.7, 1.0],
    );
    canvas.drawRect(boardRect, Paint()..shader = bgGradient.createShader(boardRect));

    // 2. DRAW 4 PLAYER HOME BASES (6x6 cells each)
    _drawHomeBase(canvas, 0, 0, cell, LudoPlayerColor.red); // Top-left: RED
    _drawHomeBase(canvas, 9 * cell, 0, cell, LudoPlayerColor.green); // Top-right: GREEN
    _drawHomeBase(canvas, 0, 9 * cell, cell, LudoPlayerColor.blue); // Bottom-left: BLUE
    _drawHomeBase(canvas, 9 * cell, 9 * cell, cell, LudoPlayerColor.yellow); // Bottom-right: YELLOW

    // 3. DRAW 15x15 TRACK CELLS (White & Player colored paths)
    _drawTrackGrid(canvas, cell);

    // 4. DRAW CENTER HOME VICTORY TRIANGLES
    _drawCenterVictoryArea(canvas, cell);

    // 5. DRAW SAFE STARS ON SAFE CELLS
    _drawSafeStars(canvas, cell);

    // 6. METALLIC GOLD OUTER BEZEL (3D relief border)
    _drawMetallicGoldBorder(canvas, s);
  }

  void _drawHomeBase(
    Canvas canvas,
    double x,
    double y,
    double cell,
    LudoPlayerColor color,
  ) {
    final baseSize = cell * 6.0;
    final rect = Rect.fromLTWH(x, y, baseSize, baseSize);

    Color primary;
    Color light;
    Color dark;

    switch (color) {
      case LudoPlayerColor.red:
        primary = const Color(0xFFE11D48);
        light = const Color(0xFFFB7185);
        dark = const Color(0xFF9F1239);
        break;
      case LudoPlayerColor.green:
        primary = const Color(0xFF10B981);
        light = const Color(0xFF34D399);
        dark = const Color(0xFF047857);
        break;
      case LudoPlayerColor.yellow:
        primary = const Color(0xFFF59E0B);
        light = const Color(0xFFFDE68A);
        dark = const Color(0xFFB45309);
        break;
      case LudoPlayerColor.blue:
        primary = const Color(0xFF2563EB);
        light = const Color(0xFF60A5FA);
        dark = const Color(0xFF1D4ED8);
        break;
    }

    // Outer base fill with rich 3D gradient
    final basePaint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [light, primary, dark],
        stops: const [0.0, 0.5, 1.0],
      ).createShader(rect);
    canvas.drawRect(rect, basePaint);

    // Embossed inner white/cream card with rounded corners
    final innerPad = cell * 0.85;
    final innerRect = RRect.fromRectAndRadius(
      Rect.fromLTWH(
        x + innerPad,
        y + innerPad,
        baseSize - innerPad * 2,
        baseSize - innerPad * 2,
      ),
      Radius.circular(cell * 0.5),
    );

    // Drop shadow behind white panel
    final panelShadow = Paint()
      ..color = Colors.black.withOpacity(0.3)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 4.0);
    canvas.drawRRect(innerRect.shift(const Offset(0, 2)), panelShadow);

    // Inner panel body
    final innerPaint = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [Color(0xFFFFFFFF), Color(0xFFF1F5F9)],
      ).createShader(innerRect.outerRect);
    canvas.drawRRect(innerRect, innerPaint);

    // Inner gold border rim
    final innerRimPaint = Paint()
      ..color = AppColors.primaryGold.withOpacity(0.6)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;
    canvas.drawRRect(innerRect, innerRimPaint);

    // 4 Sunk Pawn Sockets (with subtle circular bevel)
    final socketRadius = cell * 0.62;
    final centers = [
      Offset(x + cell * 2.5, y + cell * 2.5),
      Offset(x + cell * 3.5, y + cell * 2.5),
      Offset(x + cell * 2.5, y + cell * 3.5),
      Offset(x + cell * 3.5, y + cell * 3.5),
    ];

    for (final c in centers) {
      // Sunk socket shadow
      final socketShadowPaint = Paint()
        ..color = const Color(0xFFCBD5E1)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 2.0);
      canvas.drawCircle(c, socketRadius, socketShadowPaint);

      // Socket interior with matching player accent tint
      final socketInterior = Paint()
        ..shader = RadialGradient(
          colors: [
            primary.withOpacity(0.2),
            primary.withOpacity(0.45),
          ],
        ).createShader(Rect.fromCircle(center: c, radius: socketRadius));
      canvas.drawCircle(c, socketRadius - 1.0, socketInterior);

      // Gold socket rim
      final socketRim = Paint()
        ..color = AppColors.primaryGold.withOpacity(0.5)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.0;
      canvas.drawCircle(c, socketRadius - 1.0, socketRim);
    }

    // Subtle center watermark crown emblem
    final emblemCenter = Offset(x + baseSize * 0.5, y + baseSize * 0.5);
    _drawCrownEmblem(canvas, emblemCenter, cell * 0.8, primary.withOpacity(0.25));
  }

  void _drawTrackGrid(Canvas canvas, double cell) {
    final borderPaint = Paint()
      ..color = const Color(0xFFE2E8F0)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 0.8;

    // Track cells: columns 6,7,8 (rows 0-5 and 9-14), and rows 6,7,8 (cols 0-5 and 9-14)
    for (int r = 0; r < 15; r++) {
      for (int c = 0; c < 15; c++) {
        // Skip base quadrants (0-5, 0-5; 0-5, 9-14; 9-14, 0-5; 9-14, 9-14) and center (6-8, 6-8)
        final isTopLeftBase = r < 6 && c < 6;
        final isTopRightBase = r < 6 && c >= 9;
        final isBottomLeftBase = r >= 9 && c < 6;
        final isBottomRightBase = r >= 9 && c >= 9;
        final isCenter = r >= 6 && r <= 8 && c >= 6 && c <= 8;

        if (isTopLeftBase || isTopRightBase || isBottomLeftBase || isBottomRightBase || isCenter) {
          continue;
        }

        final rect = Rect.fromLTWH(c * cell, r * cell, cell, cell);

        // Determine if this cell is a colored home stretch or start cell
        Color? fill;

        // RED PATHS: Start at (6,1) and home stretch row 7, cols 1-5
        if (r == 6 && c == 1) {
          fill = const Color(0xFFE11D48);
        } else if (r == 7 && c >= 1 && c <= 5) {
          fill = const Color(0xFFE11D48);
        }
        // GREEN PATHS: Start at (1,8) and home stretch col 7, rows 1-5
        else if (r == 1 && c == 8) {
          fill = const Color(0xFF10B981);
        } else if (c == 7 && r >= 1 && r <= 5) {
          fill = const Color(0xFF10B981);
        }
        // YELLOW PATHS: Start at (8,13) and home stretch row 7, cols 9-13
        else if (r == 8 && c == 13) {
          fill = const Color(0xFFF59E0B);
        } else if (r == 7 && c >= 9 && c <= 13) {
          fill = const Color(0xFFF59E0B);
        }
        // BLUE PATHS: Start at (13,6) and home stretch col 7, rows 9-13
        else if (r == 13 && c == 6) {
          fill = const Color(0xFF2563EB);
        } else if (c == 7 && r >= 9 && r <= 13) {
          fill = const Color(0xFF2563EB);
        }

        if (fill != null) {
          final cellPaint = Paint()
            ..shader = LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [fill.withOpacity(0.85), fill],
            ).createShader(rect);
          canvas.drawRect(rect, cellPaint);
        } else {
          // Standard white track cell with glossy bevel
          final whiteCellPaint = Paint()..color = const Color(0xFFFFFFFF);
          canvas.drawRect(rect, whiteCellPaint);
        }

        // Draw clean cell outline
        canvas.drawRect(rect, borderPaint);
      }
    }
  }

  void _drawCenterVictoryArea(Canvas canvas, double cell) {
    final cx = cell * 7.5;
    final cy = cell * 7.5;
    final startX = cell * 6.0;
    final endX = cell * 9.0;
    final startY = cell * 6.0;
    final endY = cell * 9.0;

    // 4 Triangles meeting at center
    // Left Triangle (RED)
    final redTriangle = Path()
      ..moveTo(startX, startY)
      ..lineTo(startX, endY)
      ..lineTo(cx, cy)
      ..close();
    canvas.drawPath(
      redTriangle,
      Paint()
        ..shader = const LinearGradient(
          colors: [Color(0xFFE11D48), Color(0xFF9F1239)],
        ).createShader(Rect.fromLTRB(startX, startY, cx, endY)),
    );

    // Top Triangle (GREEN)
    final greenTriangle = Path()
      ..moveTo(startX, startY)
      ..lineTo(endX, startY)
      ..lineTo(cx, cy)
      ..close();
    canvas.drawPath(
      greenTriangle,
      Paint()
        ..shader = const LinearGradient(
          colors: [Color(0xFF10B981), Color(0xFF047857)],
        ).createShader(Rect.fromLTRB(startX, startY, endX, cy)),
    );

    // Right Triangle (YELLOW)
    final yellowTriangle = Path()
      ..moveTo(endX, startY)
      ..lineTo(endX, endY)
      ..lineTo(cx, cy)
      ..close();
    canvas.drawPath(
      yellowTriangle,
      Paint()
        ..shader = const LinearGradient(
          colors: [Color(0xFFF59E0B), Color(0xFFB45309)],
        ).createShader(Rect.fromLTRB(cx, startY, endX, endY)),
    );

    // Bottom Triangle (BLUE)
    final blueTriangle = Path()
      ..moveTo(startX, endY)
      ..lineTo(endX, endY)
      ..lineTo(cx, cy)
      ..close();
    canvas.drawPath(
      blueTriangle,
      Paint()
        ..shader = const LinearGradient(
          colors: [Color(0xFF2563EB), Color(0xFF1D4ED8)],
        ).createShader(Rect.fromLTRB(startX, cy, endX, endY)),
    );

    // Golden victory crest in the center
    final centerCircleRadius = cell * 0.85;
    final centerCircleRect = Rect.fromCircle(center: Offset(cx, cy), radius: centerCircleRadius);
    final goldCrestPaint = Paint()
      ..shader = const RadialGradient(
        colors: [Color(0xFFFFE082), Color(0xFFFFB800), Color(0xFFC78A00)],
      ).createShader(centerCircleRect);
    canvas.drawCircle(Offset(cx, cy), centerCircleRadius, goldCrestPaint);

    final crestBorder = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0;
    canvas.drawCircle(Offset(cx, cy), centerCircleRadius, crestBorder);

    // Center Gold Star
    _drawStar(canvas, Offset(cx, cy), cell * 0.45, Colors.white);
  }

  void _drawSafeStars(Canvas canvas, double cell) {
    // 8 Safe Positions
    final safePositions = [
      const Offset(1, 6),  // Red Start
      const Offset(6, 2),  // Safe Star
      const Offset(8, 1),  // Green Start
      const Offset(12, 6), // Safe Star
      const Offset(13, 8), // Yellow Start
      const Offset(8, 12), // Safe Star
      const Offset(6, 13), // Blue Start
      const Offset(2, 8),  // Safe Star
    ];

    for (final p in safePositions) {
      final center = Offset((p.dx + 0.5) * cell, (p.dy + 0.5) * cell);
      _drawStar(canvas, center, cell * 0.35, AppColors.safeStar);
    }
  }

  void _drawStar(Canvas canvas, Offset center, double radius, Color color) {
    final path = Path();
    final innerRadius = radius * 0.45;
    const points = 5;

    for (int i = 0; i < points * 2; i++) {
      final isEven = i % 2 == 0;
      final r = isEven ? radius : innerRadius;
      final angle = (i * math.pi / points) - (math.pi / 2);
      final x = center.dx + r * math.cos(angle);
      final y = center.dy + r * math.sin(angle);

      if (i == 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    }
    path.close();

    // 3D Star shadow
    final starShadow = Paint()
      ..color = Colors.black.withOpacity(0.3)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 1.5);
    canvas.drawPath(path.shift(const Offset(0, 1.2)), starShadow);

    // Star face
    final starPaint = Paint()..color = color;
    canvas.drawPath(path, starPaint);
  }

  void _drawCrownEmblem(Canvas canvas, Offset center, double size, Color color) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    final path = Path();
    final half = size * 0.5;
    path.moveTo(center.dx - half, center.dy + half * 0.4);
    path.lineTo(center.dx - half * 0.8, center.dy - half * 0.3);
    path.lineTo(center.dx - half * 0.3, center.dy + half * 0.1);
    path.lineTo(center.dx, center.dy - half * 0.5);
    path.lineTo(center.dx + half * 0.3, center.dy + half * 0.1);
    path.lineTo(center.dx + half * 0.8, center.dy - half * 0.3);
    path.lineTo(center.dx + half, center.dy + half * 0.4);
    path.close();

    canvas.drawPath(path, paint);
  }

  void _drawMetallicGoldBorder(Canvas canvas, double size) {
    final borderWidth = size * 0.024;
    final rRect = RRect.fromRectAndRadius(
      Rect.fromLTWH(borderWidth * 0.5, borderWidth * 0.5, size - borderWidth, size - borderWidth),
      Radius.circular(size * 0.045),
    );

    final borderGradient = LinearGradient(
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
      colors: const [
        Color(0xFFFFECB3),
        Color(0xFFFFD54F),
        Color(0xFFFFB800),
        Color(0xFFC78A00),
        Color(0xFFFFD54F),
        Color(0xFFFFECB3),
      ],
      stops: const [0.0, 0.2, 0.45, 0.7, 0.88, 1.0],
    );

    final borderPaint = Paint()
      ..shader = borderGradient.createShader(Rect.fromLTWH(0, 0, size, size))
      ..style = PaintingStyle.stroke
      ..strokeWidth = borderWidth;

    canvas.drawRRect(rRect, borderPaint);
  }

  @override
  bool shouldRepaint(covariant Board3DPainter oldDelegate) {
    return oldDelegate.boardSize != boardSize;
  }
}
