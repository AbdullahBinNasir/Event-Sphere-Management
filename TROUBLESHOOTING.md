# Troubleshooting Guide

## Registration Failed

If you're experiencing "Registration failed" errors, check the following:

### 1. Backend Server Status
Make sure the backend server is running:
```bash
cd backend
npm run dev
```
You should see:
- ✅ MongoDB connected successfully
- 🚀 Server running on port 5000

### 2. MongoDB Connection
Ensure MongoDB is running and accessible:
- Check if MongoDB service is running
- Verify the connection string in `backend/.env`:
  ```
  MONGODB_URI=mongodb://localhost:27017/event-sphere
  ```
- For MongoDB Atlas, use:
  ```
  MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event-sphere
  ```

### 3. API URL Configuration
Check if the frontend can reach the backend:
- Default: `http://localhost:5000/api`
- Create `.env` file in `event-sphere-management` folder:
  ```
  VITE_API_BASE_URL=http://localhost:5000/api
  ```

### 4. CORS Issues
The backend should have CORS enabled (already configured). If you see CORS errors:
- Check `backend/server.js` - CORS middleware should be enabled
- Make sure frontend and backend are on compatible ports

### 5. Common Error Messages

**"User already exists with this email"**
- The email is already registered
- Try a different email or login instead

**"Please provide name, email, and password"**
- Required fields are missing
- Check the registration form

**"Network Error" or "Failed to fetch"**
- Backend server is not running
- Check backend server status
- Verify API URL in frontend

**"MongoDB connection error"**
- MongoDB is not running
- Connection string is incorrect
- Check MongoDB service status

### 6. Check Browser Console
Open browser DevTools (F12) and check:
- Console tab for JavaScript errors
- Network tab for failed API requests
- Look for the actual error message

### 7. Check Backend Logs
Look at the terminal where the backend is running:
- Check for error messages
- Look for MongoDB connection status
- Check for validation errors

### 8. Test Backend Directly
Test the registration endpoint directly:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "attendee"
  }'
```

### 9. Environment Variables
Make sure `backend/.env` file exists with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-sphere
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

### 10. Clear Browser Cache
Sometimes cached data can cause issues:
- Clear browser cache
- Try in incognito/private mode
- Clear localStorage (F12 > Application > Local Storage > Clear)

## Still Having Issues?

1. Check both frontend and backend console logs
2. Verify all environment variables are set
3. Ensure MongoDB is running and accessible
4. Check network connectivity between frontend and backend
5. Verify ports 5000 (backend) and 5173 (frontend) are not blocked

