# 🔧 Vercel Environment Variables Setup

## ✅ Already Configured:
- **DATABASE_URL** ✅ (Connected to Neon PostgreSQL)

## 🔧 Remaining Variables to Add:

Go to your Vercel Dashboard: https://vercel.com/bhardwajvaishnavis-projects/project-v/settings/environment-variables

### Add these environment variables:

#### 1. JWT_SECRET
```
Key: JWT_SECRET
Value: MedicalPatientMgmt2024SecureKey!@#$%^&*()_+ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789
Environment: Production
```

#### 2. NODE_ENV
```
Key: NODE_ENV
Value: production
Environment: Production
```

#### 3. FRONTEND_URL
```
Key: FRONTEND_URL
Value: https://project-qxs8fhqpd-bhardwajvaishnavis-projects.vercel.app
Environment: Production
```

#### 4. RATE_LIMIT_WINDOW_MS
```
Key: RATE_LIMIT_WINDOW_MS
Value: 900000
Environment: Production
```

#### 5. RATE_LIMIT_MAX_REQUESTS
```
Key: RATE_LIMIT_MAX_REQUESTS
Value: 100
Environment: Production
```

## 🚀 After Adding Variables:

1. **Redeploy your application**:
   ```bash
   vercel --prod
   ```

2. **Test your application**:
   - Frontend: https://project-qxs8fhqpd-bhardwajvaishnavis-projects.vercel.app
   - API Health: https://project-qxs8fhqpd-bhardwajvaishnavis-projects.vercel.app/health

## 🎯 Quick Setup Commands:

If you prefer using CLI, run these commands one by one:

```bash
# Set JWT_SECRET
vercel env add JWT_SECRET production
# Enter: MedicalPatientMgmt2024SecureKey!@#$%^&*()_+ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789

# Set NODE_ENV
vercel env add NODE_ENV production
# Enter: production

# Set FRONTEND_URL
vercel env add FRONTEND_URL production
# Enter: https://project-qxs8fhqpd-bhardwajvaishnavis-projects.vercel.app

# Set RATE_LIMIT_WINDOW_MS
vercel env add RATE_LIMIT_WINDOW_MS production
# Enter: 900000

# Set RATE_LIMIT_MAX_REQUESTS
vercel env add RATE_LIMIT_MAX_REQUESTS production
# Enter: 100
```

## ✅ Database Status:
- **Schema**: ✅ Already pushed to Neon
- **Tables**: ✅ All medical management tables created
- **Connection**: ✅ Verified and working

Your database includes tables for:
- Users (authentication)
- Patients (patient records)
- Investigations (lab tests)
- Treatments (medical treatments)
- Surgeries (surgical procedures)
- Liver Transplants (specialized procedures)
- Follow-ups (appointments)
- Files (document uploads)

## 🎉 After Configuration:

Your Medical Patient Management System will have:
- ✅ **Secure Authentication** with JWT
- ✅ **Patient Registration** and management
- ✅ **Medical Records** tracking
- ✅ **Investigation Management** 
- ✅ **Treatment Planning**
- ✅ **Surgery Records**
- ✅ **Follow-up Scheduling**
- ✅ **File Upload** capabilities
- ✅ **Rate Limiting** for security
- ✅ **Production Database** with Neon
