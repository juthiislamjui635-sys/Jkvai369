import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

class JkCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final VoidCallback? onTap;
  final bool hasGoldBorder;
  final Color? customColor;
  final double borderRadius;

  const JkCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(16.0),
    this.margin,
    this.onTap,
    this.hasGoldBorder = false,
    this.customColor,
    this.borderRadius = 16.0,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final baseColor = customColor ?? (isDark ? AppColors.surfaceDark : AppColors.surfaceLight);

    final border = hasGoldBorder
        ? Border.all(color: AppColors.primaryGold.withOpacity(0.6), width: 1.5)
        : Border.all(
            color: isDark ? AppColors.boardPathBorderDark : AppColors.boardPathBorder,
            width: 1.0,
          );

    final cardContent = Container(
      padding: padding,
      decoration: BoxDecoration(
        color: baseColor,
        borderRadius: BorderRadius.circular(borderRadius),
        border: border,
        boxShadow: [
          BoxShadow(
            color: isDark ? Colors.black.withOpacity(0.35) : Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
          if (hasGoldBorder)
            BoxShadow(
              color: AppColors.primaryGold.withOpacity(0.12),
              blurRadius: 14,
              offset: const Offset(0, 2),
            ),
        ],
      ),
      child: child,
    );

    if (onTap != null) {
      return Container(
        margin: margin,
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(borderRadius),
            child: cardContent,
          ),
        ),
      );
    }

    return Container(
      margin: margin,
      child: cardContent,
    );
  }
}
