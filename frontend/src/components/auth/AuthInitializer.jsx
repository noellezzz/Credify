import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth } from '../../features/organizationAuth/organizationAuthSlice';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize auth state from localStorage on app startup
    dispatch(initializeAuth());
  }, [dispatch]);

  return children;
};

export default AuthInitializer;
