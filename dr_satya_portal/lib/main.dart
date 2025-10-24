import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'providers/auth_provider.dart';
import 'providers/patient_provider.dart';
import 'screens/auth/login_screen.dart';
import 'screens/home/home_screen.dart';
import 'screens/splash_screen.dart';

void main() async {
  try {
    WidgetsFlutterBinding.ensureInitialized();
    final prefs = await SharedPreferences.getInstance();
    runApp(MyApp(prefs: prefs));
  } catch (e) {
    // Fallback if initialization fails
    runApp(const ErrorApp());
  }
}

class ErrorApp extends StatelessWidget {
  const ErrorApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "KIMS Liver Transplant - Error",
      home: Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              Icon(Icons.error, size: 64, color: Colors.red),
              SizedBox(height: 16),
              Text('Failed to initialize app'),
              SizedBox(height: 8),
              Text('Please restart the application'),
            ],
          ),
        ),
      ),
    );
  }
}

class MyApp extends StatelessWidget {
  final SharedPreferences prefs;

  const MyApp({Key? key, required this.prefs}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    try {
      return MultiProvider(
        providers: [
          ChangeNotifierProvider(
            create: (_) {
              try {
                return AuthProvider(prefs);
              } catch (e) {
                return AuthProvider(prefs);
              }
            },
          ),
          ChangeNotifierProvider(
            create: (_) {
              try {
                return PatientProvider();
              } catch (e) {
                return PatientProvider();
              }
            },
          ),
        ],
        child: MaterialApp(
          title: "KIMS Liver Transplant",
          theme: ThemeData(
            primaryColor: const Color(0xFF2E7D32), // Green
            useMaterial3: true,
            colorScheme: ColorScheme.fromSeed(
              seedColor: const Color(0xFF2E7D32), // Green-based theme
              brightness: Brightness.light,
            ),
            scaffoldBackgroundColor:
                const Color(0xFFF5F5F5), // Light background
          ),
          home: const SplashScreen(),
          routes: {
            '/login': (context) => const LoginScreen(),
            '/home': (context) => const HomeScreen(),
          },
        ),
      );
    } catch (e) {
      return const ErrorApp();
    }
  }
}
