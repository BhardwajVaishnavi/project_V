# 🚀 DEPLOYMENT INSTRUCTIONS - KIMS LIVER TRANSPLANT

## ⏱️ TOTAL TIME: 15 MINUTES

---

## 🎯 WHAT YOU'LL ACCOMPLISH

✅ Deploy backend to Vercel (live on internet)  
✅ Connect mobile app to backend  
✅ Rebuild APK with backend URL  
✅ Install APK on Android device  
✅ Test complete app functionality  

---

## 🚀 START HERE: AUTOMATED DEPLOYMENT

### Run this command:

```powershell
.\deploy-backend.ps1
```

**This script will:**
1. ✅ Install Vercel CLI
2. ✅ Deploy backend to Vercel
3. ✅ Update mobile app with backend URL
4. ✅ Rebuild APK
5. ✅ Verify everything

**That's it! The script handles everything.**

---

## 📋 IF SCRIPT DOESN'T WORK: MANUAL STEPS

### Step 1: Install Vercel CLI

```powershell
npm install -g vercel
```

### Step 2: Login to Vercel

```powershell
vercel login
```

Browser opens → Click "Continue" → Return to PowerShell

### Step 3: Deploy Backend

```powershell
cd backend
vercel deploy --prod
```

**Answer prompts:**
- "Set up and deploy?" → `y`
- "Which scope?" → Select your account
- "Link to existing project?" → `n`
- "Project name?" → Press Enter
- "Detected location?" → Press Enter

**COPY THIS URL:**
```
✓ Production: https://your-project-name.vercel.app
```

### Step 4: Set Environment Variables

1. Go to: https://vercel.com/dashboard
2. Click your project
3. Settings → Environment Variables
4. Add these variables:

```
DATABASE_URL = postgresql://neondb_owner:npg_MNradm8kS6oX@ep-weathered-wind-adtoyz47-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET = medical_patient_management_super_secret_key_2024

JWT_EXPIRES_IN = 7d

NODE_ENV = production
```

5. Click "Save"
6. Go to "Deployments" → Latest → Click "Redeploy"

### Step 5: Update Mobile App

**File:** `dr_satya_portal/lib/services/api_service.dart`

**Find line 8:**
```dart
static const String baseUrl = 'http://localhost:5000/api';
```

**Replace with your backend URL:**
```dart
static const String baseUrl = 'https://your-project-name.vercel.app/api';
```

**Example:**
```dart
static const String baseUrl = 'https://kims-liver-transplant.vercel.app/api';
```

### Step 6: Rebuild APK

```powershell
cd dr_satya_portal
flutter clean
flutter pub get
flutter build apk --release
```

**Wait 5-10 minutes for build to complete.**

---

## 📱 INSTALL & TEST

### Step 1: Connect Android Device

```powershell
adb devices
```

Your device should appear in the list.

### Step 2: Install APK

```powershell
adb install -r dr_satya_portal/build/app/outputs/flutter-apk/app-release.apk
```

**Expected output:**
```
Success
```

### Step 3: Open App

- Tap KIMS Liver Transplant icon on device
- App should open without crashing ✅

### Step 4: Login

**Email:** `patient1@example.com`  
**Password:** `password123`

### Step 5: Verify Features

- ✅ Dashboard loads
- ✅ Vital Signs tab works
- ✅ Lab Values tab works
- ✅ Medications tab works
- ✅ Appointments tab works
- ✅ Profile tab works
- ✅ Logo visible
- ✅ No errors

---

## ✅ VERIFICATION CHECKLIST

- [ ] Backend deployed to Vercel
- [ ] Backend URL obtained
- [ ] Environment variables set on Vercel
- [ ] Mobile app updated with backend URL
- [ ] APK rebuilt successfully
- [ ] APK installed on device
- [ ] App opens without crashing
- [ ] Login works
- [ ] Dashboard loads
- [ ] All tabs accessible
- [ ] Logo visible in all screens
- [ ] No network errors

---

## 🆘 TROUBLESHOOTING

### Backend Deployment Fails

**Error:** "Deployment failed"

**Solution:**
```powershell
vercel login
cd backend
vercel deploy --prod
```

### App Crashes on Startup

**Error:** App closes immediately

**Solution:**
1. Check backend URL in `api_service.dart`
2. Verify format: `https://your-backend.vercel.app/api`
3. Rebuild: `flutter build apk --release`
4. Reinstall: `adb install -r app-release.apk`

### Login Doesn't Work

**Error:** "Network error" or login fails

**Solution:**
1. Check internet on device
2. Test backend: `curl https://your-backend-url/api/health`
3. Verify backend URL is correct
4. Check environment variables on Vercel

### APK Build Fails

**Error:** Build error during `flutter build apk --release`

**Solution:**
```powershell
cd dr_satya_portal
flutter clean
flutter pub get
flutter build apk --release
```

---

## 📊 BACKEND URL EXAMPLES

**Your Vercel URL:**
```
https://kims-liver-transplant.vercel.app
```

**In mobile app (with /api):**
```
https://kims-liver-transplant.vercel.app/api
```

---

## 🎯 TEST CREDENTIALS

```
Email: patient1@example.com
Password: password123
```

---

## 📁 KEY FILES

| File | Purpose |
|------|---------|
| `deploy-backend.ps1` | Automated deployment script |
| `backend/server.js` | Backend server |
| `backend/vercel.json` | Vercel configuration |
| `backend/.env` | Environment variables |
| `dr_satya_portal/lib/services/api_service.dart` | API service (UPDATE THIS) |
| `dr_satya_portal/build/app/outputs/flutter-apk/app-release.apk` | APK file |

---

## 📞 SUPPORT

**Need help?**
1. Check `DEPLOYMENT_READY.md` for overview
2. Check `COMPLETE_DEPLOYMENT_STEPS.md` for detailed steps
3. Check troubleshooting section above

---

## 🎊 AFTER DEPLOYMENT

Your app is now:
- ✅ Connected to live backend
- ✅ Production-ready
- ✅ Ready for user distribution

**You can now:**
- Share APK with users
- Upload to Google Play Store
- Deploy to production

---

## ✨ SUMMARY

| Step | Time | Status |
|------|------|--------|
| Deploy Backend | 5 min | ✅ |
| Update App | 1 min | ✅ |
| Rebuild APK | 5 min | ✅ |
| Install APK | 1 min | ✅ |
| Test | 3 min | ✅ |
| **TOTAL** | **15 min** | **✅** |

---

## 🚀 READY TO DEPLOY?

### Option 1: Automated (Recommended)
```powershell
.\deploy-backend.ps1
```

### Option 2: Manual
Follow the manual steps above

---

**🎉 Your app will be production-ready in 15 minutes!**

