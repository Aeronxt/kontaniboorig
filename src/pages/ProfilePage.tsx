import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { UserCircle, Edit3, Save, X, Camera, Heart, MessageSquare, Settings, Award, TrendingUp, Calendar, Mail, User as UserIcon, Image, Star, MapPin, Phone, Globe, Briefcase } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Styled Components
const DashboardContainer = styled.div`
  min-height: 100vh;
  background: #1B1F3B;
  position: relative;
  overflow-x: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 118, 117, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(255, 177, 153, 0.1) 0%, transparent 50%);
    animation: ${float} 6s ease-in-out infinite;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ProfileHeader = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${fadeInUp} 0.6s ease-out;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
    margin-bottom: 1rem;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: ${shimmer} 2s infinite;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const Avatar = styled.div<{ hasImage: boolean }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.hasImage ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    width: 90px;
    height: 90px;
  }
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const AvatarOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
  
  &:hover {
    opacity: 1;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div<{ delay?: string }>`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.6s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  
  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 12px;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const StatIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
  animation: ${pulse} 2s infinite;
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    margin-bottom: 0.75rem;
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const ProfileForm = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${fadeInUp} 0.8s ease-out;
  
  @media (max-width: 768px) {
    padding: 1.25rem;
    border-radius: 16px;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const SidebarCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${fadeInUp} 1s ease-out;
  
  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 12px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  
  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 0.625rem 0.875rem;
    font-size: 0.9375rem;
    border-radius: 10px;
  }
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.875rem;
  font-family: 'Monaco', 'Menlo', monospace;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  resize: vertical;
  min-height: 120px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: white;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  ${props => {
    switch (props.variant) {
      case 'danger':
        return `
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
          }
        `;
      case 'secondary':
        return `
          background: rgba(107, 114, 128, 0.1);
          color: #374151;
          &:hover {
            background: rgba(107, 114, 128, 0.2);
            transform: translateY(-2px);
          }
        `;
      default:
        return `
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1B1F3B;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 118, 117, 0.1) 0%, transparent 50%);
    animation: ${float} 4s ease-in-out infinite;
  }
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
  animation: ${fadeInUp} 0.8s ease-out;
`;

const AlertMessage = styled.div<{ type: 'error' | 'success' }>`
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  animation: ${fadeInUp} 0.5s ease-out;
  
  ${props => props.type === 'error' ? css`
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
    border: 1px solid rgba(239, 68, 68, 0.2);
  ` : css`
    background: rgba(34, 197, 94, 0.1);
    color: #16a34a;
    border: 1px solid rgba(34, 197, 94, 0.2);
  `}
`;

const AnimatedIconContainer = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  animation: ${pulse} 2s infinite;
`;

const SpinnerDiv = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const ProfilePage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setIsLoggedIn(true);
        await fetchUserProfile(session.user.id);
      }
    };

    checkUser();

    // Listen for auth changes
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

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string, retryCount = 0) => {
    try {
      const { data, error } = await supabase
        .from('User Account')
        .select('*')
        .eq('auth_user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setUserProfile(data);
      } else if (retryCount < 3) {
        // Profile might not be created yet due to trigger timing
        // Retry with exponential backoff
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        setTimeout(() => {
          fetchUserProfile(userId, retryCount + 1);
        }, delay);
      } else {
        // After 3 retries, manually create the profile
        console.log('Creating profile manually after retries failed');
        try {
          const { data: userData } = await supabase.auth.getUser();
          const user = userData.user;
          
          if (user) {
            const { data: newProfile, error: createError } = await supabase
              .from('User Account')
              .insert([{
                auth_user_id: userId,
                name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
                email: user.email || '',
                favourites: {},
                reviews: []
              }])
              .select()
              .single();

            if (createError) {
              console.error('Error creating profile manually:', createError);
            } else {
              setUserProfile(newProfile);
            }
          }
        } catch (manualCreateError) {
          console.error('Error in manual profile creation:', manualCreateError);
        }
      }
    } catch (err) {
      console.error('Error in fetchUserProfile:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isSignUp) {
        // Sign up with Supabase Auth
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
            }
          }
        });

        if (signUpError) {
          throw signUpError;
        }

        if (data.user && data.session) {
          setSuccess('Account created successfully! You are now signed in.');
        } else if (data.user && !data.session) {
          setSuccess('Check your email for the confirmation link! You must confirm your email before you can sign in.');
        } else {
          setSuccess('Account created successfully!');
        }

        setFormData({ name: '', email: '', password: '' });
      } else {
        // Sign in with Supabase Auth
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) {
          // Handle specific error cases
          if (signInError.message.includes('Email not confirmed')) {
            throw new Error('Please check your email and click the confirmation link before signing in.');
          } else if (signInError.message.includes('Invalid login credentials')) {
            throw new Error('Invalid email or password. Please check your credentials and try again.');
          } else {
            throw signInError;
          }
        }

        if (data.user) {
          setSuccess('Signed in successfully!');
          setFormData({ name: '', email: '', password: '' });
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setIsLoggedIn(false);
      setUser(null);
      setUserProfile(null);
      setFormData({ name: '', email: '', password: '' });
      setIsEditing(false);
      setError('');
      setSuccess('');
      setEditSuccess('');
    } catch (err: any) {
      setError(err.message || 'Error signing out');
    }
  };

  const handleResendConfirmation = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email
      });

      if (error) throw error;
      
      setSuccess('Confirmation email resent! Please check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Error resending confirmation email');
    } finally {
      setIsLoading(false);
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    id: userProfile?.id || '',
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    avatar: userProfile?.avatar || '',
    favourites: userProfile?.favourites || {},
    reviews: userProfile?.reviews || {}
  });
  const [editSuccess, setEditSuccess] = useState('');

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setEditSuccess('');

    try {
      const { data, error } = await supabase
        .from('User Account')
        .update({
          name: profileData.name,
          email: profileData.email,
          avatar: profileData.avatar,
          favourites: profileData.favourites,
          reviews: profileData.reviews
        })
        .eq('auth_user_id', user?.id)
        .select()
        .single();

      if (error) throw error;

      setUserProfile(data);
      setEditSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        id: userProfile.id || '',
        name: userProfile.name || '',
        email: userProfile.email || '',
        avatar: userProfile.avatar || '',
        favourites: userProfile.favourites || {},
        reviews: userProfile.reviews || {}
      });
    }
  }, [userProfile]);

  // Calculate stats
  const stats = {
    favorites: Object.keys(profileData.favourites || {}).length,
    reviews: Array.isArray(profileData.reviews) ? profileData.reviews.length : 0,
    joinDate: userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : 'N/A',
    lastActive: 'Today'
  };

  if (isLoggedIn && userProfile) {
    return (
      <DashboardContainer>
        <ContentWrapper>
          <ProfileHeader>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <AvatarContainer>
                  <Avatar hasImage={!!profileData.avatar}>
                    {profileData.avatar ? (
                      <img src={profileData.avatar} alt="Avatar" />
                    ) : (
                      <UserCircle size={60} color="white" />
                    )}
                    <AvatarOverlay>
                      <Camera size={24} color="white" />
                    </AvatarOverlay>
                  </Avatar>
                </AvatarContainer>
                <div>
                  <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                    {profileData.name}
                  </h1>
                  <p style={{ color: '#6b7280', fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                    {profileData.email}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                      Active now
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? <X size={16} /> : <Edit3 size={16} />}
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
                <Button variant="danger" onClick={handleLogout}>
                  <Settings size={16} />
                  Logout
                </Button>
              </div>
            </div>
          </ProfileHeader>

          <StatsGrid>
            <StatCard style={{ animationDelay: '0.1s' }}>
              <StatIcon>
                <Heart size={24} />
              </StatIcon>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                {stats.favorites}
              </h3>
              <p style={{ color: '#6b7280' }}>Favorites</p>
            </StatCard>
            <StatCard style={{ animationDelay: '0.2s' }}>
              <StatIcon>
                <MessageSquare size={24} />
              </StatIcon>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                {stats.reviews}
              </h3>
              <p style={{ color: '#6b7280' }}>Reviews</p>
            </StatCard>
            <StatCard style={{ animationDelay: '0.3s' }}>
              <StatIcon>
                <Calendar size={24} />
              </StatIcon>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                {stats.joinDate}
              </h3>
              <p style={{ color: '#6b7280' }}>Member Since</p>
            </StatCard>
            <StatCard style={{ animationDelay: '0.4s' }}>
              <StatIcon>
                <TrendingUp size={24} />
              </StatIcon>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                {stats.lastActive}
              </h3>
              <p style={{ color: '#6b7280' }}>Last Active</p>
            </StatCard>
          </StatsGrid>

          <MainContent>
            <ProfileForm>
              {error && <AlertMessage type="error">{error}</AlertMessage>}
              {editSuccess && <AlertMessage type="success">{editSuccess}</AlertMessage>}

              {isEditing ? (
                <form onSubmit={handleProfileUpdate}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', color: '#1f2937' }}>
                    Edit Profile
                  </h2>
                  
                  <FormGroup>
                    <Label>
                      <UserIcon size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                      Full Name
                    </Label>
                    <Input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      <Mail size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                      Email Address
                    </Label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      placeholder="Enter your email"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      <Image size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                      Avatar URL
                    </Label>
                    <Input
                      type="url"
                      value={profileData.avatar || ''}
                      onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      <Heart size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                      Favorites (JSON)
                    </Label>
                    <TextArea
                      value={JSON.stringify(profileData.favourites, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          setProfileData({ ...profileData, favourites: parsed });
                        } catch (err) {
                          // Allow invalid JSON while typing
                        }
                      }}
                      placeholder='{"category": "value"}'
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      <MessageSquare size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                      Reviews (JSON)
                    </Label>
                    <TextArea
                      value={JSON.stringify(profileData.reviews, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          setProfileData({ ...profileData, reviews: parsed });
                        } catch (err) {
                          // Allow invalid JSON while typing
                        }
                      }}
                      placeholder='[{"rating": 5, "comment": "Great!"}]'
                    />
                  </FormGroup>

                                     <Button type="submit" disabled={isLoading} style={{ width: '100%' }}>
                     {isLoading ? (
                       <>
                         <SpinnerDiv />
                         Saving...
                       </>
                     ) : (
                       <>
                         <Save size={16} />
                         Save Changes
                       </>
                     )}
                   </Button>
                </form>
              ) : (
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', color: '#1f2937' }}>
                    Profile Information
                  </h2>
                  
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(107, 114, 128, 0.05)', borderRadius: '12px' }}>
                      <h3 style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Personal Details</h3>
                      <div style={{ display: 'grid', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#6b7280' }}>Name:</span>
                          <span style={{ fontWeight: '500' }}>{profileData.name}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#6b7280' }}>Email:</span>
                          <span style={{ fontWeight: '500' }}>{profileData.email}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#6b7280' }}>Avatar:</span>
                          <span style={{ fontWeight: '500' }}>{profileData.avatar ? 'Set' : 'Not set'}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: '1rem', background: 'rgba(107, 114, 128, 0.05)', borderRadius: '12px' }}>
                      <h3 style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Favorites</h3>
                      <pre style={{ 
                        fontSize: '0.875rem', 
                        color: '#4b5563', 
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'Monaco, Menlo, monospace',
                        background: 'white',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        {JSON.stringify(profileData.favourites, null, 2)}
                      </pre>
                    </div>

                    <div style={{ padding: '1rem', background: 'rgba(107, 114, 128, 0.05)', borderRadius: '12px' }}>
                      <h3 style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Reviews</h3>
                      <pre style={{ 
                        fontSize: '0.875rem', 
                        color: '#4b5563', 
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'Monaco, Menlo, monospace',
                        background: 'white',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        {JSON.stringify(profileData.reviews, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </ProfileForm>

            <Sidebar>
              <SidebarCard>
                <h3 style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Quick Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Button variant="secondary" style={{ justifyContent: 'flex-start' }}>
                    <Settings size={16} />
                    Account Settings
                  </Button>
                  <Button variant="secondary" style={{ justifyContent: 'flex-start' }}>
                    <Award size={16} />
                    Achievements
                  </Button>
                  <Button variant="secondary" style={{ justifyContent: 'flex-start' }}>
                    <Globe size={16} />
                    Privacy Settings
                  </Button>
                </div>
              </SidebarCard>

              <SidebarCard>
                <h3 style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Activity Feed</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ padding: '0.75rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', borderLeft: '3px solid #22c55e' }}>
                    <p style={{ fontSize: '0.875rem', color: '#16a34a', fontWeight: '500' }}>Profile updated successfully</p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>2 minutes ago</p>
                  </div>
                  <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', borderLeft: '3px solid #3b82f6' }}>
                    <p style={{ fontSize: '0.875rem', color: '#2563eb', fontWeight: '500' }}>New review submitted</p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>1 hour ago</p>
                  </div>
                  <div style={{ padding: '0.75rem', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '8px', borderLeft: '3px solid #a855f7' }}>
                    <p style={{ fontSize: '0.875rem', color: '#9333ea', fontWeight: '500' }}>Added to favorites</p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>3 hours ago</p>
                  </div>
                </div>
              </SidebarCard>
            </Sidebar>
          </MainContent>
        </ContentWrapper>
      </DashboardContainer>
    );
  }

  return (
    <LoginContainer>
      <LoginCard>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <AnimatedIconContainer>
            <UserCircle size={40} color="white" />
          </AnimatedIconContainer>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p style={{ color: '#6b7280' }}>
            {isSignUp ? 'Sign up to get started' : 'Sign in to your account'}
          </p>
        </div>

        {error && <AlertMessage type="error">{error}</AlertMessage>}
        {success && <AlertMessage type="success">{success}</AlertMessage>}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <FormGroup>
              <Label>Full Name</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                required
              />
            </FormGroup>
          )}

          <FormGroup>
            <Label>Email Address</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Password</Label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              required
            />
          </FormGroup>

                     <Button type="submit" disabled={isLoading} style={{ width: '100%', marginBottom: '1rem' }}>
             {isLoading ? (
               <>
                 <SpinnerDiv />
                 {isSignUp ? 'Creating Account...' : 'Signing In...'}
               </>
             ) : (
               isSignUp ? 'Create Account' : 'Sign In'
             )}
           </Button>

          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#667eea', 
                cursor: 'pointer',
                fontSize: '0.875rem',
                textDecoration: 'underline',
                marginBottom: '0.5rem',
                display: 'block',
                width: '100%'
              }}
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
            
            {!isSignUp && error?.includes('confirmation') && formData.email && (
              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={isLoading}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#f59e0b', 
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  textDecoration: 'underline'
                }}
              >
                Resend confirmation email
              </button>
            )}
          </div>
        </form>
      </LoginCard>
    </LoginContainer>
  );
};

export default ProfilePage; 