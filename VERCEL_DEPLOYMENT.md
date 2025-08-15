# 🚀 Vercel Deployment Guide - Medical Patient Management

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Database**: PostgreSQL database (recommend [Neon](https://neon.tech) or [Supabase](https://supabase.com))
3. **Git Repository**: Push your code to GitHub/GitLab/Bitbucket

## 🎯 Quick Deployment (Automated)

### Option 1: One-Command Deployment
```bash
node deploy-vercel.js
```

### Option 2: Manual Deployment
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel --prod
```

## 🔧 Environment Variables Setup

After deployment, add these environment variables in Vercel Dashboard:

### Required Variables:
```env
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
```

### Optional Variables:
```env
FRONTEND_URL=https://your-app.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📊 Database Setup Options

### Option 1: Neon (Recommended)
1. Go to [neon.tech](https://neon.tech)
2. Create free account
3. Create new project
4. Copy connection string
5. Add to Vercel environment variables

### Option 2: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > Database
4. Copy connection string
5. Add to Vercel environment variables

### Option 3: Railway
1. Go to [railway.app](https://railway.app)
2. Create PostgreSQL database
3. Copy connection string
4. Add to Vercel environment variables

## 🌐 Deployment Steps

### Step 1: Prepare Code
```bash
# Ensure all files are ready
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Deploy via Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Configure build settings:
   - **Framework Preset**: Other
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `client/build`
   - **Install Command**: `npm install && cd client && npm install --legacy-peer-deps`

### Step 3: Configure Environment Variables
1. Go to Project Settings > Environment Variables
2. Add all required variables
3. Redeploy if needed

### Step 4: Set up Database
```bash
# After deployment, run database setup
npx prisma db push
```

## 🔍 Troubleshooting

### Build Errors
```bash
# If build fails due to Material-UI issues:
cd client
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Database Connection Issues
- Ensure DATABASE_URL includes `?sslmode=require`
- Check if database allows external connections
- Verify connection string format

### CORS Issues
- Ensure FRONTEND_URL matches your Vercel domain
- Check allowed origins in server.js

## 📱 Post-Deployment

### Verify Deployment
1. **Frontend**: Visit your Vercel URL
2. **API**: Test `https://your-app.vercel.app/health`
3. **Database**: Check if data loads correctly

### Set up Custom Domain (Optional)
1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS records

## 🎉 Success!

Your Medical Patient Management System should now be live at:
`https://your-project-name.vercel.app`

### Features Available:
- ✅ Patient registration and management
- ✅ Medical records tracking
- ✅ Investigation management
- ✅ Treatment planning
- ✅ Surgery records
- ✅ Follow-up scheduling
- ✅ User authentication
- ✅ File uploads
- ✅ Responsive design

## 🔧 Maintenance

### Update Deployment
```bash
# Make changes and push to Git
git add .
git commit -m "Update application"
git push origin main
# Vercel will automatically redeploy
```

### Monitor Performance
- Check Vercel Analytics
- Monitor database performance
- Review error logs in Vercel dashboard

---

**🎊 Your Medical Patient Management System is now live on Vercel!**
