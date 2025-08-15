# 🏥 Medical Patient Management System - Unified Full Stack

A comprehensive medical patient management system built with React frontend and Node.js backend in a **single unified project structure** for easy deployment.

## 📁 Project Structure

```
medical-patient-management/
├── client/                 # React frontend application
│   ├── src/               # React source code
│   ├── public/            # Static assets
│   ├── build/             # Production build (generated)
│   └── package.json       # Frontend dependencies
├── src/                   # Backend source code
│   ├── routes/            # API routes
│   └── middleware/        # Express middleware
├── prisma/                # Database schema and migrations
├── server.js              # Main server file (serves both API and React)
├── package.json           # Main project dependencies
└── .env                   # Environment variables
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- PostgreSQL database

### Installation & Setup

1. **Clone and install dependencies:**
```bash
git clone <your-repo-url>
cd medical-patient-management
npm run install:all
```

2. **Set up environment variables:**
```bash
# Copy and update .env file
cp .env.example .env
# Edit .env with your database URL and other settings
```

3. **Set up database:**
```bash
npm run db:push
```

4. **Start development:**
```bash
npm run dev
```

5. **Build for production:**
```bash
npm run build
npm start
```

## 📜 Available Scripts

### Development
- `npm run dev` - Start both frontend and backend in development mode
- `npm run server:dev` - Start only backend with nodemon
- `npm run client:dev` - Start only frontend React app

### Production
- `npm start` - Start production server (serves built React app + API)
- `npm run build` - Build React app for production

### Database
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:reset` - Reset database

### Utilities
- `npm run install:all` - Install all dependencies (root + client)
- `npm run clean` - Remove all node_modules
- `npm run lint` - Run ESLint on frontend code

## 🌐 Deployment

### Easy Deployment Script
```bash
node deploy-unified.js
```

### Manual Deployment
1. **Install dependencies:** `npm run install:all`
2. **Build frontend:** `npm run build`
3. **Set environment:** Copy `.env.production` and update values
4. **Start server:** `npm start`

### Platform-Specific Deployment

#### Heroku
```bash
# The project is ready for Heroku deployment
# Just push to Heroku and it will automatically:
# 1. Install dependencies
# 2. Build React app
# 3. Start the server
```

#### Vercel/Netlify
```bash
# Build command: npm run build
# Start command: npm start
# Root directory: /
```

## 🔧 Configuration

### Environment Variables
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/medical_db
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

### Database Setup
The project uses PostgreSQL with Prisma ORM. The unified structure makes database management easier:

```bash
# Generate Prisma client
npm run db:generate

# Apply schema changes
npm run db:push

# View data
npm run db:studio
```

## 🎯 Benefits of Unified Structure

✅ **Single Repository** - Everything in one place
✅ **Easy Deployment** - One command deployment
✅ **Simplified CI/CD** - Single build process
✅ **Shared Dependencies** - No duplicate packages
✅ **Production Ready** - Serves static files efficiently
✅ **Development Friendly** - Hot reload for both frontend and backend

## 🏗️ Architecture

- **Frontend:** React 18 + Material-UI + Redux Toolkit
- **Backend:** Node.js + Express + Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** JWT tokens
- **File Upload:** Multer middleware
- **Deployment:** Single server serves both API and React app

## 📱 Features

- Patient registration and management
- Medical records and history
- Investigation tracking
- Treatment management
- Surgery records
- Liver transplant management
- Follow-up scheduling
- File uploads and management
- User authentication and authorization

## 🔒 Security

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- JWT authentication
- Input validation
- File upload restrictions

## 🚀 Production Deployment

The unified structure makes production deployment extremely simple:

1. **Single Build Process** - `npm run build` builds everything
2. **Single Server** - One Node.js server serves both API and React app
3. **Static File Serving** - React build files served efficiently
4. **Environment Management** - Single .env file for all configuration

Your application will be available at a single URL with:
- React app served at `/`
- API endpoints at `/api/*`
- Health check at `/health`

## 📞 Support

For issues or questions, please check the documentation or create an issue in the repository.

---

**🎉 Your Medical Patient Management System is now unified and ready for easy deployment!**
