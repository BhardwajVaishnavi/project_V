# 🚀 QUICK DEPLOYMENT - BACKEND TO VERCEL

## ⚡ FASTEST WAY TO DEPLOY (5 minutes)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
- Opens browser to login
- Authorize the CLI

### Step 3: Deploy Backend
```bash
cd backend
vercel deploy --prod
```

### Step 4: Follow Prompts
```
? Set up and deploy "G:\project_V\backend"? [Y/n] → Y
? Which scope do you want to deploy to? → Your Account
? Link to existing project? [y/N] → N
? What's your project's name? → kims-liver-transplant-backend
? In which directory is your code located? → ./
? Want to modify these settings before deploying? [y/N] → N
```

### Step 5: Wait for Deployment
- Takes 2-3 minutes
- You'll see: ✓ Production: https://kims-liver-transplant-backend.vercel.app

---

## 📋 WHAT YOU'LL GET

After deployment, you'll have:

**Backend URL:**
```
https://kims-liver-transplant-backend.vercel.app
```

**API Base URL:**
```
https://kims-liver-transplant-backend.vercel.app/api
```

---

## 🔄 UPDATE MOBILE APP

### 1. Open File:
```
dr_satya_portal/lib/services/api_service.dart
```

### 2. Find Line 8:
```dart
static const String baseUrl = 'http://localhost:5000/api';
```

### 3. Replace with:
```dart
static const String baseUrl = 'https://kims-liver-transplant-backend.vercel.app/api';
```

### 4. Save File

---

## 🔨 REBUILD APK

```bash
cd dr_satya_portal
flutter clean
flutter pub get
flutter build apk --release
```

**New APK:** `dr_satya_portal/build/app/outputs/flutter-apk/app-release.apk`

---

## 📱 INSTALL & TEST

```bash
adb install -r dr_satya_portal/build/app/outputs/flutter-apk/app-release.apk
```

**Test Login:**
- Email: `patient1@example.com`
- Password: `password123`

---

## ✅ VERIFICATION

### Test Backend is Running:
```bash
curl https://kims-liver-transplant-backend.vercel.app/api/health
```

### Test Login API:
```bash
curl -X POST https://kims-liver-transplant-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"patient1@example.com","password":"password123"}'
```

---

## 🎯 SUMMARY

| Step | Command | Time |
|------|---------|------|
| 1 | `npm install -g vercel` | 1 min |
| 2 | `vercel login` | 1 min |
| 3 | `cd backend && vercel deploy --prod` | 3 min |
| 4 | Update `api_service.dart` | 1 min |
| 5 | `flutter build apk --release` | 5 min |
| 6 | `adb install -r app-release.apk` | 1 min |

**Total Time: ~12 minutes**

---

## 🎊 DONE!

Your KIMS Liver Transplant app is now:
- ✅ Backend deployed to Vercel
- ✅ Mobile app connected to backend
- ✅ APK ready for distribution
- ✅ Production ready!

**Start with Step 1 above!** 🚀

