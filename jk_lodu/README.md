# JK LODU - Professional Multiplayer Ludo Game

A modern, production-grade multiplayer Ludo mobile game built with Flutter & Firebase.

## Phase 1: Project Setup & Clean Architecture

### Architecture Layers
- `lib/app/`: Core App widget, routing, theme configurations (Light & Dark luxury).
- `lib/core/`: Constants (colors, dimensions), services (logging, service locator), utilities, and validators.
- `lib/auth/`: Firebase Auth + Google Sign-In models, controllers, and screens.
- `lib/profile/`: Player profile models, avatar upload (Firebase Storage), XP/level calculations.
- `lib/home/`: Main lobby, mode selection (Quick Play, Create/Join Room, Play with AI).
- `lib/room/`: Private room codes, matchmaking lobby.
- `lib/game/`: Separate deterministic Ludo game engine, board representation, token state machine.
- `lib/multiplayer/`: Realtime Database turn sync, move broadcasting, and anti-cheat validation.
- `lib/ai/`: Unit-testable AI heuristics (Easy, Medium, Hard).
- `lib/friends/`: Friend IDs, invitations, online presence.
- `lib/leaderboard/`: Paginated global, weekly, and monthly rankings.
- `lib/settings/`: Sound, music, vibration, graphics, and privacy controls.

### Quick Start
```bash
# 1. Ensure Flutter 3.19+ is installed
flutter doctor

# 2. Get dependencies
flutter pub get

# 3. Run on connected Android device or emulator
flutter run
```
