import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

class JkAvatar extends StatelessWidget {
  final String? photoUrl;
  final String name;
  final double radius;
  final int? level;
  final bool isOnline;
  final Color? ringColor;
  final VoidCallback? onTap;

  const JkAvatar({
    super.key,
    this.photoUrl,
    required this.name,
    this.radius = 24.0,
    this.level,
    this.isOnline = true,
    this.ringColor,
    this.onTap,
  });

  String _getInitials(String str) {
    if (str.isEmpty) return 'JK';
    final parts = str.trim().split(' ');
    if (parts.length > 1) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return str.substring(0, str.length > 2 ? 2 : str.length).toUpperCase();
  }

  @override
  Widget build(BuildContext context) {
    final borderColor = ringColor ?? AppColors.primaryGold;
    final size = radius * 2;

    Widget avatarCore = Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: borderColor, width: 2.5),
        boxShadow: [
          BoxShadow(
            color: borderColor.withOpacity(0.3),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ClipOval(
        child: photoUrl != null && photoUrl!.isNotEmpty
            ? Image.network(
                photoUrl!,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => _buildFallback(),
              )
            : _buildFallback(),
      ),
    );

    Widget wrapped = Stack(
      clipBehavior: Clip.none,
      children: [
        avatarCore,
        if (level != null)
          Positioned(
            bottom: -4,
            right: -4,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppColors.primaryGold, AppColors.goldDark],
                ),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.white, width: 1.2),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.3),
                    blurRadius: 4,
                  ),
                ],
              ),
              child: Text(
                'Lv.$level',
                style: const TextStyle(
                  color: Colors.black,
                  fontSize: 9,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),
          ),
        if (isOnline && level == null)
          Positioned(
            bottom: 2,
            right: 2,
            child: Container(
              width: 10,
              height: 10,
              decoration: BoxDecoration(
                color: AppColors.success,
                shape: BoxShape.circle,
                border: Border.all(color: Colors.white, width: 1.5),
              ),
            ),
          ),
      ],
    );

    if (onTap != null) {
      return GestureDetector(
        onTap: onTap,
        child: wrapped,
      );
    }
    return wrapped;
  }

  Widget _buildFallback() {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF334155), Color(0xFF1E293B)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Center(
        child: Text(
          _getInitials(name),
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w900,
            fontSize: radius * 0.75,
            letterSpacing: 0.5,
          ),
        ),
      ),
    );
  }
}
