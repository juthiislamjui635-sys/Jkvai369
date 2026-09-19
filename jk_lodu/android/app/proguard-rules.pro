# Flutter Wrapper rules
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.**  { *; }
-keep class io.flutter.util.**  { *; }
-keep class io.flutter.view.**  { *; }
-keep class io.flutter.**  { *; }
-keep class io.flutter.plugins.**  { *; }
-dontwarn io.flutter.embedding.**

# UCrop Activity for image_cropper
-keep class com.yalantis.ucrop.** { *; }
-dontwarn com.yalantis.ucrop.**
