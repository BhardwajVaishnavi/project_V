# Flutter App - Quick Reference Guide

## Common Commands

```bash
# Get dependencies
flutter pub get

# Run app
flutter run

# Run with specific device
flutter run -d <device_id>

# List devices
flutter devices

# Clean build
flutter clean

# Format code
flutter format lib/

# Analyze code
flutter analyze

# Build APK
flutter build apk --release

# Build App Bundle
flutter build appbundle --release

# Build iOS
flutter build ios --release
```

## Project Structure

```
lib/
├── main.dart                 # Entry point
├── providers/
│   └── auth_provider.dart   # State management
├── services/
│   └── api_service.dart     # API calls
└── screens/
    ├── splash_screen.dart
    ├── auth/
    │   └── login_screen.dart
    └── home/
        ├── home_screen.dart
        ├── dashboard_screen.dart
        ├── vital_signs_screen.dart
        ├── lab_values_screen.dart
        ├── medications_screen.dart
        ├── appointments_screen.dart
        └── profile_screen.dart
```

## Key Files

| File | Purpose |
|------|---------|
| `main.dart` | App initialization and routing |
| `auth_provider.dart` | Authentication state |
| `api_service.dart` | API communication |
| `login_screen.dart` | Login UI |
| `dashboard_screen.dart` | Main dashboard |
| `home_screen.dart` | Bottom navigation |

## API Configuration

Edit `lib/services/api_service.dart`:

```dart
static const String baseUrl = 'http://localhost:5000/api';
```

## Test Credentials

```
Email: demo@example.com
Password: demo123
```

## Color Scheme

```dart
Primary: #1B8A8A (Teal)
Secondary: #E8F4F4 (Light Teal)
Success: #51CF66 (Green)
Danger: #FF6B6B (Red)
Warning: #FFD93D (Yellow)
```

## Dependencies

| Package | Purpose |
|---------|---------|
| provider | State management |
| http | API requests |
| shared_preferences | Local storage |
| jwt_decoder | JWT handling |
| fl_chart | Charts |
| flutter_secure_storage | Secure storage |

## Screens

| Screen | Route | Purpose |
|--------|-------|---------|
| Splash | / | Loading screen |
| Login | /login | Authentication |
| Home | /home | Main app |
| Dashboard | - | Overview |
| Vitals | - | Vital signs |
| Labs | - | Lab values |
| Meds | - | Medications |
| Appts | - | Appointments |
| Profile | - | User profile |

## Common Tasks

### Add a New Screen

1. Create file in `lib/screens/`
2. Create StatefulWidget
3. Add to navigation
4. Update routes in main.dart

### Add API Call

1. Add method to `ApiService`
2. Call from provider or screen
3. Handle response
4. Update UI

### Add State Management

1. Create provider class
2. Extend ChangeNotifier
3. Add methods and getters
4. Use Consumer widget in UI

### Build for Android

```bash
flutter build apk --release
```

### Build for iOS

```bash
flutter build ios --release
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Flutter not found | Add to PATH |
| Build failed | Run `flutter clean` |
| API error | Check backend URL |
| Device not found | Run `flutter devices` |
| Hot reload not working | Press `r` in terminal |

## Useful Links

- Flutter Docs: https://flutter.dev/docs
- Dart Docs: https://dart.dev
- Provider: https://pub.dev/packages/provider
- HTTP: https://pub.dev/packages/http

## Tips & Tricks

- Use `flutter run -d chrome` for web testing
- Use `flutter run --profile` for performance analysis
- Use `flutter format lib/` to format code
- Use `flutter analyze` to check code quality
- Use hot reload (press `r`) during development

## File Naming Convention

- Screens: `*_screen.dart`
- Providers: `*_provider.dart`
- Services: `*_service.dart`
- Models: `*_model.dart`
- Widgets: `*_widget.dart`

## Code Style

- Use camelCase for variables and functions
- Use PascalCase for classes
- Use UPPER_CASE for constants
- Add comments for complex logic
- Keep functions small and focused

---

**Last Updated**: October 2025

