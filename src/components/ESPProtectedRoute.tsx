import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface ESPProtectedRouteProps {
  children: React.ReactNode;
}

const ESPProtectedRoute: React.FC<ESPProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const espAuth = localStorage.getItem('espAuth');
      if (espAuth) {
        try {
          const authData = JSON.parse(espAuth);
          setIsAuthenticated(authData.isAuthenticated === true);
        } catch (error) {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
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
    return <Navigate to="/esp-login" replace />;
  }

  return <>{children}</>;
};

export default ESPProtectedRoute; 