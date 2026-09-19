import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';

/// Premium 3D Physical Dice Widget
/// Interactive Flutter component featuring:
/// - Realistic rounded white cube with specular highlights and bevel depth
/// - Inset dark pips with specular dot reflection
/// - 3D physics roll with multi-axis rotation, parabolic bounce, and contact shadow
/// - Golden turn pulse aura
class Dice3DWidget extends StatefulWidget {
  final int value;
  final bool isRolling;
  final bool isEnabled;
  final VoidCallback? onRoll;
  final double size;

  const Dice3DWidget({
    super.key,
    required this.value,
    this.isRolling = false,
    this.isEnabled = true,
    this.onRoll,
    this.size = 64.0,
  });

  @override
  State<Dice3DWidget> createState() => _Dice3DWidgetState();
}

class _Dice3DWidgetState extends State<Dice3DWidget>
    with TickerProviderStateMixin {
  late AnimationController _rollController;
  late AnimationController _turnGlowController;
  late Animation<double> _bounceAnimation;
  late Animation<double> _rotationXAnimation;
  late Animation<double> _rotationYAnimation;

  @override
  void initState() {
    super.initState();

    _rollController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 650),
    );

    _bounceAnimation = TweenSequence<double>([
      TweenSequenceItem(
        tween: Tween<double>(begin: 0.0, end: -28.0)
            .chain(CurveTween(curve: Curves.easeOutCubic)),
        weight: 35,
      ),
      TweenSequenceItem(
        tween: Tween<double>(begin: -28.0, end: 0.0)
            .chain(CurveTween(curve: Curves.bounceOut)),
        weight: 65,
      ),
    ]).animate(_rollController);

    _rotationXAnimation = Tween<double>(begin: 0.0, end: math.pi * 2.5).animate(
      CurvedAnimation(parent: _rollController, curve: Curves.easeInOut),
    );

    _rotationYAnimation = Tween<double>(begin: 0.0, end: math.pi * 3.0).animate(
      CurvedAnimation(parent: _rollController, curve: Curves.easeInOut),
    );

    _turnGlowController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    )..repeat(reverse: true);

    if (widget.isRolling) {
      _rollController.forward(from: 0.0);
    }
  }

  @override
  void didUpdateWidget(Dice3DWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.isRolling && !oldWidget.isRolling) {
      _rollController.forward(from: 0.0);
    }
  }

  @override
  void dispose() {
    _rollController.dispose();
    _turnGlowController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.isEnabled && !widget.isRolling ? widget.onRoll : null,
      behavior: HitTestBehavior.opaque,
      child: AnimatedBuilder(
        animation: Listenable.merge([_rollController, _turnGlowController]),
        builder: (context, child) {
          final bounceY = widget.isRolling ? _bounceAnimation.value : 0.0;
          final rotX = widget.isRolling ? _rotationXAnimation.value : 0.0;
          final rotY = widget.isRolling ? _rotationYAnimation.value : 0.0;
          final glowAlpha = widget.isEnabled ? _turnGlowController.value : 0.0;

          return Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Dice Body with 3D transform
              Transform.translate(
                offset: Offset(0, bounceY),
                child: Transform(
                  alignment: Alignment.center,
                  transform: Matrix4.identity()
                    ..setEntry(3, 2, 0.002) // Perspective projection
                    ..rotateX(rotX)
                    ..rotateY(rotY),
                  child: Container(
                    width: widget.size,
                    height: widget.size,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(widget.size * 0.22),
                      boxShadow: [
                        // Golden turn aura
                        if (widget.isEnabled)
                          BoxShadow(
                            color: AppColors.primaryGold.withOpacity(0.35 + glowAlpha * 0.4),
                            blurRadius: 18 + glowAlpha * 8,
                            spreadRadius: 2 + glowAlpha * 2,
                          ),
                        // 3D Bevel cast shadow
                        BoxShadow(
                          color: const Color(0xFF0F172A).withOpacity(0.4),
                          blurRadius: 10,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: CustomPaint(
                      painter: DiceFacePainter(
                        value: widget.value,
                        isRolling: widget.isRolling,
                        size: widget.size,
                      ),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 4),

              // Dynamic Floor Contact Shadow
              SizedBox(
                width: widget.size * 0.9,
                height: 8,
                child: CustomPaint(
                  painter: DiceFloorShadowPainter(
                    elevation: bounceY.abs(),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

/// Custom painter for the 3D glossy dice face with inset pips
class DiceFacePainter extends CustomPainter {
  final int value;
  final bool isRolling;
  final double size;

  DiceFacePainter({
    required this.value,
    required this.isRolling,
    required this.size,
  });

  @override
  void paint(Canvas canvas, Size canvasSize) {
    final s = canvasSize.width;
    final r = s * 0.22;
    final rRect = RRect.fromRectAndRadius(
      Rect.fromLTWH(0, 0, s, s),
      Radius.circular(r),
    );

    // 1. DICE 3D BODY GRADIENT (Bright white with glossy chamfer)
    final diceGradient = LinearGradient(
      begin: const Alignment(-0.6, -0.7),
      end: const Alignment(0.7, 0.8),
      colors: const [
        Color(0xFFFFFFFF),
        Color(0xFFF8FAFC),
        Color(0xFFE2E8F0),
        Color(0xFFCBD5E1),
      ],
      stops: const [0.0, 0.45, 0.85, 1.0],
    );

    final basePaint = Paint()
      ..shader = diceGradient.createShader(Rect.fromLTWH(0, 0, s, s));
    canvas.drawRRect(rRect, basePaint);

    // 2. INNER SPECULAR HIGHLIGHT BORDER
    final innerHighlight = Paint()
      ..color = Colors.white.withOpacity(0.9)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.6;
    final innerRRect = RRect.fromRectAndRadius(
      Rect.fromLTWH(1.5, 1.5, s - 3, s - 3),
      Radius.circular(r - 1.5),
    );
    canvas.drawRRect(innerRRect, innerHighlight);

    // 3. GLOSSY DOME SPECULAR SWEEP (Top-left diagonal light reflection)
    final sweepPath = Path();
    sweepPath.moveTo(r, 0);
    sweepPath.lineTo(s * 0.75, 0);
    sweepPath.lineTo(0, s * 0.75);
    sweepPath.lineTo(0, r);
    sweepPath.close();

    final sweepPaint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [
          Colors.white.withOpacity(0.55),
          Colors.white.withOpacity(0.0),
        ],
      ).createShader(Rect.fromLTWH(0, 0, s, s));
    canvas.save();
    canvas.clipRRect(rRect);
    canvas.drawPath(sweepPath, sweepPaint);
    canvas.restore();

    // 4. DRAW INSET BLACK PIPS
    final pipRadius = s * 0.085;
    final pips = _getPipCoordinates(value.clamp(1, 6), s);

    for (final center in pips) {
      // Inset dark shadow (sunken pip look)
      final insetShadowPaint = Paint()
        ..color = const Color(0xFF0F172A)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 0.8);
      canvas.drawCircle(Offset(center.dx, center.dy + 0.8), pipRadius + 0.4, insetShadowPaint);

      // Main pip gradient (Rich obsidian black with slight gloss)
      final pipGradient = RadialGradient(
        center: const Alignment(-0.3, -0.3),
        radius: 0.8,
        colors: const [
          Color(0xFF334155),
          Color(0xFF0F172A),
          Color(0xFF020617),
        ],
      );
      final pipPaint = Paint()
        ..shader = pipGradient.createShader(
          Rect.fromCircle(center: center, radius: pipRadius),
        );
      canvas.drawCircle(center, pipRadius, pipPaint);

      // Tiny white micro specular reflex inside pip
      final pipReflex = Paint()..color = Colors.white.withOpacity(0.4);
      canvas.drawCircle(
        Offset(center.dx - pipRadius * 0.35, center.dy - pipRadius * 0.35),
        pipRadius * 0.28,
        pipReflex,
      );
    }
  }

  List<Offset> _getPipCoordinates(int number, double s) {
    final c = s * 0.5;
    final l = s * 0.28;
    final r = s * 0.72;
    final t = s * 0.28;
    final b = s * 0.72;

    switch (number) {
      case 1:
        return [Offset(c, c)];
      case 2:
        return [Offset(l, t), Offset(r, b)];
      case 3:
        return [Offset(l, t), Offset(c, c), Offset(r, b)];
      case 4:
        return [Offset(l, t), Offset(r, t), Offset(l, b), Offset(r, b)];
      case 5:
        return [Offset(l, t), Offset(r, t), Offset(c, c), Offset(l, b), Offset(r, b)];
      case 6:
        return [
          Offset(l, t),
          Offset(r, t),
          Offset(l, c),
          Offset(r, c),
          Offset(l, b),
          Offset(r, b),
        ];
      default:
        return [Offset(c, c)];
    }
  }

  @override
  bool shouldRepaint(covariant DiceFacePainter oldDelegate) {
    return oldDelegate.value != value || oldDelegate.isRolling != isRolling;
  }
}

class DiceFloorShadowPainter extends CustomPainter {
  final double elevation;

  DiceFloorShadowPainter({required this.elevation});

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;
    final scale = (1.0 - (elevation / 40.0)).clamp(0.3, 1.0);
    final alpha = (120 * scale).toInt();

    final paint = Paint()
      ..color = Colors.black.withAlpha(alpha)
      ..maskFilter = MaskFilter.blur(BlurStyle.normal, 3.0 + (elevation * 0.15));

    canvas.drawOval(
      Rect.fromCenter(
        center: Offset(w * 0.5, h * 0.5),
        width: w * 0.85 * scale,
        height: h * 0.85 * scale,
      ),
      paint,
    );
  }

  @override
  bool shouldRepaint(covariant DiceFloorShadowPainter oldDelegate) {
    return oldDelegate.elevation != elevation;
  }
}
