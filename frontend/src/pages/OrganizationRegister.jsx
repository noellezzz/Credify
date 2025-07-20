import React, { useState, useEffect } from "react";
import TextInput from "../components/inputs/TextInput";
import PrimeButton from "../components/buttons/PrimeButton";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import Swal from "sweetalert2";
import Gradient from "../components/gradient/Gradient";
import Logo from "../assets/Credify.png";

const OrganizationRegister = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    organizationName: "",
    organizationType: "university",
    address: "",
    city: "",
    province: "",
    zipCode: "",
    phoneNumber: "",
    contactPersonName: "",
    contactPersonEmail: "",
    contactPersonPhone: "",
    establishedYear: "",
    website: "",
    description: "",
    // Documents (will be converted to base64)
    registrationCertificate: null,
    businessPermit: null,
    taxCertificate: null,
    accreditationDocument: null,
    letterheadSample: null,
    contactPersonId: null,
    logo: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isStep1Valid, setIsStep1Valid] = useState(false);
  const [isStep2Valid, setIsStep2Valid] = useState(false);
  const navigate = useNavigate();

  const totalSteps = 3;

  // Step 1 validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(formData.email);
    const isPasswordValid = formData.password.length >= 6;
    const isOrgNameValid = formData.organizationName.trim().length >= 3;

    setIsStep1Valid(isEmailValid && isPasswordValid && isOrgNameValid);
  }, [formData.email, formData.password, formData.organizationName]);

  // Step 2 validation
  useEffect(() => {
    const isAddressValid = formData.address.trim().length >= 5;
    const isCityValid = formData.city.trim().length >= 2;
    const isProvinceValid = formData.province.trim().length >= 2;
    const isPhoneValid = formData.phoneNumber.trim().length >= 10;
    const isContactNameValid = formData.contactPersonName.trim().length >= 3;
    const isContactEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactPersonEmail);
    const isContactPhoneValid = formData.contactPersonPhone.trim().length >= 10;

    setIsStep2Valid(
      isAddressValid && 
      isCityValid && 
      isProvinceValid && 
      isPhoneValid && 
      isContactNameValid && 
      isContactEmailValid && 
      isContactPhoneValid
    );
  }, [
    formData.address,
    formData.city,
    formData.province,
    formData.phoneNumber,
    formData.contactPersonName,
    formData.contactPersonEmail,
    formData.contactPersonPhone,
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [name]: 'File size must be less than 5MB'
        }));
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          [name]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post('/organizations/register', formData);
      
      Swal.fire({
        title: 'Registration Successful!',
        text: 'Your organization has been registered. Please wait for verification.',
        icon: 'success',
        confirmButtonText: 'Continue to Login',
        confirmButtonColor: '#4a5d23',
      }).then(() => {
        navigate('/login');
      });
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        Swal.fire({
          title: 'Registration Failed',
          text: error.response?.data?.message || 'An error occurred during registration',
          icon: 'error',
          confirmButtonColor: '#4a5d23',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const organizationTypes = [
    { value: "university", label: "University" },
    { value: "college", label: "College" },
    { value: "training_center", label: "Training Center" },
    { value: "certification_body", label: "Certification Body" },
    { value: "corporate", label: "Corporate" },
    { value: "government", label: "Government" },
    { value: "nonprofit", label: "Non-Profit" },
    { value: "other", label: "Other" },
  ];

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Basic Information</h2>
        <p className="text-gray-600">Let's start with your organization's basic details</p>
      </div>

      <TextInput
        label="Organization Name"
        name="organizationName"
        value={formData.organizationName}
        onChange={handleInputChange}
        placeholder="Enter your organization name"
        required
        error={errors.organizationName}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Organization Type *
        </label>
        <select
          name="organizationType"
          value={formData.organizationType}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent"
          required
        >
          {organizationTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.organizationType && (
          <p className="mt-1 text-sm text-red-600">{errors.organizationType}</p>
        )}
      </div>

      <TextInput
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="organization@example.com"
        required
        error={errors.email}
      />

      <div className="relative">
        <TextInput
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Create a strong password"
          required
          error={errors.password}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent resize-none"
          placeholder="Brief description of your organization..."
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Location & Contact</h2>
        <p className="text-gray-600">Provide your organization's location and contact information</p>
      </div>

      <TextInput
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleInputChange}
        placeholder="Complete address"
        required
        error={errors.address}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TextInput
          label="City"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          placeholder="City"
          required
          error={errors.city}
        />
        <TextInput
          label="Province"
          name="province"
          value={formData.province}
          onChange={handleInputChange}
          placeholder="Province"
          required
          error={errors.province}
        />
        <TextInput
          label="ZIP Code"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleInputChange}
          placeholder="ZIP Code"
          error={errors.zipCode}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          placeholder="Organization phone"
          required
          error={errors.phoneNumber}
        />
        <TextInput
          label="Website"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
          placeholder="https://example.com"
          error={errors.website}
        />
      </div>

      <TextInput
        label="Established Year"
        name="establishedYear"
        type="number"
        value={formData.establishedYear}
        onChange={handleInputChange}
        placeholder="Year established"
        error={errors.establishedYear}
      />

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Person Information</h3>
        
        <TextInput
          label="Contact Person Name"
          name="contactPersonName"
          value={formData.contactPersonName}
          onChange={handleInputChange}
          placeholder="Full name of contact person"
          required
          error={errors.contactPersonName}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Contact Person Email"
            name="contactPersonEmail"
            type="email"
            value={formData.contactPersonEmail}
            onChange={handleInputChange}
            placeholder="contact@example.com"
            required
            error={errors.contactPersonEmail}
          />
          <TextInput
            label="Contact Person Phone"
            name="contactPersonPhone"
            value={formData.contactPersonPhone}
            onChange={handleInputChange}
            placeholder="Contact person phone"
            required
            error={errors.contactPersonPhone}
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Documents</h2>
        <p className="text-gray-600">Upload required documents for verification</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Registration Certificate *
          </label>
          <input
            type="file"
            name="registrationCertificate"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent"
            required
          />
          {errors.registrationCertificate && (
            <p className="mt-1 text-sm text-red-600">{errors.registrationCertificate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Permit *
          </label>
          <input
            type="file"
            name="businessPermit"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent"
            required
          />
          {errors.businessPermit && (
            <p className="mt-1 text-sm text-red-600">{errors.businessPermit}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tax Certificate
          </label>
          <input
            type="file"
            name="taxCertificate"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Accreditation Document
          </label>
          <input
            type="file"
            name="accreditationDocument"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Letterhead Sample
          </label>
          <input
            type="file"
            name="letterheadSample"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organization Logo
          </label>
          <input
            type="file"
            name="logo"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Person ID *
          </label>
          <input
            type="file"
            name="contactPersonId"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent"
            required
          />
          {errors.contactPersonId && (
            <p className="mt-1 text-sm text-red-600">{errors.contactPersonId}</p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> All documents will be reviewed by our verification team. 
          Please ensure all documents are clear and valid. The verification process may take 3-5 business days.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Gradient />
      
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#4a5d23] text-white p-8 text-center">
          <img src={Logo} alt="Credify" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Organization Registration</h1>
          <p className="text-green-100 mt-2">Join our certificate verification platform</p>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-center items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step ? 'bg-white text-[#4a5d23]' : 'bg-green-600 text-white'
                  }`}>
                    {step}
                  </div>
                  {step < totalSteps && (
                    <div className={`w-8 h-1 mx-2 ${
                      currentStep > step ? 'bg-white' : 'bg-green-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-2 space-x-8">
              <span className="text-xs text-green-100">Basic Info</span>
              <span className="text-xs text-green-100">Contact</span>
              <span className="text-xs text-green-100">Documents</span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !isStep1Valid) ||
                  (currentStep === 2 && !isStep2Valid)
                }
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  (currentStep === 1 && !isStep1Valid) ||
                  (currentStep === 2 && !isStep2Valid)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-[#4a5d23] text-white hover:bg-[#3a4d1a]'
                }`}
              >
                Next
              </button>
            ) : (
              <PrimeButton
                type="submit"
                disabled={isLoading}
                className="px-8 py-3"
              >
                {isLoading ? "Registering..." : "Complete Registration"}
              </PrimeButton>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-[#4a5d23] hover:text-[#3a4d1a] font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrganizationRegister;
