# How to Create an Admin User

## Option 1: Using the Script (Recommended)

Run this command from the `backend` directory:

```bash
cd backend
npm run create-admin
```

This will create an admin user with:
- **Email**: `admin@eventsphere.com`
- **Password**: `admin123`
- **Role**: `admin`

⚠️ **IMPORTANT**: Change the password immediately after first login!

## Option 2: Manual MongoDB Update

If you already have a user account, you can update their role in MongoDB:

1. Connect to MongoDB:
```bash
mongosh
```

2. Switch to your database:
```javascript
use event-sphere
```

3. Update user role to admin:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

Or update to organizer:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "organizer" } }
)
```

## Option 3: Direct Registration (Not Recommended for Production)

You can temporarily modify the registration form to allow admin/organizer roles, but this is **NOT recommended** for production as it's a security risk.

## Roles Required for Admin Dashboard

To access the Admin Dashboard, you need one of these roles:
- **`admin`** - Full administrative access
- **`organizer`** - Can manage expos, exhibitors, and schedules

## Available Roles

- **`admin`** - Full access to all admin features
- **`organizer`** - Can manage expos, exhibitors, schedules, and analytics
- **`exhibitor`** - Can apply for expos and manage booth
- **`attendee`** - Can browse events, view exhibitors, and register for sessions

