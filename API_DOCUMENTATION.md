# Medical Patient Management System - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All API endpoints (except authentication) require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Authentication Endpoints

### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "doctor@medical.com",
  "password": "password123",
  "firstName": "Dr. John",
  "lastName": "Doe",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "doctor@medical.com",
      "firstName": "Dr. John",
      "lastName": "Doe",
      "role": "DOCTOR"
    },
    "token": "jwt_token"
  }
}
```

### POST /auth/login
Login user.

**Request Body:**
```json
{
  "email": "doctor@medical.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "doctor@medical.com",
      "firstName": "Dr. John",
      "lastName": "Doe",
      "role": "DOCTOR"
    },
    "token": "jwt_token"
  }
}
```

### GET /auth/me
Get current user information.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "doctor@medical.com",
      "firstName": "Dr. John",
      "lastName": "Doe",
      "role": "DOCTOR"
    }
  }
}
```

## Patient Endpoints

### GET /patients
Get all patients with pagination and filters.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search term
- `sex` (string): Filter by sex (MALE, FEMALE, OTHER)
- `sortBy` (string): Sort field (default: createdAt)
- `sortOrder` (string): Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "id": "uuid",
        "patientId": "PAT20241001",
        "firstName": "John",
        "lastName": "Doe",
        "dateOfBirth": "1990-01-01",
        "sex": "MALE",
        "mobile": "9876543210",
        "age": 34
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalCount": 100,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### GET /patients/:id
Get patient by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "patient": {
      "id": "uuid",
      "patientId": "PAT20241001",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-01-01",
      "sex": "MALE",
      "mobile": "9876543210",
      "email": "john@example.com",
      "comorbidities": [],
      "investigations": [],
      "treatments": []
    }
  }
}
```

### POST /patients
Create new patient.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "sex": "MALE",
  "mobile": "9876543210",
  "email": "john@example.com",
  "aadharNumber": "123456789012",
  "height": 175,
  "weight": 70
}
```

### PUT /patients/:id
Update patient.

### DELETE /patients/:id
Soft delete patient.

## Investigation Endpoints

### GET /investigations
Get all investigations with pagination and filters.

### GET /investigations/:id
Get investigation by ID.

### POST /investigations
Create new investigation.

**Request Body:**
```json
{
  "patientId": "uuid",
  "investigationType": "ULTRASONOGRAPHY",
  "date": "2024-01-01",
  "findings": "Normal findings",
  "status": "COMPLETED"
}
```

### PUT /investigations/:id
Update investigation.

### DELETE /investigations/:id
Delete investigation.

## Treatment Endpoints

### GET /treatments
Get all treatments.

### POST /treatments
Create new treatment.

**Request Body:**
```json
{
  "patientId": "uuid",
  "finalDiagnosis": "Diagnosis",
  "treatmentPlan": "Treatment plan",
  "primaryTreatmentPlan": "CONSERVATIVE",
  "medication1": "Medicine 1",
  "medication2": "Medicine 2"
}
```

## Surgery Endpoints

### GET /surgery
Get all surgeries.

### POST /surgery
Create new surgery.

**Request Body:**
```json
{
  "patientId": "uuid",
  "nameOfSurgery": "Appendectomy",
  "planDate": "2024-01-01",
  "surgeon": "Dr. Smith",
  "risksAssociated": "Standard surgical risks"
}
```

## Liver Transplant Endpoints

### GET /liver-transplant/evaluations
Get all liver transplant evaluations.

### POST /liver-transplant/evaluations
Create new liver transplant evaluation.

**Request Body:**
```json
{
  "patientId": "uuid",
  "name": "John Doe",
  "age": 45,
  "sex": "MALE",
  "mobileNumber": "9876543210",
  "heightCm": 175,
  "weightKg": 70
}
```

### POST /liver-transplant/evaluations/:id/viral-markers
Update viral markers for evaluation.

### POST /liver-transplant/evaluations/:id/clearances
Update clearances for evaluation.

### GET /liver-transplant/evaluations/:id/progress
Get evaluation progress summary.

## Follow-up Endpoints

### GET /follow-up
Get all follow-ups.

### POST /follow-up
Create new follow-up.

**Request Body:**
```json
{
  "patientId": "uuid",
  "followUpDate": "2024-01-01",
  "status": "SCHEDULED",
  "notes": "Regular follow-up"
}
```

### GET /follow-up/upcoming
Get upcoming follow-ups.

**Query Parameters:**
- `days` (number): Number of days to look ahead (default: 7)

## File Upload Endpoints

### POST /files/upload
Upload single file.

**Request Body (multipart/form-data):**
- `file`: File to upload
- `patientId`: Patient ID
- `documentType`: Document type (LAB_REPORT, IMAGING_REPORT, etc.)
- `description`: File description

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "document": {
      "id": "uuid",
      "fileName": "report.pdf",
      "fileUrl": "https://s3.amazonaws.com/bucket/file.pdf"
    }
  }
}
```

### POST /files/upload-multiple
Upload multiple files.

### GET /files/patient/:patientId
Get all files for a patient.

### GET /files/:id/download
Generate signed URL for file download.

### DELETE /files/:id
Delete file.

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

API requests are limited to 100 requests per 15 minutes per IP address.

## Data Types

### User Roles
- `ADMIN` - Full system access
- `DOCTOR` - Medical staff access
- `NURSE` - Nursing staff access
- `STAFF` - General staff access

### Sex Options
- `MALE`
- `FEMALE`
- `OTHER`

### Investigation Types
- `ULTRASONOGRAPHY`
- `CECT_ABDOMEN`
- `UPPER_GI_ENDOSCOPY`
- `ENDOSCOPIC_BIOPSY`
- `COLONOSCOPY`
- `COLONOSCOPIC_BIOPSY`
- `PET_CT_SCAN`
- `OTHER_BIOPSY`
- `BLOOD_TEST`
- `URINE_TEST`
- `IMAGING`
- `OTHER`

### Investigation Status
- `PENDING`
- `SCHEDULED`
- `COMPLETED`
- `REVIEWED`
- `CANCELLED`

### Treatment Types
- `CONSERVATIVE`
- `SURGERY`
- `CHEMOTHERAPY`
- `RADIOTHERAPY`
- `REFERRED_OTHER_DEPARTMENT`

### Follow-up Status
- `SCHEDULED`
- `COMPLETED`
- `MISSED`
- `CANCELLED`
- `RESCHEDULED`

### Document Types
- `LAB_REPORT`
- `IMAGING_REPORT`
- `PRESCRIPTION`
- `CONSENT_FORM`
- `DISCHARGE_SUMMARY`
- `BIOPSY_REPORT`
- `ENDOSCOPY_REPORT`
- `SURGICAL_REPORT`
- `FOLLOW_UP_REPORT`
- `OTHER`
