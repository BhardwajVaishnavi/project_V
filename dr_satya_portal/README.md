# Dr. Satya's Portal - Flutter Mobile App

A comprehensive Flutter mobile application for post-transplant patient care management.

## Features

- ✅ **Authentication** - Secure login and registration
- ✅ **Dashboard** - Patient overview with quick actions
- ✅ **Vital Signs** - Track blood pressure, heart rate, temperature
- ✅ **Lab Values** - View and manage lab test results
- ✅ **Medications** - Manage prescriptions and set reminders
- ✅ **Appointments** - Schedule and manage doctor appointments
- ✅ **Profile** - View and edit patient information
- ✅ **Charts & Graphs** - Visualize health trends
- ✅ **Responsive Design** - Works on all screen sizes

## Prerequisites

- Flutter SDK (3.0.0 or higher)
- Dart SDK (included with Flutter)
- Android Studio or Xcode (for emulator)
- Git

## Installation

### 1. Install Flutter

Download and install Flutter from: https://flutter.dev/docs/get-started/install

### 2. Clone the Project

```bash
cd dr_satya_portal
```

### 3. Get Dependencies

```bash
flutter pub get
```

### 4. Configure Backend URL

Edit `lib/services/api_service.dart` and update the API base URL:

```dart
static const String baseUrl = 'http://localhost:5000/api';
```

## Running the App

### On Android Emulator

```bash
flutter run
```

### On iOS Simulator (macOS only)

```bash
flutter run -d macos
```

### On Physical Device

1. Connect your device via USB
2. Enable USB debugging (Android) or developer mode (iOS)
3. Run:

```bash
flutter run
```

### Build APK (Android)

```bash
flutter build apk --release
```

The APK will be generated at: `build/app/outputs/flutter-app/release/app-release.apk`

### Build IPA (iOS)

```bash
flutter build ios --release
```

## Project Structure

```
lib/
├── main.dart                 # App entry point
├── providers/
│   └── auth_provider.dart   # Authentication state management
├── services/
│   └── api_service.dart     # API communication
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

## Dependencies

- **provider** - State management
- **http** - HTTP requests
- **shared_preferences** - Local storage
- **jwt_decoder** - JWT token handling
- **fl_chart** - Charts and graphs
- **flutter_secure_storage** - Secure token storage
- **intl** - Internationalization
- **image_picker** - Image selection
- **url_launcher** - Open URLs and make calls

## Test Credentials

```
Email: demo@example.com
Password: demo123
```

## API Endpoints

The app connects to the following backend endpoints:

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /patients/profile` - Get patient profile
- `GET /investigations` - Get lab values
- `GET /treatments` - Get medications
- `GET /follow-up` - Get appointments

## Troubleshooting

### Issue: "Flutter command not found"
**Solution**: Add Flutter to your PATH environment variable

### Issue: "No connected devices"
**Solution**: 
- Start Android emulator: `emulator -avd <emulator_name>`
- Or connect a physical device with USB debugging enabled

### Issue: "API connection failed"
**Solution**:
- Verify backend is running on `http://localhost:5000`
- Check API URL in `lib/services/api_service.dart`
- Ensure device can reach the backend (use device IP for physical devices)

### Issue: "Build failed"
**Solution**:
```bash
flutter clean
flutter pub get
flutter run
```

## Building for Production

### Android

```bash
flutter build apk --release
flutter build appbundle --release
```

### iOS

```bash
flutter build ios --release
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is proprietary and confidential.

## Support

For issues or questions, contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: October 2025

