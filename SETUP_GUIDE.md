# Event Sphere Management - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `env.example` to `.env`
   - Update MongoDB connection string:
     ```env
     MONGODB_URI=mongodb://localhost:27017/event-sphere
     JWT_SECRET=your-super-secret-jwt-key
     PORT=5000
     ```

4. **Start MongoDB** (if running locally)
   - Make sure MongoDB is running on your system
   - Default: `mongodb://localhost:27017`

5. **Start the backend server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd event-sphere-management
   ```

2. **Install dependencies** (if not already installed)
   ```bash
   npm install
   ```

3. **Configure API URL** (if needed)
   - Create `.env` file in `event-sphere-management` directory
   - Add: `VITE_API_BASE_URL=http://localhost:5000/api`

4. **Start the development server**
   ```bash
   npm run dev
   ```
   App will run on `http://localhost:5173` (or another port)

## 📁 Project Structure

```
event-sphere-management/
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── models/         # MongoDB models
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   └── config/         # Configuration
│   ├── server.js           # Entry point
│   └── package.json
│
└── event-sphere-management/ # React frontend
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── pages/          # Page components
    │   ├── contexts/       # React contexts
    │   ├── services/       # API services
    │   ├── utils/          # Utility functions
    │   ├── constants/      # Constants
    │   └── test/           # Test setup
    └── package.json
```

## 🧪 Running Tests

### Frontend Tests
```bash
cd event-sphere-management
npm test
```

### Backend Tests
(To be implemented)

## 🎨 Features Implemented

### ✅ Completed
- [x] Project setup and structure
- [x] MongoDB connection and models
- [x] User authentication (register, login, password reset)
- [x] JWT token-based authentication
- [x] Role-based access control (Admin, Organizer, Exhibitor, Attendee)
- [x] Protected routes
- [x] Beautiful UI components (Button, Input, Card, Alert, Loading)
- [x] Responsive design
- [x] Testing setup (Vitest + React Testing Library)

### 🚧 In Progress
- [ ] Admin Dashboard features
- [ ] Expo management
- [ ] Exhibitor management
- [ ] Schedule management
- [ ] Analytics

## 🔐 Default User Roles

- **Admin/Organizer**: Full access to manage expos, exhibitors, schedules
- **Exhibitor**: Can register for expos, select booths, manage profile
- **Attendee**: Can browse events, search exhibitors, manage schedule

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user (Protected)

### Health Check
- `GET /api/health` - Server status

## 🛠️ Development

### Backend
- Uses Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React 19
- React Router for navigation
- Axios for API calls
- Custom UI components
- Responsive CSS

## 📦 Dependencies

### Backend
- express
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv

### Frontend
- react
- react-router-dom
- axios
- date-fns
- vitest (testing)

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

### CORS Issues
- Backend CORS is configured to allow all origins in development
- Update CORS settings in `server.js` for production

### Port Conflicts
- Backend default: 5000
- Frontend default: 5173
- Update ports in `.env` files if needed

## 📚 Next Steps

1. Implement Expo management (CRUD)
2. Add Exhibitor approval workflow
3. Create Schedule management
4. Build Analytics dashboard
5. Add real-time updates
6. Implement feedback system

