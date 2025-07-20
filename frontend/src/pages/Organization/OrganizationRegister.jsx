import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
  registerOrganization, 
  clearError,
  setRegistrationStep,
  updateRegistrationData,
  clearRegistrationData
} from '../../features/organizationAuth/organizationAuthSlice';
import {
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectRegistrationStep,
  selectRegistrationData
} from '../../features/organizationAuth/organizationAuthSelectors';
import TextInput from '../../components/inputs/TextInput';
import PrimeButton from '../../components/buttons/PrimeButton';
import Loader from '../../components/layouts/Loader';

const OrganizationRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const currentStep = useSelector(selectRegistrationStep);
  const registrationData = useSelector(selectRegistrationData);

  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    type: '',
    
    // Step 2: Contact Info
    phone: '',
    website: '',
    description: '',
    
    // Step 3: Address
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: ''
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const organizationTypes = [
    { value: 'university', label: 'University' },
    { value: 'college', label: 'College' },
    { value: 'training_center', label: 'Training Center' },
    { value: 'certification_body', label: 'Certification Body' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'government', label: 'Government' },
    { value: 'nonprofit', label: 'Non-Profit' }
  ];

  useEffect(() => {
    // Load saved registration data
    setFormData(prev => ({ ...prev, ...registrationData }));
  }, [registrationData]);

  useEffect(() => {
    // Save form data to Redux whenever it changes (debounced)
    const timeoutId = setTimeout(() => {
      dispatch(updateRegistrationData(formData));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData, dispatch]);

  useEffect(() => {
    // Clear any existing errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/organization/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Organization name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.type) {
      errors.type = 'Please select an organization type';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors = {};

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      errors.website = 'Please enter a valid website URL (including http:// or https://)';
    }

    if (formData.phone && !/^[\+]?[0-9\s\-\(\)]+$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!formData.description.trim()) {
      errors.description = 'Organization description is required';
    } else if (formData.description.length > 100) {
      errors.description = 'Description must be maximum 100 characters long';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = () => {
    const errors = {};

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      errors.state = 'State/Province is required';
    }

    if (!formData.country.trim()) {
      errors.country = 'Country is required';
    }

    if (!formData.postal_code.trim()) {
      errors.postal_code = 'Postal code is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    // Always save current form data first
    dispatch(updateRegistrationData(formData));
    
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      default:
        isValid = false;
    }

    if (isValid) {
      if (currentStep < 3) {
        dispatch(setRegistrationStep(currentStep + 1));
      }
    }
  };

  const handlePrevious = () => {
    // Save current form data
    dispatch(updateRegistrationData(formData));
    
    if (currentStep > 1) {
      dispatch(setRegistrationStep(currentStep - 1));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep3()) {
      return;
    }

    try {
      const registrationPayload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        organization_type: formData.type, // Changed from 'type' to 'organization_type'
        phone: formData.phone.trim() || null,
        website: formData.website.trim() || null,
        description: formData.description.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        country: formData.country.trim(),
        postal_code: formData.postal_code.trim()
      };

      console.log('Sending registration payload:', registrationPayload);
      console.log('Organization type being sent:', registrationPayload.organization_type);

      const result = await dispatch(registerOrganization(registrationPayload)).unwrap();
      
      // Registration successful - clear registration data
      dispatch(clearRegistrationData());
      
      console.log('Registration successful:', result);
      // Navigation will be handled by useEffect
    } catch (error) {
      console.error('Registration failed:', error);
      // Error will be displayed via the error selector
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step <= currentStep 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-300 text-gray-500'
          }`}>
            {step}
          </div>
          {step < 3 && (
            <div className={`w-16 h-1 mx-2 ${
              step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <TextInput
        id="name"
        name="name"
        type="text"
        label="Organization Name"
        value={formData.name}
        handleChange={handleInputChange}
        error={fieldErrors.name}
        placeholder="Enter your organization name"
      />

      <TextInput
        id="email"
        name="email"
        type="email"
        label="Email Address"
        value={formData.email}
        handleChange={handleInputChange}
        error={fieldErrors.email}
        placeholder="Enter organization email"
      />

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Organization Type *
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            fieldErrors.type ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        >
          <option value="">Select organization type</option>
          {organizationTypes.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        {fieldErrors.type && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.type}</p>
        )}
      </div>

      <TextInput
        id="password"
        name="password"
        type="password"
        label="Password"
        value={formData.password}
        handleChange={handleInputChange}
        error={fieldErrors.password}
        placeholder="Create a strong password"
      />

      <TextInput
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        label="Confirm Password"
        value={formData.confirmPassword}
        handleChange={handleInputChange}
        error={fieldErrors.confirmPassword}
        placeholder="Confirm your password"
      />
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <TextInput
        id="phone"
        name="phone"
        type="tel"
        label="Phone Number"
        value={formData.phone}
        handleChange={handleInputChange}
        error={fieldErrors.phone}
        placeholder="Enter phone number (optional)"
      />

      <TextInput
        id="website"
        name="website"
        type="url"
        label="Website"
        value={formData.website}
        handleChange={handleInputChange}
        error={fieldErrors.website}
        placeholder="https://www.example.com (optional)"
      />

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Organization Description *
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            fieldErrors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe your organization, its mission, and activities (maximum 100 characters)"
          required
        />
        <div className="mt-1 text-sm text-gray-500">
          {formData.description.length}/100 characters maximum
        </div>
        {fieldErrors.description && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.description}</p>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <TextInput
        id="address"
        name="address"
        type="text"
        label="Street Address"
        value={formData.address}
        handleChange={handleInputChange}
        error={fieldErrors.address}
        placeholder="Enter street address"
      />

      <div className="grid grid-cols-2 gap-4">
        <TextInput
          id="city"
          name="city"
          type="text"
          label="City"
          value={formData.city}
          handleChange={handleInputChange}
          error={fieldErrors.city}
          placeholder="Enter city"
        />

        <TextInput
          id="state"
          name="state"
          type="text"
          label="State/Province"
          value={formData.state}
          handleChange={handleInputChange}
          error={fieldErrors.state}
          placeholder="Enter state/province"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextInput
          id="country"
          name="country"
          type="text"
          label="Country"
          value={formData.country}
          handleChange={handleInputChange}
          error={fieldErrors.country}
          placeholder="Enter country"
        />

        <TextInput
          id="postal_code"
          name="postal_code"
          type="text"
          label="Postal Code"
          value={formData.postal_code}
          handleChange={handleInputChange}
          error={fieldErrors.postal_code}
          placeholder="Enter postal code"
        />
      </div>
    </div>
  );

  if (loading) {
    return <Loader />;
  }

  const stepTitles = {
    1: 'Basic Information',
    2: 'Contact Details',
    3: 'Address Information'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-auto flex justify-center">
            <img
              className="h-12 w-auto"
              src="/src/assets/Credify.png"
              alt="Credify"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register Organization
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Step {currentStep} of 3: {stepTitles[currentStep]}
          </p>
        </div>

        {renderStepIndicator()}

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Registration Failed
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={currentStep === 3 ? handleSubmit : (e) => e.preventDefault()}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <div className="flex justify-between space-x-4">
            {currentStep > 1 && (
              <PrimeButton
                type="button"
                onClick={handlePrevious}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Previous
              </PrimeButton>
            )}

            <PrimeButton
              type={currentStep === 3 ? "submit" : "button"}
              onClick={currentStep === 3 ? undefined : handleNext}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {currentStep === 3 ? 'Creating Account...' : 'Processing...'}
                </>
              ) : (
                currentStep === 3 ? 'Create Account' : 'Next'
              )}
            </PrimeButton>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Already have an organization account?{' '}
              <Link
                to="/organization/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in here
              </Link>
            </span>
          </div>

          <div className="text-center pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">
              Are you a student or individual?{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Register here
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationRegister;
