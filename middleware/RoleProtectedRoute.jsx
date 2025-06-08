import React from 'react';
import { useRoleAuth } from '../frontend/src/hooks/useRoleAuth';

const RoleProtectedRoute = ({ 
  children, 
  requiredRoles = [], 
  fallback = null,
  loadingComponent = null 
}) => {
  const { isAuthorized, isLoading, user } = useRoleAuth(requiredRoles);

  if (isLoading) {
    return loadingComponent || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default RoleProtectedRoute;
