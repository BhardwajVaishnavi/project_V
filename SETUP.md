# Medical Patient Management System - Setup Guide

This guide will help you set up the complete Medical Patient Management System with React frontend, Node.js backend, PostgreSQL database (NeonDB), and AWS S3 file storage.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- NeonDB account (PostgreSQL database)
- AWS account (for S3 file storage)
- Git

## Quick Start

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd medical-patient-management

# Install all dependencies (root, backend, and frontend)
npm run install:all
```

### 2. Environment Configuration

#### Backend Environment (.env)
```bash
cd backend
cp .env.example .env
```

Update `backend/.env` with your actual credentials:
```env
# Database Configuration
DATABASE_URL="postgresql://neondb_owner:npg_MNradm8kS6oX@ep-weathered-wind-adtoyz47-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=7d

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=medical-patient-files

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

#### Frontend Environment (.env)
```bash
cd frontend
```

Update `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=Medical Patient Management System
REACT_APP_VERSION=1.0.0
```

### 3. Database Setup

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Push database schema to NeonDB
npx prisma db push

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### 4. AWS S3 Setup

1. **Create S3 Bucket:**
   - Log into AWS Console
   - Go to S3 service
   - Create a new bucket named `medical-patient-files` (or your preferred name)
   - Configure bucket permissions for your application

2. **Create IAM User:**
   - Go to IAM service
   - Create a new user with programmatic access
   - Attach policy with S3 permissions:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:GetObject",
           "s3:PutObject",
           "s3:DeleteObject"
         ],
         "Resource": "arn:aws:s3:::medical-patient-files/*"
       }
     ]
   }
   ```
   - Save the Access Key ID and Secret Access Key

### 5. Start the Application

```bash
# Start both backend and frontend (from root directory)
npm run dev

# Or start individually:
# Backend only
npm run server:dev

# Frontend only
npm run client:dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/health

## Default Login Credentials

For testing purposes, you can create a user account using the registration endpoint or use these demo credentials:

```
Email: doctor@medical.com
Password: password123
```

To create the demo user, you can use the registration API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@medical.com",
    "password": "password123",
    "firstName": "Dr. John",
    "lastName": "Doe",
    "role": "DOCTOR"
  }'
```

## Project Structure

```
medical-patient-management/
├── frontend/                 # React application
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store and slices
│   │   ├── services/       # API services
│   │   ├── theme/          # Material-UI theme
│   │   └── utils/          # Utility functions
├── backend/                 # Node.js API server
│   ├── prisma/             # Database schema
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   └── services/       # Business logic
└── docs/                   # Documentation
```

## Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run install:all` - Install all dependencies
- `npm run setup` - Complete setup including database

### Backend
- `npm run dev` - Start backend in development mode
- `npm run start` - Start backend in production mode
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio

### Frontend
- `npm start` - Start frontend development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Features Implemented

### Phase 1 (Current)
- ✅ Complete project structure and setup
- ✅ Authentication system with JWT
- ✅ Comprehensive database schema
- ✅ Backend API with all endpoints
- ✅ React frontend with Material-UI
- ✅ Redux state management
- ✅ File upload system (AWS S3)
- ✅ Responsive design
- ✅ Patient management (basic CRUD)
- ✅ Dashboard with statistics

### Phase 2 (To be implemented)
- 🔄 Complete patient registration form
- 🔄 Investigation management system
- 🔄 Treatment workflow
- 🔄 Surgery management
- 🔄 Liver transplant evaluation form
- 🔄 Follow-up scheduling
- 🔄 Document management
- 🔄 Reports and analytics

## Troubleshooting

### Common Issues

1. **Database Connection Error:**
   - Verify NeonDB URL is correct
   - Check if database is accessible
   - Run `npx prisma db push` to ensure schema is up to date

2. **AWS S3 Upload Errors:**
   - Verify AWS credentials are correct
   - Check S3 bucket permissions
   - Ensure bucket name matches configuration

3. **Frontend Build Errors:**
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
   - Check for TypeScript errors if using TypeScript

4. **CORS Issues:**
   - Verify frontend URL is in backend CORS configuration
   - Check if both servers are running on correct ports

### Getting Help

1. Check the logs in terminal for specific error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check database connectivity with Prisma Studio

## Next Steps

1. **Complete the forms:** Implement the comprehensive patient registration and liver transplant evaluation forms
2. **Add validation:** Implement client and server-side validation
3. **Testing:** Add unit and integration tests
4. **Deployment:** Set up production deployment with proper security
5. **Documentation:** Add API documentation with Swagger

## Security Considerations

- Change JWT secret in production
- Use environment variables for all sensitive data
- Implement rate limiting (already configured)
- Use HTTPS in production
- Regularly update dependencies
- Implement proper error handling
- Add input sanitization

## Performance Optimization

- Implement pagination for large datasets
- Add caching for frequently accessed data
- Optimize database queries
- Implement lazy loading for components
- Use CDN for static assets
- Compress images and files

This setup provides a solid foundation for a comprehensive medical patient management system. The modular architecture allows for easy extension and maintenance.
