import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  selectCurrentOrganization,
  selectOrganizationVerificationStatus
} from '../../features/organizationAuth/organizationAuthSelectors';
import { logoutOrganization } from '../../features/organizationAuth/organizationAuthSlice';
import PrimeButton from '../../components/buttons/PrimeButton';

const OrganizationVerificationPending = () => {
  const dispatch = useDispatch();
  const organization = useSelector(selectCurrentOrganization);
  const verificationStatus = useSelector(selectOrganizationVerificationStatus);

  const handleLogout = () => {
    dispatch(logoutOrganization());
  };

  const getStatusMessage = () => {
    switch (verificationStatus) {
      case 'pending':
        return {
          title: 'Verification Pending',
          message: 'Your organization account is currently under review. Our team will verify your organization details and contact you once the verification is complete.',
          icon: '⏳',
          color: 'text-yellow-600'
        };
      case 'rejected':
        return {
          title: 'Verification Rejected',
          message: 'Unfortunately, your organization verification was not approved. Please contact our support team for more information or to resubmit your application.',
          icon: '❌',
          color: 'text-red-600'
        };
      default:
        return {
          title: 'Verification Required',
          message: 'Your organization needs to be verified before you can access all features.',
          icon: '📋',
          color: 'text-blue-600'
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-auto flex justify-center mb-6">
              <img
                className="h-12 w-auto"
                src="/src/assets/Credify.png"
                alt="Credify"
              />
            </div>
            
            <div className={`text-6xl mb-4`}>
              {statusInfo.icon}
            </div>
            
            <h2 className={`text-2xl font-bold ${statusInfo.color} mb-4`}>
              {statusInfo.title}
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              {statusInfo.message}
            </p>

            {organization && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-800 mb-2">Organization Details:</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Name:</span> {organization.name}</p>
                  <p><span className="font-medium">Email:</span> {organization.email}</p>
                  <p><span className="font-medium">Type:</span> {organization.type}</p>
                  <p><span className="font-medium">Status:</span> 
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                      verificationStatus === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : verificationStatus === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {verificationStatus.charAt(0).toUpperCase() + verificationStatus.slice(1)}
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {verificationStatus === 'pending' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">What happens next?</h4>
                  <ul className="text-sm text-blue-700 space-y-1 text-left">
                    <li>• Our team will review your organization details</li>
                    <li>• Verification typically takes 1-3 business days</li>
                    <li>• You'll receive an email once verification is complete</li>
                    <li>• Contact support if you have any questions</li>
                  </ul>
                </div>
              )}

              {verificationStatus === 'rejected' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">Need Help?</h4>
                  <p className="text-sm text-red-700 text-left">
                    Contact our support team at{' '}
                    <a href="mailto:support@credify.com" className="underline">
                      support@credify.com
                    </a>{' '}
                    for assistance with your verification or to resubmit your application.
                  </p>
                </div>
              )}

              <div className="flex flex-col space-y-2">
                <Link
                  to="/organization/profile"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 text-center"
                >
                  View Profile
                </Link>
                
                <PrimeButton
                  onClick={handleLogout}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200"
                >
                  Logout
                </PrimeButton>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need immediate assistance?{' '}
            <a 
              href="mailto:support@credify.com" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrganizationVerificationPending;
