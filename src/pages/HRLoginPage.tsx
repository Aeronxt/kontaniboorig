import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HRLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple admin authentication
    if (username === 'arhaam' && password === 'arham121') {
      // Store auth token in localStorage
      localStorage.setItem('hrAuth', 'authenticated');
      navigate('/hr');
    } else {
      setError('Invalid credentials. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B1F3B] via-[#2d325f] to-[#1B1F3B] flex flex-col items-center justify-center p-4">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center mb-8"
      >
        <p className="text-white text-lg font-semibold mb-4">Built By:</p>
        <img 
          src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages//aerondropshad.png" 
          alt="Built By Logo" 
          className="w-24 h-24 object-contain mx-auto"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative py-3 sm:max-w-xs sm:mx-auto"
      >
        <div className="min-h-96 px-8 py-6 mt-4 text-left bg-white dark:bg-gray-900 rounded-xl shadow-lg">
          <form onSubmit={handleLogin}>
            <div className="flex flex-col justify-center items-center h-full select-none">
              <div className="flex flex-col items-center justify-center gap-2 mb-8">
                <img 
                  src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages//aerondropshad.png" 
                  alt="Logo" 
                  className="w-20 h-20 object-contain"
                />
                <p className="m-0 text-[16px] font-semibold dark:text-white">
                  Login to your Account
                </p>
                <span className="m-0 text-xs max-w-[90%] text-center text-[#8B8E98]">
                  Get started with HR portal, just login and enjoy the experience.
                </span>
              </div>
              <div className="w-full flex flex-col gap-2">
                <label className="font-semibold text-xs text-gray-400">Username</label>
                <input 
                  placeholder="Username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border rounded-lg px-3 py-2 mb-5 text-sm w-full outline-none dark:border-gray-500 dark:bg-gray-900 focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent transition"
                  required
                />
              </div>
            
              <label className="font-semibold text-xs text-gray-400">Password</label>
              <input 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded-lg px-3 py-2 mb-5 text-sm w-full outline-none dark:border-gray-500 dark:bg-gray-900 focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent transition" 
                type="password"
                required
              />
            </div>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm"
              >
                {error}
              </motion.div>
            )}
            
            <div>
              <button 
                type="submit"
                disabled={loading}
                className="py-3 px-8 bg-[#1B1F3B] hover:bg-[#2d325f] focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default HRLoginPage; 