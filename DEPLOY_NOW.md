# 🚀 DEPLOY BACKEND TO VERCEL - STEP BY STEP

## ⏱️ TOTAL TIME: 10 MINUTES

---

## 📋 PREREQUISITES

✅ Vercel account (create at https://vercel.com if needed)  
✅ Backend code ready in `backend/` folder  
✅ Environment variables configured in `backend/.env`  

---

## 🚀 STEP 1: INSTALL VERCEL CLI (2 minutes)

Open PowerShell and run:

```powershell
npm install -g vercel
```

**Expected output:**
```
added X packages
```

---

## 🚀 STEP 2: LOGIN TO VERCEL (2 minutes)

Run:

```powershell
vercel login
```

**What happens:**
1. Browser opens automatically
2. Click "Continue" to authorize
3. Return to PowerShell (it will confirm login)

---

## 🚀 STEP 3: DEPLOY BACKEND (3 minutes)

Navigate to backend folder and deploy:

```powershell
cd backend
vercel deploy --prod
```

**During deployment:**
- Vercel will ask a few questions
- Answer as follows:
  - "Set up and deploy?" → **y** (yes)
  - "Which scope?" → Select your account
  - "Link to existing project?" → **n** (no)
  - "Project name?" → Press Enter (default)
  - "Detected location of code?" → Press Enter (default)

**Expected output:**
```
✓ Production: https://your-project-name.vercel.app
```

**👉 COPY THIS URL - YOU'LL NEED IT NEXT!**

---

## 🚀 STEP 4: SET ENVIRONMENT VARIABLES (2 minutes)

Go to Vercel dashboard:
1. Open: https://vercel.com/dashboard
2. Click your project
3. Go to "Settings" → "Environment Variables"
4. Add these variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_MNradm8kS6oX@ep-weathered-wind-adtoyz47-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` |
| `JWT_SECRET` | `medical_patient_management_super_secret_key_2024` |
| `JWT_EXPIRES_IN` | `7d` |
| `NODE_ENV` | `production` |

5. Click "Save"
6. Redeploy: Click "Deployments" → Latest → "Redeploy"

---

## ✅ VERIFICATION (1 minute)

Test your backend is working:

```powershell
curl https://your-project-name.vercel.app/api/health
```

**Expected response:**
```json
{"status":"ok"}
```

---

## 📝 NEXT STEPS

1. **Copy your backend URL:** `https://your-project-name.vercel.app`
2. **Update mobile app** with this URL (see next section)
3. **Rebuild APK**
4. **Test on device**

---

## 🔗 UPDATE MOBILE APP WITH BACKEND URL

### Step 1: Edit API Service

**File:** `dr_satya_portal/lib/services/api_service.dart`

**Find line 8:**
```dart
static const String baseUrl = 'http://localhost:5000/api';
```

**Replace with:**
```dart
static const String baseUrl = 'https://your-project-name.vercel.app/api';
```

**Example:**
```dart
static const String baseUrl = 'https://kims-liver-transplant.vercel.app/api';
```

### Step 2: Rebuild APK

```powershell
cd dr_satya_portal
flutter clean
flutter pub get
flutter build apk --release
```

### Step 3: Install APK

```powershell
adb install -r dr_satya_portal/build/app/outputs/flutter-apk/app-release.apk
```

### Step 4: Test

- Open app on device
- Login: `patient1@example.com` / `password123`
- Verify all features work

---

## 🆘 TROUBLESHOOTING

### Backend URL not working
- Check URL is correct
- Verify environment variables are set
- Redeploy: `vercel deploy --prod`

### App still crashes
- Check backend URL in `api_service.dart`
- Rebuild APK: `flutter build apk --release`
- Reinstall: `adb install -r app-release.apk`

### Login fails
- Verify backend URL is correct
- Test: `curl https://your-backend-url/api/health`
- Check internet on device

---

## ✅ DEPLOYMENT COMPLETE!

Your backend is now live on Vercel and your mobile app is connected!

🎉 **Your app is production-ready!**

