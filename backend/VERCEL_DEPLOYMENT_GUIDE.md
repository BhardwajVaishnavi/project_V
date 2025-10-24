# Vercel Deployment Guide

## ⚠️ CRITICAL: Environment Variables Must Be Set in Vercel Dashboard

The backend requires environment variables to be configured in Vercel. Follow these steps:

### Step 1: Go to Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Select your project: `backend-chi-bay-86` (or your project name)
3. Click on "Settings"

### Step 2: Add Environment Variables
Click on "Environment Variables" and add the following:

#### Required Variables:

```
DATABASE_URL=postgresql://neondb_owner:npg_MNradm8kS6oX@ep-weathered-wind-adtoyz47-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET=medical_patient_management_super_secret_key_2024

JWT_EXPIRES_IN=7d

NODE_ENV=production

PORT=3000
```

#### Optional Variables (for file uploads):

```
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=medical-patient-files
```

### Step 3: Redeploy
After adding environment variables:
1. Go to "Deployments" tab
2. Click on the latest deployment
3. Click "Redeploy" button
4. Wait for deployment to complete

### Step 4: Verify Deployment
Test the health endpoint:
```
curl https://backend-chi-bay-86.vercel.app/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-10-24T...",
  "uptime": 123.45,
  "environment": "production",
  "database": "Connected"
}
```

## Troubleshooting

### 500 Error - Function Invocation Failed
**Cause:** Missing environment variables
**Solution:** Add all required environment variables in Vercel dashboard

### Database Connection Error
**Cause:** DATABASE_URL not set or incorrect
**Solution:** Verify DATABASE_URL is correct in Vercel environment variables

### JWT Errors
**Cause:** JWT_SECRET not set
**Solution:** Add JWT_SECRET to environment variables

## Local Testing Before Deployment

```bash
# Set environment variables locally
$env:DATABASE_URL="postgresql://..."
$env:JWT_SECRET="medical_patient_management_super_secret_key_2024"
$env:NODE_ENV="production"

# Start server
npm start

# Test health endpoint
curl http://localhost:5000/health
```

## Deployment Command

```bash
# Deploy to Vercel
vercel deploy --prod

# Or use Vercel CLI
vercel
```

## Important Notes

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Always use Vercel dashboard** for environment variables in production
3. **Test locally first** before deploying to production
4. **Monitor Vercel logs** for any errors after deployment
5. **Database must be accessible** from Vercel's servers (check firewall rules)

## Vercel Project URL
https://backend-chi-bay-86.vercel.app

## API Endpoints
- Health Check: https://backend-chi-bay-86.vercel.app/health
- Auth: https://backend-chi-bay-86.vercel.app/api/auth
- Patients: https://backend-chi-bay-86.vercel.app/api/patients
- Investigations: https://backend-chi-bay-86.vercel.app/api/investigations
- Treatments: https://backend-chi-bay-86.vercel.app/api/treatments
- Surgery: https://backend-chi-bay-86.vercel.app/api/surgery
- Liver Transplant: https://backend-chi-bay-86.vercel.app/api/liver-transplant
- Follow-up: https://backend-chi-bay-86.vercel.app/api/follow-up
- Camps: https://backend-chi-bay-86.vercel.app/api/camps

