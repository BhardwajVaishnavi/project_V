# 📱 KIMS Liver Transplant - Installation Instructions

## 🎯 Quick Start

### Option 1: Install APK on Android Device

#### Prerequisites:
- Android device with Android 5.0 (API 21) or higher
- USB cable (for file transfer)
- Unknown sources enabled in Settings

#### Steps:

1. **Download the APK**
   - File: `app-release.apk`
   - Size: 50.2 MB
   - Location: `dr_satya_portal/build/app/outputs/flutter-apk/app-release.apk`

2. **Enable Installation from Unknown Sources**
   - Go to Settings → Security
   - Enable "Unknown Sources" or "Install unknown apps"
   - (Steps may vary by Android version)

3. **Transfer APK to Device**
   - Connect device via USB
   - Copy `app-release.apk` to device storage
   - Or use ADB: `adb install app-release.apk`

4. **Install the App**
   - Open file manager on device
   - Navigate to the APK file
   - Tap to install
   - Grant permissions when prompted

5. **Launch the App**
   - Find "KIMS Liver Transplant" in app drawer
   - Tap to open
   - Login with test credentials

---

## 🔐 Test Credentials

```
Email: patient1@example.com
Password: password123
```

---

## 📋 System Requirements

**Minimum:**
- Android 5.0 (API 21)
- 50 MB free storage
- Internet connection

**Recommended:**
- Android 8.0 or higher
- 100 MB free storage
- WiFi or 4G connection

---

## ✅ Verification Checklist

After installation, verify:

- [ ] App launches without crashing
- [ ] Splash screen displays KIMS logo
- [ ] Login screen appears
- [ ] Can login with test credentials
- [ ] Dashboard loads successfully
- [ ] All tabs are accessible:
  - [ ] Dashboard
  - [ ] Vital Signs
  - [ ] Lab Values
  - [ ] Medications
  - [ ] Appointments
  - [ ] Profile
- [ ] Logo appears in all tab headers
- [ ] Light background theme is visible
- [ ] Green-blue-golden colors are displayed

---

## 🐛 Troubleshooting

### App Won't Install
- **Solution:** Ensure "Unknown Sources" is enabled
- **Solution:** Check device has 50 MB free storage
- **Solution:** Try using ADB: `adb install app-release.apk`

### App Crashes on Launch
- **Solution:** Uninstall and reinstall the app
- **Solution:** Clear app cache: Settings → Apps → KIMS Liver Transplant → Storage → Clear Cache
- **Solution:** Ensure Android version is 5.0 or higher

### Logo Not Displaying
- **Solution:** This is normal - app has fallback UI
- **Solution:** Check internet connection
- **Solution:** Reinstall the app

### Login Issues
- **Solution:** Ensure backend server is running
- **Solution:** Check internet connection
- **Solution:** Verify credentials: patient1@example.com / password123

---

## 🔄 Uninstall

To remove the app:
1. Go to Settings → Apps
2. Find "KIMS Liver Transplant"
3. Tap "Uninstall"
4. Confirm

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review app logs in Android Studio
3. Contact development team

---

## 🎊 Installation Complete!

Your KIMS Liver Transplant app is now ready to use. Enjoy managing your post-transplant care!

