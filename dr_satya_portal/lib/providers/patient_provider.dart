import 'package:flutter/material.dart';
import '../services/api_service.dart';

class PatientProvider extends ChangeNotifier {
  late final ApiService _apiService;

  List<Map<String, dynamic>> _patients = [];
  Map<String, dynamic>? _selectedPatient;
  bool _isLoading = false;
  String? _error;

  PatientProvider() {
    try {
      _apiService = ApiService();
    } catch (e) {
      // If ApiService fails to initialize, continue anyway
    }
  }

  // Getters
  List<Map<String, dynamic>> get patients => _patients;
  Map<String, dynamic>? get selectedPatient => _selectedPatient;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Fetch all patients
  Future<void> fetchPatients() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.get('/patients');

      if (response['success'] == true) {
        _patients = List<Map<String, dynamic>>.from(response['data'] ?? []);
        _isLoading = false;
        notifyListeners();
      } else {
        _error = response['message'] ?? 'Failed to fetch patients';
        _isLoading = false;
        notifyListeners();
      }
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  // Get patient by ID
  Future<void> getPatientById(String patientId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.get('/patients/$patientId');

      if (response['success'] == true) {
        _selectedPatient = response['data'];
        _isLoading = false;
        notifyListeners();
      } else {
        _error = response['message'] ?? 'Failed to fetch patient';
        _isLoading = false;
        notifyListeners();
      }
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  // Select patient from list
  void selectPatient(Map<String, dynamic> patient) {
    _selectedPatient = patient;
    notifyListeners();
  }

  // Clear selected patient
  void clearSelectedPatient() {
    _selectedPatient = null;
    notifyListeners();
  }

  // Get patient name
  String getPatientName(Map<String, dynamic> patient) {
    final firstName = patient['firstName'] ?? '';
    final lastName = patient['lastName'] ?? '';
    return '$firstName $lastName'.trim();
  }

  // Get patient display text for dropdown
  String getPatientDisplayText(Map<String, dynamic> patient) {
    final name = getPatientName(patient);
    final patientId = patient['patientId'] ?? '';
    return '$name ($patientId)';
  }
}
