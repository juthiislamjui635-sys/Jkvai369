import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';

class JkTypography {
  JkTypography._();

  static TextStyle displayLarge({Color? color}) => GoogleFonts.poppins(
        fontSize: 32,
        fontWeight: FontWeight.w900,
        letterSpacing: 1.5,
        color: color,
      );

  static TextStyle displayMedium({Color? color}) => GoogleFonts.poppins(
        fontSize: 26,
        fontWeight: FontWeight.w800,
        letterSpacing: 1.0,
        color: color,
      );

  static TextStyle titleLarge({Color? color}) => GoogleFonts.poppins(
        fontSize: 20,
        fontWeight: FontWeight.w800,
        letterSpacing: 0.5,
        color: color,
      );

  static TextStyle titleMedium({Color? color}) => GoogleFonts.poppins(
        fontSize: 16,
        fontWeight: FontWeight.w700,
        color: color,
      );

  static TextStyle bodyMedium({Color? color}) => GoogleFonts.poppins(
        fontSize: 14,
        fontWeight: FontWeight.w500,
        color: color,
      );

  static TextStyle bodySmall({Color? color}) => GoogleFonts.poppins(
        fontSize: 12,
        fontWeight: FontWeight.w500,
        color: color,
      );

  static TextStyle labelGold({double fontSize = 12}) => GoogleFonts.poppins(
        fontSize: fontSize,
        fontWeight: FontWeight.w800,
        letterSpacing: 0.6,
        color: AppColors.primaryGold,
      );
}
