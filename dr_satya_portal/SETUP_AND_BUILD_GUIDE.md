# Flutter App - Setup and Build Guide

## Prerequisites

Before starting, ensure you have:

1. **Flutter SDK** (3.0.0+)
   - Download: https://flutter.dev/docs/get-started/install
   - Verify: `flutter --version`

2. **Dart SDK** (included with Flutter)
   - Verify: `dart --version`

3. **Android Studio** (for Android development)
   - Download: https://developer.android.com/studio
   - Install Android SDK, emulator, and build tools

4. **Xcode** (for iOS development - macOS only)
   - Install from App Store
   - Command line tools: `xcode-select --install`

5. **Git**
   - Download: https://git-scm.com

## Initial Setup

### 1. Verify Flutter Installation

```bash
flutter doctor
```

This will check your Flutter installation and show any missing dependencies.

### 2. Get Project Dependencies

```bash
cd dr_satya_portal
flutter pub get
```

### 3. Configure Backend URL

Edit `lib/services/api_service.dart`:

```dart
static const String baseUrl = 'http://localhost:5000/api';
```

For physical devices, use your machine's IP address:

```dart
static const String baseUrl = 'http://192.168.x.x:5000/api';
```

## Running the App

### Development Mode

```bash
flutter run
```

### With Specific Device

```bash
# List available devices
flutter devices

# Run on specific device
flutter run -d <device_id>
```

### Hot Reload

During development, press `r` in the terminal to hot reload the app.

## Building for Android

### Debug APK

```bash
flutter build apk --debug
```

Output: `build/app/outputs/flutter-app/debug/app-debug.apk`

### Release APK

```bash
flutter build apk --release
```

Output: `build/app/outputs/flutter-app/release/app-release.apk`

### App Bundle (for Google Play Store)

```bash
flutter build appbundle --release
```

Output: `build/app/outputs/bundle/release/app-release.aab`

## Building for iOS

### Debug Build

```bash
flutter build ios --debug
```

### Release Build

```bash
flutter build ios --release
```

### Archive for App Store

```bash
flutter build ios --release
cd ios
xcodebuild -workspace Runner.xcworkspace -scheme Runner -configuration Release -archivePath build/Runner.xcarchive archive
```

## Testing

### Run Tests

```bash
flutter test
```

### Run Specific Test

```bash
flutter test test/widget_test.dart
```

## Troubleshooting

### Issue: "Flutter not found"

**Solution**: Add Flutter to PATH
- Windows: Add `C:\flutter\bin` to PATH
- macOS/Linux: Add `~/flutter/bin` to PATH

### Issue: "Android SDK not found"

**Solution**:
```bash
flutter config --android-sdk /path/to/android/sdk
```

### Issue: "Xcode not found" (macOS)

**Solution**:
```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

### Issue: "Build failed"

**Solution**:
```bash
flutter clean
flutter pub get
flutter run
```

### Issue: "API connection failed"

**Solution**:
1. Verify backend is running
2. Check API URL in `lib/services/api_service.dart`
3. For physical devices, use device IP instead of localhost
4. Check firewall settings

## Performance Optimization

### Enable Release Mode

Always test with release builds:

```bash
flutter run --release
```

### Profile Mode

For performance analysis:

```bash
flutter run --profile
```

## Deployment

### Android Play Store

1. Create a keystore:
```bash
keytool -genkey -v -keystore ~/key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias key
```

2. Create `android/key.properties`:
```
storePassword=<password>
keyPassword=<password>
keyAlias=key
storeFile=<path-to-key.jks>
```

3. Build app bundle:
```bash
flutter build appbundle --release
```

4. Upload to Google Play Console

### iOS App Store

1. Create Apple Developer account
2. Create App ID and provisioning profile
3. Build and archive:
```bash
flutter build ios --release
```

4. Upload using Xcode or Transporter

## Useful Commands

```bash
# Clean build
flutter clean

# Get dependencies
flutter pub get

# Upgrade dependencies
flutter pub upgrade

# Format code
flutter format lib/

# Analyze code
flutter analyze

# Generate app icons
flutter pub run flutter_launcher_icons:main

# Generate splash screen
flutter pub run flutter_native_splash:create
```

## Documentation

- Flutter Docs: https://flutter.dev/docs
- Dart Docs: https://dart.dev/guides
- Provider Package: https://pub.dev/packages/provider
- HTTP Package: https://pub.dev/packages/http

---

**Last Updated**: October 2025

