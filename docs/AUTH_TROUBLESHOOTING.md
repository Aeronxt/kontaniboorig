# Authentication Troubleshooting Guide

## Issues Fixed

### 1. ✅ Database Error When Saving New Users
**Problem**: Trigger function wasn't handling edge cases properly
**Solution**: 
- Updated trigger function to check for existing profiles before creating
- Added retry logic with exponential backoff
- Added manual profile creation fallback
- Created both INSERT and UPDATE triggers for better coverage

### 2. ✅ Email Confirmation Flow Issues  
**Problem**: Users couldn't sign in when email confirmation was required
**Solution**:
- Updated auth configuration to `mailer_autoconfirm: true` for easier testing
- Improved error messages for confirmation-related issues
- Added resend confirmation email functionality
- Better UI feedback for confirmation status

### 3. ✅ Unable to Login to Existing Accounts
**Problem**: Existing auth users didn't have corresponding profiles in User Account table
**Solution**:
- Created profiles for all existing auth users who were missing them
- Improved error handling for login failures
- Added better error messages for different failure scenarios

## Current Configuration

### Auth Settings (Temporarily for Testing)
```json
{
  "mailer_autoconfirm": true,
  "mailer_allow_unverified_email_sign_ins": false
}
```

### Database Triggers
1. **on_auth_user_created**: Triggers on INSERT to auth.users
2. **on_auth_user_confirmed**: Triggers on UPDATE to auth.users (for email confirmation)

### Profile Creation Logic
1. Try to fetch existing profile
2. If not found, retry with exponential backoff (1s, 2s, 4s)
3. After 3 retries, manually create profile
4. Handle both confirmed and unconfirmed users

## Testing the Fix

### Test Sign Up
1. Navigate to ProfilePage
2. Toggle to "Create Account"
3. Fill in: Name, Email, Password
4. Click "Create Account"
5. **Expected**: Account created successfully, user signed in immediately

### Test Sign In (Existing Users)
1. Use existing credentials:
   - `admin@gmail.com` (password from auth system)
   - `kontanibo1@gmail.com` (password from auth system)
2. **Expected**: Should sign in successfully and show profile

### Test New User Flow
1. Sign up with new email
2. **Expected**: 
   - Account created immediately (no email confirmation needed)
   - Profile automatically created in User Account table
   - User signed in and can see/edit profile

## Database Verification Queries

```sql
-- Check auth users and their profiles
SELECT 
  au.id as auth_id,
  au.email,
  au.email_confirmed_at,
  ua.id as profile_id,
  ua.name
FROM auth.users au
LEFT JOIN "User Account" ua ON au.id = ua.auth_user_id
ORDER BY au.created_at DESC;

-- Check if triggers exist
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers 
WHERE trigger_name IN ('on_auth_user_created', 'on_auth_user_confirmed');

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'User Account';
```

## Common Issues & Solutions

### Issue: "Invalid login credentials"
**Cause**: Wrong email/password or user doesn't exist
**Solution**: 
- Verify email/password
- Check if user exists in auth.users table
- Try password reset if needed

### Issue: Profile not loading after sign in
**Cause**: Profile creation failed or timing issue
**Solution**:
- Check browser console for errors
- Verify auth_user_id is set in User Account table
- Profile should be created automatically with retry logic

### Issue: RLS policy errors
**Cause**: User not authenticated or policy misconfiguration
**Solution**:
- Ensure user is properly signed in
- Check if auth.uid() returns the correct user ID
- Verify RLS policies allow the operation

## Rollback Plan (If Needed)

### To Re-enable Email Confirmation
```javascript
// In Supabase Dashboard or via API
{
  "mailer_autoconfirm": false,
  "mailer_allow_unverified_email_sign_ins": false
}
```

### To Revert to Old Auth System
1. Comment out Supabase Auth integration in ProfilePage
2. Uncomment localStorage-based auth
3. Remove auth_user_id dependency in profile queries

## Production Recommendations

### Security Settings
```json
{
  "mailer_autoconfirm": false,  // Require email confirmation
  "password_min_length": 8,     // Stronger passwords
  "security_captcha_enabled": true,  // Prevent bots
  "rate_limit_anonymous_users": 10   // Rate limiting
}
```

### Email Templates
- Customize confirmation email templates
- Set proper redirect URLs
- Configure SMTP settings properly

### Monitoring
- Set up logging for auth events
- Monitor failed login attempts
- Track profile creation success rates

## Next Steps

1. **Test thoroughly** with different user scenarios
2. **Monitor** profile creation success rates
3. **Customize** email templates for production
4. **Enable** stricter security settings when ready
5. **Add** password reset functionality
6. **Implement** social authentication if needed

## Quick Test Script

```bash
# Test new user signup
curl -X POST 'https://your-supabase-url/auth/v1/signup' \
  -H 'apikey: your-anon-key' \
  -H 'Content-Type: application/json' \
  -d '{"email": "test@example.com", "password": "password123"}'

# Test sign in
curl -X POST 'https://your-supabase-url/auth/v1/token?grant_type=password' \
  -H 'apikey: your-anon-key' \
  -H 'Content-Type: application/json' \
  -d '{"email": "test@example.com", "password": "password123"}'
```

The authentication system should now work properly for both new signups and existing user logins! 