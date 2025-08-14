# Medical Patient Management System - Deployment Guide

This guide covers deployment options for the Medical Patient Management System in production environments.

## Production Environment Setup

### Prerequisites
- Domain name with SSL certificate
- Production database (NeonDB or other PostgreSQL)
- AWS account for S3 storage
- Server or cloud hosting platform

## Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend Deployment (Vercel)

1. **Prepare for deployment:**
```bash
cd frontend
npm run build
```

2. **Deploy to Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

3. **Environment Variables on Vercel:**
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_NAME=Medical Patient Management System
REACT_APP_VERSION=1.0.0
```

#### Backend Deployment (Railway)

1. **Create railway.json:**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health"
  }
}
```

2. **Environment Variables on Railway:**
```env
DATABASE_URL=your_production_database_url
JWT_SECRET=your_production_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
S3_BUCKET_NAME=your_s3_bucket
NODE_ENV=production
PORT=5000
```

### Option 2: Docker Deployment

#### Create Dockerfiles

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "start"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Docker Compose:**
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=medical_db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Option 3: AWS Deployment

#### Backend (AWS Elastic Beanstalk)

1. **Create .ebextensions/01_nginx.config:**
```yaml
files:
  "/etc/nginx/conf.d/proxy.conf":
    mode: "000644"
    owner: root
    group: root
    content: |
      client_max_body_size 50M;
```

2. **Deploy:**
```bash
# Install EB CLI
pip install awsebcli

# Initialize and deploy
eb init
eb create production
eb deploy
```

#### Frontend (AWS S3 + CloudFront)

1. **Build and deploy:**
```bash
cd frontend
npm run build

# Upload to S3
aws s3 sync build/ s3://your-bucket-name --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Environment Configuration

### Production Environment Variables

#### Backend (.env.production)
```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Server
NODE_ENV=production
PORT=5000

# Security
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_characters
JWT_EXPIRES_IN=7d

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-production-bucket

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@domain.com
EMAIL_PASS=your_app_password

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png,doc,docx

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (.env.production)
```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_NAME=Medical Patient Management System
REACT_APP_VERSION=1.0.0
GENERATE_SOURCEMAP=false
```

## Database Migration

### Production Database Setup

1. **Create production database on NeonDB or your preferred provider**

2. **Run migrations:**
```bash
cd backend
npx prisma db push
```

3. **Seed initial data (optional):**
```bash
npx prisma db seed
```

## Security Checklist

### Backend Security
- [ ] Use strong JWT secret (minimum 32 characters)
- [ ] Enable CORS only for your frontend domain
- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Validate all inputs
- [ ] Use environment variables for secrets
- [ ] Enable security headers (helmet)
- [ ] Regular dependency updates

### Frontend Security
- [ ] Build with production optimizations
- [ ] Remove console.logs and debug code
- [ ] Use HTTPS
- [ ] Implement CSP headers
- [ ] Validate user inputs
- [ ] Secure API communication

### Database Security
- [ ] Use connection pooling
- [ ] Enable SSL connections
- [ ] Regular backups
- [ ] Monitor for unusual activity
- [ ] Use least privilege access

### AWS S3 Security
- [ ] Private bucket with signed URLs
- [ ] IAM user with minimal permissions
- [ ] Enable versioning
- [ ] Configure lifecycle policies
- [ ] Monitor access logs

## Performance Optimization

### Backend Optimization
```javascript
// Add to server.js
const compression = require('compression');
app.use(compression());

// Database connection pooling
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
```

### Frontend Optimization
```javascript
// Code splitting
const PatientList = lazy(() => import('./pages/Patients/PatientListPage'));

// Service worker for caching
// Add to public/sw.js
```

## Monitoring and Logging

### Backend Monitoring
```javascript
// Add to server.js
const morgan = require('morgan');

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Error tracking
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});
```

### Health Checks
```javascript
// Already implemented in server.js
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'Connected'
    });
  } catch (error) {
    res.status(503).json({
      status: 'Error',
      database: 'Disconnected'
    });
  }
});
```

## Backup Strategy

### Database Backups
```bash
# Automated daily backups
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore from backup
psql $DATABASE_URL < backup_20241201.sql
```

### File Backups
- S3 versioning enabled
- Cross-region replication
- Lifecycle policies for old versions

## SSL Certificate

### Let's Encrypt (Free)
```bash
# Install certbot
sudo apt install certbot

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Auto-renewal
sudo crontab -e
0 12 * * * /usr/bin/certbot renew --quiet
```

## Domain Configuration

### DNS Records
```
A     @           your.server.ip
A     www         your.server.ip
CNAME api         your.backend.domain
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com www.yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Post-Deployment Checklist

- [ ] All environment variables set correctly
- [ ] Database migrations completed
- [ ] SSL certificate installed and working
- [ ] Health check endpoint responding
- [ ] File uploads working
- [ ] Authentication flow working
- [ ] All API endpoints accessible
- [ ] Frontend routing working
- [ ] Error pages displaying correctly
- [ ] Performance monitoring setup
- [ ] Backup systems configured
- [ ] Security headers configured

## Troubleshooting

### Common Issues
1. **CORS errors**: Check frontend URL in backend CORS config
2. **Database connection**: Verify DATABASE_URL format
3. **File upload errors**: Check AWS credentials and bucket permissions
4. **Build failures**: Clear node_modules and reinstall
5. **SSL issues**: Verify certificate installation and renewal

### Logs Location
- Backend logs: Check your hosting platform's log viewer
- Frontend errors: Browser console and error tracking service
- Database logs: NeonDB dashboard or your database provider

This deployment guide ensures a secure, scalable, and maintainable production deployment of your Medical Patient Management System.
