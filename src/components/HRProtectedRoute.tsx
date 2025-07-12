import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface HRProtectedRouteProps {
  children: React.ReactNode;
}

const HRProtectedRoute: React.FC<HRProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const hrAuth = localStorage.getItem('hrAuth');
      setIsAuthenticated(hrAuth === 'authenticated');
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    // Loading state
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1B1F3B]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/hr-login" replace />;
  }

  return <>{children}</>;
};

export default HRProtectedRoute; 