import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useRoleAuth = (requiredRoles = []) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get token from localStorage or your auth context
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          setIsLoading(false);
          navigate('/login');
          return;
        }

        // Verify token and get user data
        const response = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Token verification failed');
        }

        const userData = await response.json();
        setUser(userData);

        // Check if user has required roles
        if (requiredRoles.length === 0) {
          setIsAuthorized(true);
        } else {
          const hasRequiredRole = requiredRoles.some(role => 
            userData.roles?.includes(role)
          );
          setIsAuthorized(hasRequiredRole);
        }

      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requiredRoles, navigate]);

  return { isAuthorized, isLoading, user };
};
