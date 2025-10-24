# 📱 KIMS Liver Transplant - Installation & Testing Guide

---

## 🔧 Installation Steps

### For Android Devices

#### Step 1: Download APK
- Download: `app-release.apk` (47.9 MB)
- Location: `dr_satya_portal/build/app/outputs/flutter-apk/app-release.apk`

#### Step 2: Enable Installation from Unknown Sources
1. Go to **Settings** → **Security**
2. Enable **"Unknown Sources"** or **"Install unknown apps"**
3. Select your file manager or browser

#### Step 3: Install APK
1. Locate the downloaded APK file
2. Tap to install
3. Wait for installation to complete
4. Tap **"Open"** to launch the app

#### Step 4: Grant Permissions
- Camera (for document upload)
- Storage (for file access)
- Calendar (for appointments)

---

## 🧪 Testing Checklist

### Login Screen
- [ ] App launches with splash screen
- [ ] KIMS logo visible on splash screen
- [ ] Light background displays correctly
- [ ] Login form appears after splash
- [ ] Enter test credentials:
  - Email: `patient1@example.com`
  - Password: `password123`
- [ ] Login successful

### Dashboard Screen
- [ ] KIMS logo visible in AppBar
- [ ] Light background applied
- [ ] Welcome message displays
- [ ] Quick action buttons visible:
  - [ ] Vital Signs button → navigates to Vital Signs tab
  - [ ] Lab Values button → navigates to Lab Values tab
  - [ ] Medications button → navigates to Medications tab
  - [ ] Appointments button → navigates to Appointments tab

### Vital Signs Tab
- [ ] KIMS logo visible in AppBar
- [ ] Light background applied
- [ ] "Add Vital Signs" button works
- [ ] Form opens with fields:
  - [ ] Blood Pressure (Systolic/Diastolic)
  - [ ] Heart Rate
  - [ ] Temperature
  - [ ] Oxygen Level
- [ ] Form validation works (all fields required)
- [ ] Submit button saves data
- [ ] Success message displays
- [ ] Form clears after submission

### Lab Values Tab
- [ ] KIMS logo visible in AppBar
- [ ] Light background applied
- [ ] Lab test results display
- [ ] "View Trend" button works
- [ ] Animated chart displays in full-screen modal
- [ ] Chart animation is smooth
- [ ] Close button works

### Medications Tab
- [ ] KIMS logo visible in AppBar
- [ ] Light background applied
- [ ] Current medications list displays
- [ ] "Add Medication" button works
- [ ] Form opens with fields:
  - [ ] Medication name
  - [ ] Dosage
  - [ ] Frequency
  - [ ] Instructions
- [ ] Form submission works
- [ ] Success message displays

### Appointments Tab
- [ ] KIMS logo visible in AppBar
- [ ] Light background applied
- [ ] Upcoming appointments display
- [ ] "Schedule Appointment" button works
- [ ] Form opens with fields:
  - [ ] Doctor name
  - [ ] Date picker
  - [ ] Time picker
  - [ ] Reason for visit
- [ ] Date/time pickers work correctly
- [ ] Form submission works

### Profile Tab
- [ ] KIMS logo visible in AppBar
- [ ] Light background applied
- [ ] User profile information displays
- [ ] "Edit Profile" button works
- [ ] Edit form opens with fields:
  - [ ] First name
  - [ ] Last name
  - [ ] Email
  - [ ] Phone
  - [ ] Address
- [ ] "Upload Medical Document" button works
- [ ] File picker opens
- [ ] Form submission works

### General UI/UX
- [ ] All text is readable (dark text on light background)
- [ ] All buttons are clickable
- [ ] All icons are visible
- [ ] Animations are smooth
- [ ] No console errors
- [ ] App doesn't crash
- [ ] Navigation works smoothly
- [ ] Forms validate correctly

---

## 🎨 Visual Verification

### Colors
- [ ] Background is light gray (#F5F5F5)
- [ ] AppBars are light gray (#F5F5F5)
- [ ] Logo colors (green, blue, golden) are visible
- [ ] Text is dark and readable
- [ ] Buttons are green (#2E7D32)

### Logo
- [ ] Logo visible on splash screen (120x120)
- [ ] Logo visible on all tab headers (40x40)
- [ ] Logo colors stand out against light background
- [ ] App icon displays correctly on home screen

### Typography
- [ ] Headers are bold and italic
- [ ] Text is properly sized
- [ ] Letter spacing is consistent

---

## 🐛 Troubleshooting

### App Won't Install
- Ensure "Unknown Sources" is enabled
- Check device storage space (need ~100 MB)
- Try clearing cache: Settings → Apps → Clear Cache

### App Crashes on Launch
- Uninstall and reinstall
- Clear app data: Settings → Apps → KIMS Liver Transplant → Clear Data
- Restart device

### Logo Not Visible
- Check device brightness
- Ensure app has latest version
- Clear app cache and restart

### Forms Not Submitting
- Check internet connection
- Verify backend server is running
- Check form validation (all fields required)

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the app logs
3. Contact development team

---

## ✅ Sign-Off

Once all tests pass, the app is ready for:
- ✅ User distribution
- ✅ Google Play Store upload
- ✅ Production deployment

**Tested Date:** ___________  
**Tested By:** ___________  
**Status:** ___________

