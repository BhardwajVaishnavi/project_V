# 🚀 COMPLETE DEPLOYMENT GUIDE - KIMS LIVER TRANSPLANT

## ⏱️ TOTAL TIME: 15 MINUTES

---

## 📋 WHAT YOU'LL DO

1. ✅ Deploy backend to Vercel (5 min)
2. ✅ Update mobile app with backend URL (1 min)
3. ✅ Rebuild APK (5 min)
4. ✅ Install APK on device (1 min)
5. ✅ Test app (3 min)

---

## 🚀 OPTION A: AUTOMATED DEPLOYMENT (RECOMMENDED)

### Run the deployment script:

```powershell
.\deploy-backend.ps1
```

**What it does:**
- ✅ Installs Vercel CLI
- ✅ Deploys backend to Vercel
- ✅ Updates mobile app with backend URL
- ✅ Rebuilds APK
- ✅ Verifies everything

**That's it! Skip to "Install APK" section below.**

---

## 🚀 OPTION B: MANUAL DEPLOYMENT

### Step 1: Install Vercel CLI (2 min)

```powershell
npm install -g vercel
```

### Step 2: Login to Vercel (2 min)

```powershell
vercel login
```

Browser will open. Click "Continue" to authorize.

### Step 3: Deploy Backend (3 min)

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

**Copy the URL from output:**
```
✓ Production: https://your-project-name.vercel.app
```

### Step 4: Set Environment Variables (2 min)

1. Go to: https://vercel.com/dashboard
2. Click your project
3. Settings → Environment Variables
4. Add these:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_MNradm8kS6oX@ep-weathered-wind-adtoyz47-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` |
| `JWT_SECRET` | `medical_patient_management_super_secret_key_2024` |
| `JWT_EXPIRES_IN` | `7d` |
| `NODE_ENV` | `production` |

5. Click "Save"
6. Redeploy: Deployments → Latest → Redeploy

### Step 5: Update Mobile App (1 min)

**File:** `dr_satya_portal/lib/services/api_service.dart`

**Find line 8:**
```dart
static const String baseUrl = 'http://localhost:5000/api';
```

**Replace with:**
```dart
static const String baseUrl = 'https://your-project-name.vercel.app/api';
```

### Step 6: Rebuild APK (5 min)

```powershell
cd dr_satya_portal
flutter clean
flutter pub get
flutter build apk --release
```

---

## 📱 INSTALL APK ON DEVICE

### Connect Android Device

```powershell
adb devices
```

You should see your device listed.

### Install APK

```powershell
adb install -r dr_satya_portal/build/app/outputs/flutter-apk/app-release.apk
```

**Expected output:**
```
Success
```

---

## 🧪 TEST THE APP

### 1. Open App on Device

- Tap the KIMS Liver Transplant app icon
- App should open without crashing ✅

### 2. Login

**Credentials:**
```
Email: patient1@example.com
Password: password123
```

### 3. Verify Features

- ✅ Dashboard loads
- ✅ Vital Signs tab works
- ✅ Lab Values tab works
- ✅ Medications tab works
- ✅ Appointments tab works
- ✅ Profile tab works
- ✅ Logo visible in all screens
- ✅ No errors or crashes

---

## ✅ VERIFICATION CHECKLIST

- [ ] Backend deployed to Vercel
- [ ] Backend URL obtained
- [ ] Environment variables set
- [ ] Mobile app updated with backend URL
- [ ] APK rebuilt
- [ ] APK installed on device
- [ ] App opens without crashing
- [ ] Login works
- [ ] Dashboard loads
- [ ] All tabs accessible
- [ ] Logo visible
- [ ] No network errors

---

## 🆘 TROUBLESHOOTING

### Backend Deployment Fails

**Problem:** Vercel deployment error

**Solution:**
```powershell
vercel login
cd backend
vercel deploy --prod
```

### App Crashes on Startup

**Problem:** App crashes immediately

**Solution:**
1. Check backend URL in `api_service.dart`
2. Verify URL format: `https://your-backend.vercel.app/api`
3. Rebuild: `flutter build apk --release`
4. Reinstall: `adb install -r app-release.apk`

### Login Fails

**Problem:** Login button doesn't work

**Solution:**
1. Check internet on device
2. Test backend: `curl https://your-backend-url/api/health`
3. Verify backend URL is correct
4. Check environment variables on Vercel

### Network Errors

**Problem:** "Network error" message

**Solution:**
1. Check device internet connection
2. Verify backend URL is correct
3. Test: `curl https://your-backend-url/api/health`
4. Redeploy backend: `vercel deploy --prod`

---

## 📊 BACKEND URL EXAMPLES

**Your backend URL will look like:**
```
https://kims-liver-transplant.vercel.app
```

**In the app, it becomes:**
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

## 📞 SUPPORT

**Need help?**
1. Check `DEPLOY_NOW.md` for quick reference
2. Check `deploy-backend.ps1` for automated deployment
3. Check troubleshooting section above

---

## ✨ WHAT'S NEXT

After successful deployment:

1. ✅ Backend is live on Vercel
2. ✅ Mobile app is connected
3. ✅ APK is production-ready
4. ✅ Ready for user distribution

**You can now:**
- Share APK with users
- Upload to Google Play Store
- Deploy to production

---

## 🎊 DEPLOYMENT COMPLETE!

Your KIMS Liver Transplant application is now **PRODUCTION READY**! 🚀

**Estimated time: 15 minutes**

---

**Next Step:** Run the deployment script or follow manual steps above!

