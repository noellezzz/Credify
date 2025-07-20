import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import {
  selectIsAuthenticated,
  selectAuthLoading,
  selectIsOrganizationVerified,
  selectCurrentOrganization
} from '../../features/organizationAuth/organizationAuthSelectors';
import { 
  initializeAuth, 
  getCurrentOrganization 
} from '../../features/organizationAuth/organizationAuthSlice';
import Loader from '../../components/layouts/Loader';

const OrganizationProtectedRoute = ({ 
  children, 
  requireVerification = false,
  redirectTo = '/organization/login' 
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const isVerified = useSelector(selectIsOrganizationVerified);
  const organization = useSelector(selectCurrentOrganization);
  const organizationId = useSelector(state => state.organizationAuth?.organization?.id);

  useEffect(() => {
    // Initialize auth state from localStorage on mount
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    // If we have a session but no organization data, fetch it
    if (isAuthenticated && !organizationId && !loading) {
      dispatch(getCurrentOrganization());
    }
  }, [dispatch, isAuthenticated, organizationId, loading]);

  // Show loading while checking authentication
  if (loading) {
    return <Loader />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // If verification is required but organization is not verified
  if (requireVerification && !isVerified) {
    return (
      <Navigate 
        to="/organization/verification-pending" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // If authenticated (and verified if required), render the protected component
  return children;
};

export default OrganizationProtectedRoute;
