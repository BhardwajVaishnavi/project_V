# 📱 Installation and Testing Guide

## 🎯 Quick Start

Your backend is fully deployed and your mobile app is ready to install!

---

## 📥 STEP 1: Install APK on Android Device

### Prerequisites
- Android device (Android 5.0 or higher)
- USB cable or ADB installed on your computer
- APK file: `dr_satya_portal/build/app/outputs/flutter-apk/app-release.apk`

### Installation Method 1: Using ADB (Recommended)

```bash
# Connect your Android device via USB
# Enable USB Debugging on your device

# Navigate to the project directory
cd g:\project_V

# Install the APK
adb install -r dr_satya_portal/build/app/outputs/flutter-apk/app-release.apk
```

**Expected Output:**
```
Success
```

### Installation Method 2: Manual Installation

1. Copy the APK file to your Android device
2. Open the file manager on your device
3. Navigate to the APK file
4. Tap to install
5. Grant permissions if prompted

---

## 🔐 STEP 2: Launch App and Login

### Test Credentials
```
Email:    patient1@example.com
Password: password123
```

### Login Steps
1. Open the app on your Android device
2. You should see the login screen
3. Enter the test email: `patient1@example.com`
4. Enter the test password: `password123`
5. Tap "Login"
6. Wait for authentication (should take 2-3 seconds)

### Expected Result
✅ Login successful
✅ Dashboard loads
✅ User profile displays
✅ No network errors

---

## ✅ STEP 3: Verify All Features

### Test Each Feature

#### 1. Dashboard
- [ ] Dashboard loads without errors
- [ ] User information displays correctly
- [ ] Navigation menu is accessible

#### 2. Patient Management
- [ ] Can view patient list
- [ ] Can view patient details
- [ ] Can add new patient (if permitted)

#### 3. Investigations
- [ ] Can view investigations
- [ ] Can add investigation records
- [ ] Data saves correctly

#### 4. Treatments
- [ ] Can view treatment records
- [ ] Can add new treatment
- [ ] Data persists

#### 5. Surgery Records
- [ ] Can view surgery history
- [ ] Can add surgery records
- [ ] Dates and details save correctly

#### 6. Follow-up Appointments
- [ ] Can view follow-up schedule
- [ ] Can add new follow-up
- [ ] Notifications work (if enabled)

#### 7. File Uploads
- [ ] Can upload medical documents
- [ ] Files are stored correctly
- [ ] Can download files

#### 8. Camps
- [ ] Can view camp information
- [ ] Can register for camps
- [ ] Registration saves

---

## 🌐 BACKEND VERIFICATION

### Check Backend Health

Open your browser and visit:
```
https://backend-chi-bay-86.vercel.app/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-24T08:00:26.012Z",
  "uptime": 19.883767018,
  "environment": "production",
  "database": "Connected",
  "nodeVersion": "v22.18.0"
}
```

### Check API Endpoints

Visit the root endpoint:
```
https://backend-chi-bay-86.vercel.app/
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Medical Patient Management System API",
  "version": "1.0.0",
  "environment": "production",
  "endpoints": {
    "health": "/health",
    "auth": "/api/auth",
    "patients": "/api/patients",
    "investigations": "/api/investigations",
    "treatments": "/api/treatments",
    "surgery": "/api/surgery",
    "liverTransplant": "/api/liver-transplant",
    "files": "/api/files",
    "followUp": "/api/follow-up"
  }
}
```

---

## 🐛 TROUBLESHOOTING

### Issue: "Network Error" on Login

**Solution:**
1. Check internet connection on device
2. Verify backend is running: `https://backend-chi-bay-86.vercel.app/health`
3. Check if firewall is blocking requests
4. Try again after 30 seconds

### Issue: "Invalid Credentials"

**Solution:**
1. Verify email: `patient1@example.com` (exact match)
2. Verify password: `password123` (exact match)
3. Check caps lock is off
4. Try logging out and logging back in

### Issue: "App Crashes on Startup"

**Solution:**
1. Uninstall the app: `adb uninstall com.kims.livertransplant`
2. Clear app cache
3. Reinstall the APK
4. Restart your device

### Issue: "Cannot Connect to Backend"

**Solution:**
1. Check internet connection
2. Verify backend URL in app settings
3. Check if Vercel is down: `https://backend-chi-bay-86.vercel.app/`
4. Wait 5 minutes and try again

---

## 📊 PERFORMANCE METRICS

### Expected Performance
- **Login Time:** 2-3 seconds
- **Dashboard Load:** 1-2 seconds
- **Patient List Load:** 1-2 seconds
- **API Response Time:** < 500ms

### Network Requirements
- **Minimum Speed:** 1 Mbps
- **Recommended Speed:** 5+ Mbps
- **Connection Type:** WiFi or 4G/5G

---

## 🔒 SECURITY NOTES

- ✅ All passwords are encrypted
- ✅ JWT tokens expire after 7 days
- ✅ HTTPS is used for all connections
- ✅ Database is secured with SSL
- ✅ API has rate limiting enabled

---

## 📞 SUPPORT

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify backend is running: `https://backend-chi-bay-86.vercel.app/health`
3. Check internet connection
4. Restart the app
5. Reinstall if necessary

---

## ✨ YOU'RE ALL SET!

Your system is ready to use. Install the APK, login with the test credentials, and enjoy your Liver Transplant Management System!

**Happy testing!** 🚀

