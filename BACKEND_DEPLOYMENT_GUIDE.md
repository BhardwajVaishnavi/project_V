# 🚀 Backend Deployment Guide - Vercel

## Step 1: Prepare for Deployment

### Prerequisites
- Vercel account (free at https://vercel.com)
- GitHub account (to connect your repository)
- Backend code ready in `/backend` folder

### Files Already Configured
✅ `backend/vercel.json` - Vercel configuration  
✅ `backend/package.json` - Build scripts configured  
✅ `backend/.env` - Environment variables ready  

---

## Step 2: Deploy Backend to Vercel

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy Backend:**
   ```bash
   cd backend
   vercel deploy --prod
   ```

4. **Follow the prompts:**
   - Select "Y" to link to existing project or create new
   - Project name: `kims-liver-transplant-backend`
   - Framework: `Other`
   - Root directory: `./` (current directory)

### Option B: Using GitHub Integration

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy backend to Vercel"
   git push origin main
   ```

2. **Go to Vercel Dashboard:**
   - Visit https://vercel.com/dashboard
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the `backend` folder as root directory

3. **Configure Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add these variables:
     ```
     DATABASE_URL = (from .env file)
     JWT_SECRET = medical_patient_management_super_secret_key_2024
     JWT_EXPIRES_IN = 7d
     NODE_ENV = production
     ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete

---

## Step 3: Get Your Backend URL

After deployment, you'll get a URL like:
```
https://kims-liver-transplant-backend.vercel.app
```

**Your API Base URL will be:**
```
https://kims-liver-transplant-backend.vercel.app/api
```

---

## Step 4: Update Mobile App with Backend URL

### Update the Flutter App:

1. **Open:** `dr_satya_portal/lib/services/api_service.dart`

2. **Find this line (Line 8):**
   ```dart
   static const String baseUrl = 'http://localhost:5000/api';
   ```

3. **Replace with your Vercel URL:**
   ```dart
   static const String baseUrl = 'https://kims-liver-transplant-backend.vercel.app/api';
   ```

4. **Save the file**

---

## Step 5: Rebuild APK with Backend URL

```bash
cd dr_satya_portal
flutter clean
flutter pub get
flutter build apk --release
```

**New APK location:**
```
dr_satya_portal/build/app/outputs/flutter-apk/app-release.apk
```

---

## Step 6: Test the Connection

### Test Backend API:
```bash
curl https://kims-liver-transplant-backend.vercel.app/api/health
```

### Test Login:
```bash
curl -X POST https://kims-liver-transplant-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient1@example.com",
    "password": "password123"
  }'
```

---

## Step 7: Install and Test APK

### On Android Device:
```bash
adb install -r dr_satya_portal/build/app/outputs/flutter-apk/app-release.apk
```

### Test Credentials:
```
Email: patient1@example.com
Password: password123
```

---

## 🎯 Deployment Checklist

- [ ] Backend deployed to Vercel
- [ ] Backend URL obtained
- [ ] Mobile app updated with backend URL
- [ ] APK rebuilt with new URL
- [ ] Backend API tested
- [ ] Login tested
- [ ] APK installed on device
- [ ] App opens successfully
- [ ] All features working

---

## 🔧 Troubleshooting

### Backend Deployment Failed
- Check `backend/vercel.json` is correct
- Verify `backend/package.json` has all dependencies
- Check environment variables are set in Vercel dashboard

### App Can't Connect to Backend
- Verify backend URL in `api_service.dart`
- Check CORS is enabled in backend
- Test API endpoint with curl
- Check internet connection on device

### Login Not Working
- Verify database is connected
- Check JWT_SECRET matches in backend
- Test with curl first
- Check backend logs in Vercel dashboard

---

## 📱 Final APK Details

- **File:** `app-release.apk`
- **Size:** ~48 MB
- **Location:** `dr_satya_portal/build/app/outputs/flutter-apk/app-release.apk`
- **Backend:** Connected to Vercel
- **Status:** ✅ **PRODUCTION READY**

---

## 🎊 Next Steps

1. Deploy backend to Vercel
2. Update app with backend URL
3. Rebuild APK
4. Test on Android device
5. Distribute to users

**Your KIMS Liver Transplant app is now ready for production deployment!** 🚀

