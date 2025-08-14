# Medical Patient Management System - Vercel Deployment Guide

## 🚀 Complete Deployment Instructions

This guide will help you deploy both the backend and frontend of the Medical Patient Management System to Vercel.

## 📋 Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository** - Push your code to GitHub
3. **NeonDB Account** - For PostgreSQL database (already configured)

## 🗄️ Database Setup

### Option 1: Use Existing NeonDB (Recommended)
The project is already configured with NeonDB. The connection string is in `.env.example`.

### Option 2: Create New NeonDB Instance
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Update the `DATABASE_URL` in environment variables

## 🔧 Backend Deployment

### Step 1: Deploy Backend to Vercel

1. **Fork/Clone the Repository**
   ```bash
   git clone <your-repo-url>
   cd medical-patient-management
   ```

2. **Deploy Backend**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - **Set Root Directory to `backend`**
   - Configure environment variables (see below)

### Step 2: Backend Environment Variables

In Vercel dashboard, add these environment variables:

```env
DATABASE_URL=postgresql://neondb_owner:npg_MNradm8kS6oX@ep-weathered-wind-adtoyz47-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET=your_super_secret_jwt_key_here_change_in_production_2024

NODE_ENV=production

FRONTEND_URL=https://your-frontend-domain.vercel.app

PORT=5000

# Optional: AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=medical-patient-files

# Optional: Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 3: Backend Build Settings

In Vercel project settings:
- **Build Command:** `npm run build`
- **Output Directory:** Leave empty
- **Install Command:** `npm install`
- **Development Command:** `npm run dev`

## 🎨 Frontend Deployment

### Step 1: Deploy Frontend to Vercel

1. **Create New Vercel Project**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import the same GitHub repository
   - **Set Root Directory to `frontend`**
   - Configure environment variables (see below)

### Step 2: Frontend Environment Variables

In Vercel dashboard, add these environment variables:

```env
REACT_APP_API_URL=https://your-backend-domain.vercel.app

REACT_APP_API_BASE_URL=https://your-backend-domain.vercel.app/api

REACT_APP_NODE_ENV=production

REACT_APP_APP_NAME=Medical Patient Management System

REACT_APP_VERSION=1.0.0
```

### Step 3: Frontend Build Settings

In Vercel project settings:
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`
- **Development Command:** `npm start`

## 🔗 Connect Frontend and Backend

### Step 1: Update Backend CORS

After deploying frontend, update the backend environment variable:
```env
FRONTEND_URL=https://your-actual-frontend-domain.vercel.app
```

### Step 2: Update Frontend API URL

After deploying backend, update the frontend environment variable:
```env
REACT_APP_API_URL=https://your-actual-backend-domain.vercel.app
REACT_APP_API_BASE_URL=https://your-actual-backend-domain.vercel.app/api
```

## 🧪 Testing Deployment

### Backend Health Check
Visit: `https://your-backend-domain.vercel.app/health`

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "production",
  "database": "Connected"
}
```

### Frontend Access
Visit: `https://your-frontend-domain.vercel.app`

You should see the login page of the Medical Patient Management System.

## 🔐 Default Login Credentials

```
Email: admin@medical.com
Password: admin123
```

## 📊 Database Migration

The database will be automatically set up when the backend starts. The Prisma schema will create all necessary tables.

## 🚨 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Ensure `FRONTEND_URL` in backend matches your frontend domain
   - Check that both domains are using HTTPS

2. **Database Connection Issues**
   - Verify `DATABASE_URL` is correct
   - Ensure NeonDB instance is active

3. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Verify Node.js version compatibility

4. **API Not Found (404)**
   - Ensure backend `vercel.json` routes are configured correctly
   - Check that API endpoints start with `/api/`

### Debug Steps:

1. **Check Vercel Function Logs**
   - Go to Vercel dashboard → Project → Functions tab
   - Check logs for errors

2. **Test API Endpoints**
   - Use Postman or curl to test backend endpoints
   - Verify authentication is working

3. **Check Browser Console**
   - Open browser dev tools
   - Look for network errors or CORS issues

## 🎉 Success!

Once deployed, you'll have:
- ✅ Backend API running on Vercel
- ✅ Frontend React app on Vercel  
- ✅ PostgreSQL database on NeonDB
- ✅ Complete medical management system

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test database connectivity
4. Check CORS configuration

Your Medical Patient Management System is now live and ready for use! 🏥✨
