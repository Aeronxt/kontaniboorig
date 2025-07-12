import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';

interface UserProfile {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

const MyDashPage: React.FC = () => {
  const { user, session, loading, signUp, signIn, signInWithGoogle, signOut } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [justSignedUp, setJustSignedUp] = useState(false);

  // Fetch user profile from mydashacc table
  const fetchUserProfile = async (authUserId: string, retryCount = 0, isAfterSignup = false) => {
    if (retryCount === 0) {
      setProfileLoading(true);
      setError(''); // Clear any previous errors
      console.log(`[MyDash] Starting profile fetch for user: ${authUserId}`, {
        isAfterSignup,
        justSignedUp
      });
    }
    
    // For just signed up users, give more retries and longer delays to allow trigger to complete
    const maxRetries = isAfterSignup || justSignedUp ? 6 : 3;
    const baseDelay = isAfterSignup || justSignedUp ? 2000 : 1000; // 2s vs 1s base delay
    
    try {
      console.log(`[MyDash] Attempting to fetch profile for auth_user_id: ${authUserId} (attempt ${retryCount + 1}/${maxRetries})`);
      
      const { data, error } = await supabase
        .from('mydashacc')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error(`[MyDash] Database error fetching profile:`, {
          error: error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          authUserId: authUserId,
          retryCount: retryCount
        });
        setProfileLoading(false);
        return;
      }

      if (data) {
        console.log(`[MyDash] Profile found successfully:`, {
          profileId: data.id,
          fullName: data.full_name,
          email: data.email,
          authUserId: data.auth_user_id
        });
        setUserProfile(data);
        setProfileLoading(false);
        setJustSignedUp(false); // Clear the just signed up flag
      } else if (retryCount < maxRetries) {
        // Profile doesn't exist yet, wait and retry (trigger might be running)
        const delay = Math.pow(2, retryCount) * baseDelay;
        console.log(`[MyDash] Profile not found, retrying... (${retryCount + 1}/${maxRetries}) - waiting ${delay}ms`);
        setTimeout(() => {
          fetchUserProfile(authUserId, retryCount + 1, isAfterSignup);
        }, delay);
      } else {
        // After retries, try to create profile manually
        console.log(`[MyDash] All retries exhausted, attempting manual profile creation for user:`, {
          authUserId: authUserId,
          userMetadata: user?.user_metadata,
          email: user?.email,
          maxRetries: maxRetries
        });
        
        try {
          const profileData = {
            auth_user_id: authUserId,
            full_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
            email: user?.email || ''
          };
          
          console.log(`[MyDash] Inserting profile data:`, profileData);
          
          const { data: newProfile, error: createError } = await supabase
            .from('mydashacc')
            .insert([profileData])
            .select()
            .single();

          if (createError) {
            console.error(`[MyDash] Manual profile creation failed:`, {
              error: createError,
              code: createError.code,
              message: createError.message,
              details: createError.details,
              hint: createError.hint,
              profileData: profileData
            });
            setProfileLoading(false);
            setJustSignedUp(false);
            // Show user-friendly error
            setError(`Database error saving user profile. Error: ${createError.message} (Code: ${createError.code}). Please try refreshing the page or contact support.`);
          } else {
            console.log(`[MyDash] Manual profile creation successful:`, newProfile);
            setUserProfile(newProfile);
            setProfileLoading(false);
            setJustSignedUp(false);
          }
        } catch (manualCreateError) {
          console.error(`[MyDash] Exception during manual profile creation:`, {
            error: manualCreateError,
            authUserId: authUserId,
            userEmail: user?.email
          });
          setProfileLoading(false);
          setJustSignedUp(false);
          setError(`Unable to create user profile. Error: ${manualCreateError instanceof Error ? manualCreateError.message : 'Unknown error'}. Please try refreshing the page or contact support.`);
        }
      }
    } catch (err) {
      console.error(`[MyDash] Exception in fetchUserProfile:`, {
        error: err,
        authUserId: authUserId,
        retryCount: retryCount
      });
      setProfileLoading(false);
      setJustSignedUp(false);
      setError(`Database connection error. Error: ${err instanceof Error ? err.message : 'Unknown error'}. Please check your internet connection and try again.`);
    }
  };

  useEffect(() => {
    console.log(`[MyDash] useEffect triggered - user state changed:`, {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      userMetadata: user?.user_metadata,
      justSignedUp
    });
    
    if (user) {
      console.log(`[MyDash] User authenticated, fetching profile for user ID: ${user.id}`);
      fetchUserProfile(user.id, 0, justSignedUp);
    } else {
      console.log(`[MyDash] No user found, clearing profile state`);
      setUserProfile(null);
      setJustSignedUp(false);
    }
  }, [user, justSignedUp]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log(`[MyDash] Starting signin process for email: ${formData.email}`);
      
      const { data, error } = await signIn(formData.email, formData.password);

      if (error) {
        console.error(`[MyDash] Signin error:`, {
          error: error,
          message: error.message,
          status: error.status
        });
        
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and click the confirmation link before signing in.');
        } else if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        } else {
          throw error;
        }
      }

      console.log(`[MyDash] Signin successful:`, {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email
        } : null,
        hasSession: !!data.session
      });

      if (data.user) {
        setSuccess('Welcome back to MyDash!');
        setFormData({ fullName: '', email: '', password: '' });
      }
    } catch (err: any) {
      console.error(`[MyDash] Signin process failed:`, {
        error: err,
        message: err.message,
        stack: err.stack,
        email: formData.email
      });
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setSuccess('Signed out successfully!');
      setUserProfile(null);
    } catch (err: any) {
      setError(err.message || 'Error signing out');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      const { data, error } = await signInWithGoogle();
      if (error) {
        console.error('[MyDash] Google sign-in error:', error);
        setError(error.message || 'Failed to sign in with Google');
      }
      // Note: The redirect will happen automatically, so we don't need to handle success here
    } catch (err: any) {
      console.error('[MyDash] Google sign-in exception:', err);
      setError(err.message || 'An error occurred during Google sign-in');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Show loading state when user is authenticated but profile is still loading
  if (user && profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {justSignedUp 
              ? 'Creating your dashboard...' 
              : 'Setting up your dashboard...'
            }
          </p>
          {justSignedUp && (
            <p className="text-sm text-gray-500 mt-2">
              This may take a few moments for new accounts
            </p>
          )}
        </div>
      </div>
    );
  }

  // Show error state when user is authenticated but profile failed to load
  if (user && !userProfile && error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Setup Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={() => user && fetchUserProfile(user.id, 0, justSignedUp)}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show dashboard if user is authenticated
  if (user && userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Hello, {userProfile.full_name}! 👋
                  </h1>
                  <p className="text-gray-600 mt-2">Welcome to your personal dashboard</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Profile</h3>
                    <p className="text-sm text-gray-600">{userProfile.email}</p>
                  </div>
                </div>
              </motion.div>

              {/* Account Info */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Account</h3>
                    <p className="text-sm text-gray-600">Active since {new Date(userProfile.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </motion.div>

              {/* Status */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Status</h3>
                    <p className="text-sm text-gray-600">Online</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Welcome Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-8 mt-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to MyDash!</h2>
              <p className="text-gray-600 leading-relaxed">
                This is your personal dashboard where you can manage your account and access various features. 
                We're excited to have you here, <strong>{userProfile.full_name}</strong>!
              </p>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Account ID:</strong> {userProfile.id}<br />
                  <strong>Email:</strong> {userProfile.email}<br />
                  <strong>Member since:</strong> {new Date(userProfile.created_at).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Show login/signup form if user is not authenticated
  return (
    <div className="min-h-screen flex bg-[#f5f5f0]">
      {/* Left side - Empty placeholder */}
      <div className="hidden md:block w-1/2 bg-[#f5f5f0] relative">
        {/* Empty placeholder area */}
      </div>

      {/* Right side - Sign in form */}
      <div className="w-full md:w-1/2 px-8 py-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="flex justify-between items-center mb-8">
            <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages//LOG32PNG.png" alt="Logo" className="h-10 w-15" />
            <div className="text-sm text-gray-500">
              Don't have an account? 
              <span className="ml-1 text-blue-600 font-medium">Sign up</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h2>
          
          <p className="text-gray-600 mb-6">Sign in with your Flowscape Account</p>

          {/* OAuth buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button 
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-full hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-full hover:bg-gray-50">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#000"
                  d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
                />
              </svg>
              Apple ID
            </button>
          </div>

          <div className="flex items-center justify-center my-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">Or continue with email address</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
              {success}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none rounded-full relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-sm"
                  placeholder="tom@wil.net"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none rounded-full relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-sm"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 rounded-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-6">
              <Button type="submit" disabled={isLoading} isLoading={isLoading}>
                Log in
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyDashPage; 