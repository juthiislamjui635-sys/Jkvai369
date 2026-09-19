import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

enum JkButtonVariant {
  primaryGold,
  secondary,
  outline,
  danger,
}

class JkButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;
  final JkButtonVariant variant;
  final bool isLoading;
  final bool isFullWidth;
  final double height;
  final double? width;
  final EdgeInsetsGeometry? padding;

  const JkButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.variant = JkButtonVariant.primaryGold,
    this.isLoading = false,
    this.isFullWidth = false,
    this.height = 48.0,
    this.width,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    Widget childContent;
    if (isLoading) {
      childContent = SizedBox(
        width: 20,
        height: 20,
        child: CircularProgressIndicator(
          strokeWidth: 2.4,
          valueColor: AlwaysStoppedAnimation<Color>(
            variant == JkButtonVariant.primaryGold ? Colors.black : AppColors.primaryGold,
          ),
        ),
      );
    } else if (icon != null) {
      childContent = Row(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 18),
          const SizedBox(width: 8),
          Text(
            label,
            style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14, letterSpacing: 0.4),
          ),
        ],
      );
    } else {
      childContent = Text(
        label,
        style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14, letterSpacing: 0.4),
      );
    }

    Widget button;

    switch (variant) {
      case JkButtonVariant.primaryGold:
        button = Container(
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [AppColors.primaryGold, AppColors.goldDark],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
            borderRadius: BorderRadius.circular(14),
            boxShadow: [
              BoxShadow(
                color: AppColors.primaryGold.withOpacity(0.35),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: ElevatedButton(
            onPressed: isLoading ? null : onPressed,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.transparent,
              shadowColor: Colors.transparent,
              foregroundColor: Colors.black,
              padding: padding ?? const EdgeInsets.symmetric(horizontal: 22),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            ),
            child: childContent,
          ),
        );
        break;

      case JkButtonVariant.secondary:
        button = ElevatedButton(
          onPressed: isLoading ? null : onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: isDark ? AppColors.surfaceDark : AppColors.cardLight,
            foregroundColor: isDark ? Colors.white : AppColors.textLightPrimary,
            elevation: 1,
            padding: padding ?? const EdgeInsets.symmetric(horizontal: 22),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(14),
              side: BorderSide(
                color: isDark ? AppColors.boardPathBorderDark : AppColors.boardPathBorder,
              ),
            ),
          ),
          child: childContent,
        );
        break;

      case JkButtonVariant.outline:
        button = OutlinedButton(
          onPressed: isLoading ? null : onPressed,
          style: OutlinedButton.styleFrom(
            foregroundColor: isDark ? Colors.white : AppColors.textLightPrimary,
            padding: padding ?? const EdgeInsets.symmetric(horizontal: 20),
            side: BorderSide(
              color: isDark ? AppColors.boardPathBorderDark : AppColors.boardPathBorder,
              width: 1.5,
            ),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          ),
          child: childContent,
        );
        break;

      case JkButtonVariant.danger:
        button = ElevatedButton(
          onPressed: isLoading ? null : onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.playerRed,
            foregroundColor: Colors.white,
            elevation: 2,
            padding: padding ?? const EdgeInsets.symmetric(horizontal: 22),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          ),
          child: childContent,
        );
        break;
    }

    return SizedBox(
      width: isFullWidth ? double.infinity : width,
      height: height,
      child: button,
    );
  }
}
