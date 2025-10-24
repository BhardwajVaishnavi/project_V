import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'dart:convert';
import '../services/api_service.dart';

class AuthProvider extends ChangeNotifier {
  final SharedPreferences prefs;
  late final ApiService _apiService;

  String? _token;
  Map<String, dynamic>? _user;
  bool _isLoading = false;
  String? _error;

  AuthProvider(this.prefs) {
    try {
      _apiService = ApiService();
    } catch (e) {
      // If ApiService fails to initialize, continue anyway
      // It will fail gracefully when trying to make requests
    }
    _loadStoredToken();
  }

  // Getters
  String? get token => _token;
  Map<String, dynamic>? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated {
    try {
      return _token != null && !JwtDecoder.isExpired(_token!);
    } catch (e) {
      return false;
    }
  }

  // Load stored token
  void _loadStoredToken() {
    try {
      _token = prefs.getString('authToken');
      final userJson = prefs.getString('userData');
      if (userJson != null && userJson.isNotEmpty) {
        _user = jsonDecode(userJson) as Map<String, dynamic>;
      }
    } catch (e) {
      // Silently fail if stored data is corrupted
      _token = null;
      _user = null;
    }
  }

  // Login
  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.post(
        '/auth/login',
        {
          'email': email,
          'password': password,
        },
      );

      if (response['success'] == true) {
        _token = response['data']['token'];
        _user = response['data']['user'];

        // Store token and user data
        await prefs.setString('authToken', _token!);
        await prefs.setString('userData', jsonEncode(_user));

        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = response['message'] ?? 'Login failed';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Get error message
  String? get errorMessage => _error;

  // Logout
  Future<void> logout() async {
    _token = null;
    _user = null;
    await prefs.remove('authToken');
    await prefs.remove('userData');
    notifyListeners();
  }
}
