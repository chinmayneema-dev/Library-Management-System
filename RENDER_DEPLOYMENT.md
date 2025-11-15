# Render Deployment Guide

## Overview
This guide will help you deploy your Library Management System to Render using GitHub integration.

## Prerequisites
1. Push your code to GitHub
2. Create a Render account at https://render.com
3. Connect your GitHub account to Render

## Deployment Steps

### 1. Deploy Backend (Web Service)

1. **Create New Web Service**
   - Go to Render Dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

2. **Configure Backend Service**
   - **Name**: `library-management-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Environment Variables**
   Add these in the Render dashboard:
   ```
   NODE_ENV=production
   DB_HOST=shinkansen.proxy.rlwy.net
   DB_PORT=20874
   DB_NAME=railway
   DB_USER=root
   DB_PASSWORD=ygMhIdauRxxVkHpjOnhYmTNynFWJaUnp
   DB_DIALECT=mysql
   JWT_SECRET=supersecretjwtkey
   JWT_EXPIRES_IN=1d
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL (e.g., `https://library-management-backend.onrender.com`)

### 2. Deploy Frontend (Static Site)

1. **Create New Static Site**
   - Go to Render Dashboard
   - Click "New" → "Static Site"
   - Connect your GitHub repository
   - Select your repository

2. **Configure Frontend Service**
   - **Name**: `library-management-frontend` (or your preferred name)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

3. **Environment Variables**
   Add this in the Render dashboard:
   ```
   VITE_API_BASE_URL=https://your-backend-service.onrender.com/api
   ```
   Replace `your-backend-service` with your actual backend service name from step 1.

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment to complete

## Important Notes

### Backend Considerations
- Your backend is already configured to use `process.env.PORT` which Render provides automatically
- Database connection is configured via environment variables
- CORS may need to be configured to allow your frontend domain

### Frontend Considerations
- The frontend uses `VITE_API_BASE_URL` environment variable for API calls
- Make sure to update this with your actual backend URL after backend deployment

### Database
- You're using Railway MySQL database which should work fine with Render
- Make sure your database allows connections from Render's IP ranges

## Deployment Order
1. **Deploy Backend First** - Get the backend URL
2. **Deploy Frontend Second** - Use the backend URL in frontend environment variables

## Post-Deployment
1. Test your application thoroughly
2. Check logs in Render dashboard if there are issues
3. Monitor performance and adjust resources if needed

## Troubleshooting

### Common Issues
1. **Build Failures**: Check build logs in Render dashboard
2. **Database Connection**: Verify environment variables are correct
3. **CORS Issues**: Configure CORS in your backend to allow your frontend domain
4. **API Calls Failing**: Ensure `VITE_API_BASE_URL` points to correct backend URL

### Useful Commands for Local Testing
```bash
# Test backend locally with production env
cd backend
NODE_ENV=production npm start

# Test frontend build locally
cd frontend
npm run build
npm run preview
```

## Security Notes
- Never commit `.env` files to GitHub
- Use Render's environment variables for all sensitive data
- Consider using different database credentials for production
- Rotate JWT secrets regularly
