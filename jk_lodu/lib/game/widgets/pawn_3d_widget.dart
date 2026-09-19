import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../models/game_models.dart';

/// Premium 3D Physical Ludo Pawn (Guti) Widget
/// Custom-painted with true cylindrical/spherical 3D geometry,
/// multi-stop gradients, specular hot-spot highlights, rim lighting,
/// and interactive contact shadow physics.
class Pawn3DWidget extends StatefulWidget {
  final LudoPlayerColor color;
  final double size;
  final bool isSelected;
  final bool isMovable;
  final VoidCallback? onTap;
  final double elevation; // 0.0 at rest, up to 1.0 when hopping
  final double rotationAngle; // slight tilt during step

  const Pawn3DWidget({
    super.key,
    required this.color,
    this.size = 28.0,
    this.isSelected = false,
    this.isMovable = false,
    this.onTap,
    this.elevation = 0.0,
    this.rotationAngle = 0.0,
  });

  @override
  State<Pawn3DWidget> createState() => _Pawn3DWidgetState();
}

class _Pawn3DWidgetState extends State<Pawn3DWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1100),
    );

    _pulseAnimation = Tween<double>(begin: 0.96, end: 1.08).animate(
      CurvedAnimation(
        parent: _pulseController,
        curve: Curves.easeInOutSine,
      ),
    );

    if (widget.isMovable || widget.isSelected) {
      _pulseController.repeat(reverse: true);
    }
  }

  @override
  void didUpdateWidget(Pawn3DWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if ((widget.isMovable || widget.isSelected) &&
        !_pulseController.isAnimating) {
      _pulseController.repeat(reverse: true);
    } else if (!widget.isMovable && !widget.isSelected && _pulseController.isAnimating) {
      _pulseController.stop();
      _pulseController.reset();
    }
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.isMovable || widget.isSelected ? widget.onTap : null,
      behavior: HitTestBehavior.opaque,
      child: AnimatedBuilder(
        animation: _pulseAnimation,
        builder: (context, child) {
          final scale = (widget.isMovable || widget.isSelected)
              ? _pulseAnimation.value
              : 1.0;
          final currentElevation = widget.isSelected ? 0.35 : widget.elevation;

          return Transform.translate(
            offset: Offset(0, -currentElevation * 14.0),
            child: Transform.rotate(
              angle: widget.rotationAngle,
              child: Transform.scale(
                scale: scale,
                child: SizedBox(
                  width: widget.size,
                  height: widget.size * 1.35,
                  child: CustomPaint(
                    painter: Pawn3DPainter(
                      color: widget.color,
                      isSelected: widget.isSelected,
                      isMovable: widget.isMovable,
                      elevation: currentElevation,
                    ),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class Pawn3DPainter extends CustomPainter {
  final LudoPlayerColor color;
  final bool isSelected;
  final bool isMovable;
  final double elevation;

  Pawn3DPainter({
    required this.color,
    required this.isSelected,
    required this.isMovable,
    required this.elevation,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // Color tuning for true glossy depth
    Color primaryColor;
    Color highlightColor;
    Color deepShadowColor;
    Color specularColor;

    switch (color) {
      case LudoPlayerColor.red:
        primaryColor = const Color(0xFFE11D48);
        highlightColor = const Color(0xFFFF6B8B);
        deepShadowColor = const Color(0xFF880825);
        specularColor = const Color(0xFFFFD4DE);
        break;
      case LudoPlayerColor.green:
        primaryColor = const Color(0xFF10B981);
        highlightColor = const Color(0xFF5EEAD4);
        deepShadowColor = const Color(0xFF04543E);
        specularColor = const Color(0xFFD1FAE5);
        break;
      case LudoPlayerColor.yellow:
        primaryColor = const Color(0xFFF59E0B);
        highlightColor = const Color(0xFFFDE68A);
        deepShadowColor = const Color(0xFF92400E);
        specularColor = const Color(0xFFFFFBEB);
        break;
      case LudoPlayerColor.blue:
        primaryColor = const Color(0xFF2563EB);
        highlightColor = const Color(0xFF93C5FD);
        deepShadowColor = const Color(0xFF1E3A8A);
        specularColor = const Color(0xFFDBEAFE);
        break;
    }

    // 1. CONTACT SHADOW UNDERNEATH
    // Shadow scales down and blurs out as elevation rises
    final shadowScale = 1.0 - (elevation * 0.35);
    final shadowAlpha = (180 * (1.0 - elevation * 0.4)).clamp(40, 180).toInt();
    final shadowPaint = Paint()
      ..color = Colors.black.withAlpha(shadowAlpha)
      ..maskFilter = MaskFilter.blur(BlurStyle.normal, 2.5 + (elevation * 4.0));

    final shadowRect = Rect.fromCenter(
      center: Offset(w * 0.5, h * 0.94 + (elevation * 12.0)),
      width: w * 0.78 * shadowScale,
      height: h * 0.16 * shadowScale,
    );
    canvas.drawOval(shadowRect, shadowPaint);

    // 2. GLOW RING / AURA (When selected or movable)
    if (isSelected || isMovable) {
      final glowPaint = Paint()
        ..color = isSelected
            ? AppColors.primaryGold.withOpacity(0.85)
            : highlightColor.withOpacity(0.7)
        ..style = PaintingStyle.stroke
        ..strokeWidth = isSelected ? 3.0 : 2.0
        ..maskFilter = const MaskFilter.blur(BlurStyle.solid, 4.0);

      final auraRect = Rect.fromCenter(
        center: Offset(w * 0.5, h * 0.55),
        width: w * 1.05,
        height: h * 1.0,
      );
      canvas.drawOval(auraRect, glowPaint);
    }

    // 3. PAWN BASE PEDESTAL (Wide circular bottom with beveled step)
    final baseCenter = Offset(w * 0.5, h * 0.84);
    final baseWidth = w * 0.88;
    final baseHeight = h * 0.22;

    // Base rim gradient (Dark shadow on bottom-right, highlight on top-left)
    final baseGradient = LinearGradient(
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
      colors: [highlightColor, primaryColor, deepShadowColor],
      stops: const [0.0, 0.45, 1.0],
    );

    final basePaint = Paint()
      ..shader = baseGradient.createShader(
        Rect.fromCenter(center: baseCenter, width: baseWidth, height: baseHeight),
      );

    canvas.drawOval(
      Rect.fromCenter(center: baseCenter, width: baseWidth, height: baseHeight),
      basePaint,
    );

    // Upper base ring bevel
    final upperBaseRect = Rect.fromCenter(
      center: Offset(w * 0.5, h * 0.80),
      width: baseWidth * 0.78,
      height: baseHeight * 0.65,
    );
    final upperBasePaint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [specularColor, primaryColor],
        stops: const [0.0, 0.7],
      ).createShader(upperBaseRect);
    canvas.drawOval(upperBaseRect, upperBasePaint);

    // 4. PAWN WAIST / BODY (Curved flared trunk narrowing towards top)
    final bodyPath = Path();
    final bodyTopY = h * 0.46;
    final bodyBottomY = h * 0.80;
    final bodyTopHalfWidth = w * 0.22;
    final bodyBottomHalfWidth = w * 0.35;

    bodyPath.moveTo(w * 0.5 - bodyBottomHalfWidth, bodyBottomY);
    // Left concave curve
    bodyPath.quadraticBezierTo(
      w * 0.5 - bodyTopHalfWidth * 0.75,
      h * 0.63,
      w * 0.5 - bodyTopHalfWidth,
      bodyTopY,
    );
    // Top collar arc
    bodyPath.lineTo(w * 0.5 + bodyTopHalfWidth, bodyTopY);
    // Right concave curve
    bodyPath.quadraticBezierTo(
      w * 0.5 + bodyTopHalfWidth * 0.75,
      h * 0.63,
      w * 0.5 + bodyBottomHalfWidth,
      bodyBottomY,
    );
    bodyPath.close();

    final bodyGradient = LinearGradient(
      begin: const Alignment(-0.8, -0.2),
      end: const Alignment(0.9, 0.4),
      colors: [
        highlightColor,
        specularColor.withOpacity(0.95),
        primaryColor,
        deepShadowColor,
        deepShadowColor.withOpacity(0.85),
      ],
      stops: const [0.0, 0.25, 0.6, 0.88, 1.0],
    );

    final bodyPaint = Paint()
      ..shader = bodyGradient.createShader(
        Rect.fromLTRB(w * 0.15, bodyTopY, w * 0.85, bodyBottomY),
      );
    canvas.drawPath(bodyPath, bodyPaint);

    // 5. PAWN COLLAR / NECK RING (Beveled golden/gloss ring)
    final collarCenter = Offset(w * 0.5, bodyTopY);
    final collarWidth = w * 0.52;
    final collarHeight = h * 0.09;
    final collarPaint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [
          Colors.white,
          highlightColor,
          primaryColor,
          deepShadowColor,
        ],
        stops: const [0.0, 0.25, 0.65, 1.0],
      ).createShader(
        Rect.fromCenter(
          center: collarCenter,
          width: collarWidth,
          height: collarHeight,
        ),
      );

    canvas.drawOval(
      Rect.fromCenter(
        center: collarCenter,
        width: collarWidth,
        height: collarHeight,
      ),
      collarPaint,
    );

    // 6. SPHERICAL HEAD (True 3D sphere with off-center glossy specular spot)
    final headRadius = w * 0.29;
    final headCenter = Offset(w * 0.5, h * 0.28);

    // Base spherical radial gradient
    final headGradient = RadialGradient(
      center: const Alignment(-0.35, -0.42),
      radius: 0.85,
      colors: [
        Colors.white,
        specularColor,
        highlightColor,
        primaryColor,
        deepShadowColor,
      ],
      stops: const [0.0, 0.22, 0.55, 0.82, 1.0],
    );

    final headPaint = Paint()
      ..shader = headGradient.createShader(
        Rect.fromCircle(center: headCenter, radius: headRadius),
      );

    canvas.drawCircle(headCenter, headRadius, headPaint);

    // 7. SPECULAR HOT SPOT (Bright glossy dome reflection)
    final spotCenter = Offset(
      headCenter.dx - headRadius * 0.30,
      headCenter.dy - headRadius * 0.32,
    );
    final spotPaint = Paint()
      ..color = Colors.white.withOpacity(0.85)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 1.5);
    canvas.drawOval(
      Rect.fromCenter(center: spotCenter, width: headRadius * 0.45, height: headRadius * 0.32),
      spotPaint,
    );

    // Tiny micro specular dot
    final microSpotPaint = Paint()..color = Colors.white;
    canvas.drawCircle(
      Offset(spotCenter.dx - 1.0, spotCenter.dy - 1.0),
      headRadius * 0.12,
      microSpotPaint,
    );

    // 8. RIM LIGHT (Subtle cyan or white rim highlight on left flank)
    final rimPaint = Paint()
      ..color = Colors.white.withOpacity(0.35)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0;
    canvas.drawArc(
      Rect.fromCircle(center: headCenter, radius: headRadius - 0.5),
      math.pi * 0.8,
      math.pi * 0.5,
      false,
      rimPaint,
    );
  }

  @override
  bool shouldRepaint(covariant Pawn3DPainter oldDelegate) {
    return oldDelegate.color != color ||
        oldDelegate.isSelected != isSelected ||
        oldDelegate.isMovable != isMovable ||
        oldDelegate.elevation != elevation;
  }
}
