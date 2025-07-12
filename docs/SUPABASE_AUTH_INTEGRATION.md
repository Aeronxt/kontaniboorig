# Supabase Authentication Integration

## Overview

The ProfilePage has been integrated with Supabase Authentication, providing secure user registration, login, and profile management. This replaces the previous custom authentication system with proper Supabase Auth.

## Features

✅ **Sign Up**: Users can create accounts with email/password  
✅ **Sign In**: Secure login with Supabase Auth  
✅ **Email Verification**: Optional email confirmation  
✅ **Profile Management**: Automatic profile creation and updates  
✅ **Row Level Security**: Users can only access their own data  
✅ **Session Management**: Persistent login sessions  

## Database Changes

### User Account Table Updates
- Added `auth_user_id` column (UUID) that references `auth.users(id)`
- Made `password` column nullable (since Supabase handles authentication)
- Created indexes for better performance
- Enabled Row Level Security (RLS)

### Automatic Profile Creation
- Created a trigger function `handle_new_user()` that automatically creates a profile in `User Account` table when users sign up
- Trigger executes on INSERT to `auth.users` table

### Security Policies
- Users can only view, update, and insert their own profile data
- Policies are based on `auth.uid()` matching `auth_user_id`

## How It Works

### 1. User Registration (Sign Up)
```typescript
// In ProfilePage.tsx - handleSubmit() for signup
const { data, error } = await supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
  options: {
    data: { full_name: formData.name }
  }
});
```

### 2. Automatic Profile Creation
When a user signs up, the database trigger automatically creates a record in `User Account`:
```sql
-- Trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."User Account" (auth_user_id, name, email, favourites, reviews)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    '{}'::jsonb,
    '[]'::jsonb
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3. Session Management
```typescript
// Check for existing session on app load
useEffect(() => {
  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      setIsLoggedIn(true);
      await fetchUserProfile(session.user.id);
    }
  };
  checkUser();
}, []);
```

### 4. Real-time Auth State
```typescript
// Listen for auth state changes
const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    setUser(session.user);
    setIsLoggedIn(true);
    await fetchUserProfile(session.user.id);
  } else {
    setUser(null);
    setIsLoggedIn(false);
    setUserProfile(null);
  }
});
```

## Usage Guide

### For Users
1. **Sign Up**: Navigate to ProfilePage, toggle to "Create Account", fill form
2. **Email Verification**: Check email for verification link (if enabled)
3. **Sign In**: Use email/password to sign in
4. **Profile Management**: Edit profile information when logged in
5. **Sign Out**: Use logout button to end session

### For Developers

#### Using the Auth Context (Optional)
```typescript
// Wrap your app with AuthProvider
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <YourAppComponents />
    </AuthProvider>
  );
}

// Use in any component
import { useAuth } from './context/AuthContext';

function SomeComponent() {
  const { user, session, loading, signIn, signOut } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;
  
  return <div>Welcome {user.email}!</div>;
}
```

#### Direct Supabase Auth Usage
```typescript
import { supabase } from './lib/supabase';

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// Sign out
await supabase.auth.signOut();

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

## Security Features

### Row Level Security (RLS)
- Enabled on `User Account` table
- Users can only access their own records
- Policies enforce `auth_user_id = auth.uid()`

### Data Validation
- Email validation by Supabase
- Password strength requirements
- SQL injection protection

### Session Security
- Secure JWT tokens
- Automatic session refresh
- Configurable session timeout

## Configuration

### Email Settings
Configure in Supabase Dashboard > Authentication > Settings:
- SMTP settings for email verification
- Email templates customization
- Redirect URLs after verification

### Password Policy
Configure in Supabase Dashboard > Authentication > Settings:
- Minimum password length
- Password complexity requirements
- Account lockout policies

## Troubleshooting

### Common Issues

1. **Email not verified**
   - Check spam folder
   - Verify SMTP settings in Supabase dashboard
   - Check redirect URL configuration

2. **Profile not created**
   - Check if trigger exists: `SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created'`
   - Verify trigger function is working
   - Check Supabase logs for errors

3. **RLS errors**
   - Ensure user is authenticated
   - Check if policies are correctly configured
   - Verify `auth_user_id` is properly set

### Database Queries for Debugging

```sql
-- Check if user profile exists
SELECT * FROM "User Account" WHERE auth_user_id = 'user-uuid-here';

-- View RLS policies
SELECT * FROM pg_policies WHERE tablename = 'User Account';

-- Check trigger status
SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';
```

## Migration Notes

### Existing Users
- Existing records in `User Account` table will continue to work
- The `password` column is now nullable
- New `auth_user_id` column links to Supabase Auth

### Data Migration (if needed)
If you need to migrate existing users to Supabase Auth:
1. Create Supabase Auth accounts programmatically
2. Update existing `User Account` records with `auth_user_id`
3. Remove password data from `User Account` table

## Next Steps

1. **Email Templates**: Customize email verification templates in Supabase dashboard
2. **Social Auth**: Add Google, GitHub, etc. authentication providers
3. **Password Reset**: Implement password reset functionality
4. **Multi-Factor Auth**: Enable MFA for enhanced security
5. **Auth Guards**: Create route protection for authenticated-only pages 