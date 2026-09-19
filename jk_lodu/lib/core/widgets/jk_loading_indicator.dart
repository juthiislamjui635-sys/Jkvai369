import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

class JkLoadingIndicator extends StatefulWidget {
  final double size;
  final String? message;
  final Color? color;

  const JkLoadingIndicator({
    super.key,
    this.size = 40.0,
    this.message,
    this.color,
  });

  @override
  State<JkLoadingIndicator> createState() => _JkLoadingIndicatorState();
}

class _JkLoadingIndicatorState extends State<JkLoadingIndicator>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final indicatorColor = widget.color ?? AppColors.primaryGold;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          RotationTransition(
            turns: _controller,
            child: Container(
              width: widget.size,
              height: widget.size,
              decoration: BoxDecoration(
                color: indicatorColor.withOpacity(0.12),
                borderRadius: BorderRadius.circular(widget.size * 0.28),
                border: Border.all(color: indicatorColor, width: 2),
              ),
              child: Center(
                child: Icon(
                  Icons.casino_rounded,
                  size: widget.size * 0.55,
                  color: indicatorColor,
                ),
              ),
            ),
          ),
          if (widget.message != null) ...[
            const SizedBox(height: 12),
            Text(
              widget.message!,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: isDark ? AppColors.textDarkSecondary : AppColors.textLightSecondary,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
