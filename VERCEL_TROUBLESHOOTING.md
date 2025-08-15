# 🚨 Vercel Deployment Troubleshooting Guide

## Common Deployment Errors & Solutions

### 🔧 **Error 1: Build Failed - Module Not Found**

**Error Message:**
```
Error: Cannot find module 'xyz'
```

**Solution:**
```bash
# In backend directory
cd backend
npm install
npm audit fix

# In frontend directory  
cd frontend
npm install
npm audit fix
```

### 🔧 **Error 2: Database Connection Failed**

**Error Message:**
```
Error: getaddrinfo ENOTFOUND
```

**Solution:**
1. **Check DATABASE_URL format:**
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_MNradm8kS6oX@ep-weathered-wind-adtoyz47-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```

2. **Ensure NeonDB is active:**
   - Go to [neon.tech](https://neon.tech)
   - Check if your database is running
   - Copy the exact connection string

### 🔧 **Error 3: CORS Policy Error**

**Error Message:**
```
Access to fetch at 'backend-url' from origin 'frontend-url' has been blocked by CORS policy
```

**Solution:**
1. **Update backend environment variables:**
   ```
   FRONTEND_URL=https://your-actual-frontend-domain.vercel.app
   ```

2. **Redeploy backend after updating FRONTEND_URL**

### 🔧 **Error 4: API Routes Not Working**

**Error Message:**
```
404 - This page could not be found
```

**Solution:**
1. **Check backend vercel.json routes:**
   ```json
   {
     "routes": [
       {
         "src": "/health",
         "dest": "/server.js"
       },
       {
         "src": "/api/(.*)",
         "dest": "/server.js"
       }
     ]
   }
   ```

2. **Test health endpoint:** `https://your-backend.vercel.app/health`

### 🔧 **Error 5: Environment Variables Not Loading**

**Error Message:**
```
process.env.VARIABLE_NAME is undefined
```

**Solution:**
1. **Add variables in Vercel Dashboard:**
   - Go to Project Settings → Environment Variables
   - Add each variable individually
   - Redeploy after adding variables

2. **Check variable names match exactly**

### 🔧 **Error 6: Frontend Build Timeout**

**Error Message:**
```
Error: Command "npm run build" timed out
```

**Solution:**
1. **Optimize build in vercel.json:**
   ```json
   {
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "build"
         }
       }
     ]
   }
   ```

2. **Check for large dependencies and optimize**

### 🔧 **Error 7: Prisma Generation Failed**

**Error Message:**
```
Error: Prisma schema not found
```

**Solution:**
1. **Add to backend package.json:**
   ```json
   {
     "scripts": {
       "vercel-build": "npm install && npx prisma generate"
     }
   }
   ```

2. **Ensure prisma folder is included in deployment**

## 🎯 **STEP-BY-STEP DEPLOYMENT PROCESS**

### **Phase 1: Backend Deployment**

1. **Go to [vercel.com/dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import from GitHub**
4. **Configure Project:**
   - **Root Directory:** `backend`
   - **Framework Preset:** Other
   - **Build Command:** `npm run vercel-build`
   - **Output Directory:** (leave empty)
   - **Install Command:** `npm install`

5. **Add Environment Variables:**
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_MNradm8kS6oX@ep-weathered-wind-adtoyz47-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production_2024
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

6. **Deploy and Test:**
   - Visit: `https://your-backend.vercel.app/health`
   - Should return: `{"status":"OK","environment":"production"}`

### **Phase 2: Frontend Deployment**

1. **Create New Vercel Project**
2. **Import Same GitHub Repository**
3. **Configure Project:**
   - **Root Directory:** `frontend`
   - **Framework Preset:** Create React App
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`

4. **Add Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-backend-domain.vercel.app
   REACT_APP_API_BASE_URL=https://your-backend-domain.vercel.app/api
   REACT_APP_NODE_ENV=production
   ```

5. **Deploy and Test:**
   - Visit: `https://your-frontend.vercel.app`
   - Should show login page

### **Phase 3: Connect Services**

1. **Update Backend FRONTEND_URL:**
   - Go to backend project settings
   - Update `FRONTEND_URL` with actual frontend domain
   - Redeploy backend

2. **Test Integration:**
   - Login with: `admin@medical.com` / `admin123`
   - Test patient registration
   - Test investigation forms

## 🆘 **Emergency Fixes**

### **If Backend Won't Start:**
```bash
# Check logs in Vercel dashboard
# Common fix: Update package.json
{
  "scripts": {
    "start": "node server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### **If Frontend Won't Build:**
```bash
# Remove unused imports causing warnings
# Check for syntax errors in components
# Ensure all dependencies are in package.json
```

### **If Database Connection Fails:**
```bash
# Test connection string locally first
# Ensure NeonDB allows connections
# Check for typos in DATABASE_URL
```

## 🎉 **Success Indicators**

✅ **Backend Health Check:** `GET /health` returns 200
✅ **Frontend Loads:** Login page appears
✅ **Authentication Works:** Can login with demo credentials
✅ **API Calls Work:** Can fetch patients, create investigations
✅ **CORS Resolved:** No console errors about blocked requests

## 📞 **Still Having Issues?**

1. **Check Vercel Function Logs**
2. **Verify Environment Variables**
3. **Test API endpoints with Postman**
4. **Check browser console for errors**
5. **Ensure database is accessible**

**Your Medical Patient Management System should now be successfully deployed on Vercel!** 🏥✨
