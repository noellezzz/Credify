import React, { useState, useEffect } from "react";
import TextInput from "../components/inputs/TextInput";
import PrimeButton from "../components/buttons/PrimeButton";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import Swal from "sweetalert2";
import Gradient from "../components/gradient/Gradient";
import Logo from "../assets/Credify.png";

const SchoolRegister = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    schoolName: "",
    schoolType: "",
    address: "",
    city: "",
    province: "",
    zipCode: "",
    phoneNumber: "",
    principalName: "",
    principalEmail: "",
    principalPhone: "",
    establishedYear: "",
    studentCapacity: "",
    website: "",
    // Documents (will be converted to base64)
    depedCertificate: null,
    secCertificate: null,
    birCertificate: null,
    businessPermit: null,
    websiteOrFacebook: "",
    letterheadSample: null,
    principalId: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isStep1Valid, setIsStep1Valid] = useState(false);
  const [isStep2Valid, setIsStep2Valid] = useState(false);
  const navigate = useNavigate();

  const totalSteps = 2;

  // Step 1 validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(formData.email);
    const isPasswordValid = formData.password.length >= 6;
    const isSchoolNameValid = formData.schoolName.trim().length >= 2;
    const isSchoolTypeValid = formData.schoolType.trim().length >= 2;
    const isAddressValid = formData.address.trim().length >= 5;
    const isCityValid = formData.city.trim().length >= 2;
    const isProvinceValid = formData.province.trim().length >= 2;
    const isZipCodeValid = formData.zipCode.trim().length >= 4;
    const isPhoneValid = formData.phoneNumber.trim().length >= 10;
    const isPrincipalNameValid = formData.principalName.trim().length >= 2;
    const isPrincipalEmailValid = emailRegex.test(formData.principalEmail);
    const isPrincipalPhoneValid = formData.principalPhone.trim().length >= 10;
    const isEstablishedYearValid = formData.establishedYear.trim().length === 4;
    const isStudentCapacityValid = formData.studentCapacity.trim().length >= 1;

    setIsStep1Valid(
      isEmailValid &&
        isPasswordValid &&
        isSchoolNameValid &&
        isSchoolTypeValid &&
        isAddressValid &&
        isCityValid &&
        isProvinceValid &&
        isZipCodeValid &&
        isPhoneValid &&
        isPrincipalNameValid &&
        isPrincipalEmailValid &&
        isPrincipalPhoneValid &&
        isEstablishedYearValid &&
        isStudentCapacityValid
    );
  }, [formData]);

  // Step 2 validation
  useEffect(() => {
    const hasDepedCert = formData.depedCertificate !== null;
    const hasSecCert = formData.secCertificate !== null;
    const hasBirCert = formData.birCertificate !== null;
    const hasBusinessPermit = formData.businessPermit !== null;
    const hasWebsiteOrFacebook = formData.websiteOrFacebook.trim().length >= 5;
    const hasLetterhead = formData.letterheadSample !== null;
    const hasPrincipalId = formData.principalId !== null;

    setIsStep2Valid(
      hasDepedCert &&
        hasSecCert &&
        hasBirCert &&
        hasBusinessPermit &&
        hasWebsiteOrFacebook &&
        hasLetterhead &&
        hasPrincipalId
    );
  }, [formData]);

  const validateStep1 = () => {
    const newErrors = {};
    console.log("validating");
    if (!formData.schoolName.trim()) {
      newErrors.schoolName = "School name is required";
    } else if (formData.schoolName.trim().length < 2) {
      newErrors.schoolName = "School name must be at least 2 characters";
    }

    if (!formData.schoolType.trim()) {
      newErrors.schoolType = "School type is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.trim().length < 5) {
      newErrors.address = "Address must be at least 5 characters";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.province.trim()) {
      newErrors.province = "Province is required";
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required";
    } else if (formData.zipCode.trim().length < 4) {
      newErrors.zipCode = "ZIP code must be at least 4 characters";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (formData.phoneNumber.trim().length < 10) {
      newErrors.phoneNumber = "Phone number must be at least 10 characters";
    }

    if (!formData.principalName.trim()) {
      newErrors.principalName = "Principal name is required";
    }

    if (!formData.principalEmail) {
      newErrors.principalEmail = "Principal email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.principalEmail)) {
      newErrors.principalEmail = "Please enter a valid email";
    }

    if (!formData.principalPhone.trim()) {
      newErrors.principalPhone = "Principal phone is required";
    }

    if (!formData.establishedYear.trim()) {
      newErrors.establishedYear = "Established year is required";
    } else if (formData.establishedYear.trim().length !== 4) {
      newErrors.establishedYear = "Please enter a valid year (4 digits)";
    }

    if (!formData.studentCapacity.trim()) {
      newErrors.studentCapacity = "Student capacity is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.depedCertificate) {
      newErrors.depedCertificate = "DepEd/CHED/TESDA Certificate is required";
    }

    if (!formData.secCertificate) {
      newErrors.secCertificate = "SEC Certificate of Incorporation is required";
    }

    if (!formData.birCertificate) {
      newErrors.birCertificate = "BIR Certificate of Registration is required";
    }

    if (!formData.businessPermit) {
      newErrors.businessPermit = "Business Permit is required";
    }

    if (!formData.websiteOrFacebook.trim()) {
      newErrors.websiteOrFacebook = "Website or Facebook page is required";
    }

    if (!formData.letterheadSample) {
      newErrors.letterheadSample =
        "School letterhead or ID card sample is required";
    }

    if (!formData.principalId) {
      newErrors.principalId = "Principal's valid ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      try {
        const base64 = await convertToBase64(files[0]);
        setFormData((prev) => ({
          ...prev,
          [name]: base64,
        }));
      } catch (error) {
        console.error("Error converting file to base64:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (currentStep === 1) {
      if (!validateStep1() || isLoading) return;
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      if (!validateStep2() || isLoading) return;

      setIsLoading(true);

      try {
        console.log(formData);
        const res = await axios.post("/auth/school-register", formData);
        if (res.data.message === "School registration successful") {
          await Swal.fire({
            title: "Welcome to Credify!",
            text: "School registration successful. Redirecting to login...",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            backdrop: "rgba(0,0,0,0.8)",
            customClass: {
              popup: "animate__animated animate__fadeInDown",
            },
          });
          navigate("/login", { replace: true });
        }
      } catch (e) {
        setIsLoading(false);

        if (e.response?.data?.error?.startsWith("For security purposes")) {
          Swal.fire({
            title: "Request Timeout",
            text: e.response.data.error,
            icon: "error",
            backdrop: "rgba(0,0,0,0.8)",
          });
        } else if (
          e.response?.data?.error ===
          'duplicate key value violates unique constraint "schools_email_key"'
        ) {
          Swal.fire({
            title: "Email Already Exists",
            text: "A school with this email already exists. Please use a different email or sign in.",
            icon: "error",
            confirmButtonText: "Go to Login",
            showCancelButton: true,
            cancelButtonText: "Try Different Email",
            backdrop: "rgba(0,0,0,0.8)",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/login");
            }
          });
          setErrors({ email: "This email is already registered" });
        } else {
          Swal.fire({
            title: "Registration Failed",
            text: "Unable to create school account. Please try again.",
            icon: "error",
            backdrop: "rgba(0,0,0,0.8)",
          });
        }
      }
    }
  };

  const handleKeyPress = (e) => {
    if (
      e.key === "Enter" &&
      ((currentStep === 1 && isStep1Valid) ||
        (currentStep === 2 && isStep2Valid)) &&
      !isLoading
    ) {
      handleSubmit(e);
    }
  };

  const handleReturn = () => {
    if (currentStep === 1) {
      navigate("/login");
    } else {
      setCurrentStep(1);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const ProgressBar = () => (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-gray-600">
          {Math.round((currentStep / totalSteps) * 100)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-[var(--secondary-color)] h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-xs text-gray-500">School Information</span>
        <span className="text-xs text-gray-500">Documents</span>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <>
      <div className="w-full space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">
            School Information
          </h3>
          <p className="text-sm text-gray-500">
            Enter your school's basic information
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            label="School Name"
            name="schoolName"
            value={formData.schoolName}
            handleChange={handleChange}
            error={errors.schoolName}
            placeholder="Enter school name"
            disabled={isLoading}
          />
          <TextInput
            label="School Type"
            name="schoolType"
            value={formData.schoolType}
            handleChange={handleChange}
            error={errors.schoolType}
            placeholder="Elementary/High School/College"
            disabled={isLoading}
          />
        </div>

        <TextInput
          maxWidth
          label="Address"
          name="address"
          value={formData.address}
          handleChange={handleChange}
          error={errors.address}
          placeholder="Enter complete address"
          disabled={isLoading}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TextInput
            label="City"
            name="city"
            value={formData.city}
            handleChange={handleChange}
            error={errors.city}
            placeholder="Enter city"
            disabled={isLoading}
          />
          <TextInput
            label="Province"
            name="province"
            value={formData.province}
            handleChange={handleChange}
            error={errors.province}
            placeholder="Enter province"
            disabled={isLoading}
          />
          <TextInput
            label="ZIP Code"
            name="zipCode"
            value={formData.zipCode}
            handleChange={handleChange}
            error={errors.zipCode}
            placeholder="Enter ZIP code"
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            handleChange={handleChange}
            error={errors.phoneNumber}
            placeholder="Enter phone number"
            disabled={isLoading}
          />
          <TextInput
            label="Website (Optional)"
            name="website"
            value={formData.website}
            handleChange={handleChange}
            error={errors.website}
            placeholder="Enter website URL"
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            label="Established Year"
            name="establishedYear"
            value={formData.establishedYear}
            handleChange={handleChange}
            error={errors.establishedYear}
            placeholder="YYYY"
            disabled={isLoading}
          />
          <TextInput
            label="Student Capacity"
            name="studentCapacity"
            value={formData.studentCapacity}
            handleChange={handleChange}
            error={errors.studentCapacity}
            placeholder="Maximum students"
            disabled={isLoading}
          />
        </div>

        <div className="border-t pt-4">
          <h4 className="text-md font-medium text-gray-700 mb-4">
            Principal Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="Principal Name"
              name="principalName"
              value={formData.principalName}
              handleChange={handleChange}
              error={errors.principalName}
              placeholder="Enter principal's name"
              disabled={isLoading}
            />
            <TextInput
              label="Principal Email"
              name="principalEmail"
              type="email"
              value={formData.principalEmail}
              handleChange={handleChange}
              error={errors.principalEmail}
              placeholder="Enter principal's email"
              disabled={isLoading}
            />
          </div>
          <TextInput
            label="Principal Phone"
            name="principalPhone"
            value={formData.principalPhone}
            handleChange={handleChange}
            error={errors.principalPhone}
            placeholder="Enter principal's phone number"
            disabled={isLoading}
          />
        </div>

        <div className="border-t pt-4">
          <h4 className="text-md font-medium text-gray-700 mb-4">
            Login Credentials
          </h4>
          <TextInput
            maxWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            handleChange={handleChange}
            error={errors.email}
            placeholder="Enter your email address"
            autoComplete="email"
            disabled={isLoading}
          />

          <div className="relative">
            <TextInput
              maxWidth
              password={!showPassword}
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              handleChange={handleChange}
              error={errors.password}
              placeholder="Create a password (min. 6 characters)"
              autoComplete="new-password"
              disabled={isLoading}
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-5 text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)] focus:ring-opacity-50"
              disabled={isLoading}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="w-full space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Document Upload
          </h3>
          <p className="text-sm text-gray-500">
            Upload required documents for verification
          </p>
        </div>

        <div className="space-y-4">
          <div className="border rounded-lg p-4 space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              DepEd / CHED / TESDA Certificate *
            </label>
            <p className="text-xs text-gray-500">
              Government accreditation to operate as a school
            </p>
            <input
              type="file"
              name="depedCertificate"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--secondary-color)] file:text-white hover:file:bg-opacity-80"
              disabled={isLoading}
            />
            {errors.depedCertificate && (
              <p className="text-red-500 text-xs">{errors.depedCertificate}</p>
            )}
          </div>

          <div className="border rounded-lg p-4 space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              SEC Certificate of Incorporation *
            </label>
            <p className="text-xs text-gray-500">
              Legal registration of the school as a company or foundation
            </p>
            <input
              type="file"
              name="secCertificate"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--secondary-color)] file:text-white hover:file:bg-opacity-80"
              disabled={isLoading}
            />
            {errors.secCertificate && (
              <p className="text-red-500 text-xs">{errors.secCertificate}</p>
            )}
          </div>

          <div className="border rounded-lg p-4 space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              BIR Certificate of Registration (Form 2303) *
            </label>
            <p className="text-xs text-gray-500">
              Tax registration document from the Bureau of Internal Revenue
            </p>
            <input
              type="file"
              name="birCertificate"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--secondary-color)] file:text-white hover:file:bg-opacity-80"
              disabled={isLoading}
            />
            {errors.birCertificate && (
              <p className="text-red-500 text-xs">{errors.birCertificate}</p>
            )}
          </div>

          <div className="border rounded-lg p-4 space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Mayor's or Business Permit *
            </label>
            <p className="text-xs text-gray-500">
              Local government approval to operate
            </p>
            <input
              type="file"
              name="businessPermit"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--secondary-color)] file:text-white hover:file:bg-opacity-80"
              disabled={isLoading}
            />
            {errors.businessPermit && (
              <p className="text-red-500 text-xs">{errors.businessPermit}</p>
            )}
          </div>

          <div className="border rounded-lg p-4 space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Official Website or Facebook Page *
            </label>
            <p className="text-xs text-gray-500">
              Public online presence for school verification
            </p>
            <input
              type="url"
              name="websiteOrFacebook"
              value={formData.websiteOrFacebook}
              onChange={handleChange}
              placeholder="https://www.facebook.com/YourSchoolOfficial"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)] focus:border-transparent"
              disabled={isLoading}
            />
            {errors.websiteOrFacebook && (
              <p className="text-red-500 text-xs">{errors.websiteOrFacebook}</p>
            )}
          </div>

          <div className="border rounded-lg p-4 space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              School Letterhead or ID Card Sample *
            </label>
            <p className="text-xs text-gray-500">
              Branding proof showing school name and logo
            </p>
            <input
              type="file"
              name="letterheadSample"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--secondary-color)] file:text-white hover:file:bg-opacity-80"
              disabled={isLoading}
            />
            {errors.letterheadSample && (
              <p className="text-red-500 text-xs">{errors.letterheadSample}</p>
            )}
          </div>

          <div className="border rounded-lg p-4 space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Valid ID of School Head *
            </label>
            <p className="text-xs text-gray-500">
              Government-issued ID of the principal or admin
            </p>
            <input
              type="file"
              name="principalId"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--secondary-color)] file:text-white hover:file:bg-opacity-80"
              disabled={isLoading}
            />
            {errors.principalId && (
              <p className="text-red-500 text-xs">{errors.principalId}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="font-poppins w-full min-h-screen">
      <div className="fixed overflow-hidden w-full h-full">
        <Gradient />
      </div>

      <div className="min-h-screen w-full flex items-center justify-center px-4 lg:px-8 py-8">
        <div className="relative z-10 w-full max-w-2xl bg-[var(--tertiary-color)] rounded-2xl lg:rounded-4xl header-shadow flex flex-col items-center p-6 sm:p-8 lg:p-12 transform transition-all duration-500 hover:scale-[1.02] animate__animated animate__fadeInUp">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-4xl flex items-center justify-center z-50">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-[var(--secondary-color)] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">
                  Creating your school account...
                </p>
              </div>
            </div>
          )}

          <div className="text-center mb-6 lg:mb-8">
            <div className="flex flex-col items-center space-y-2 mb-4">
              <div className="w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32 transition-transform duration-300 hover:scale-110">
                <img
                  src={Logo}
                  alt="Credify"
                  className="w-full h-auto drop-shadow-sm"
                />
              </div>
            </div>
            <div className="text-xs sm:text-[13px] uppercase -mt-1 lg:-mt-2 text-gray-600 animate__animated animate__fadeIn animate__delay-1s">
              Register your school with Credify
            </div>
          </div>

          <ProgressBar />

          <form
            onSubmit={handleSubmit}
            className="flex flex-col flex-grow w-full justify-center items-center space-y-4 lg:space-y-6"
            onKeyPress={handleKeyPress}
          >
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}

            <div className="w-full flex flex-col sm:flex-row gap-2 mt-6">
              <PrimeButton
                secondary
                label={currentStep === 1 ? "Back to Login" : "Previous"}
                onClick={handleReturn}
                className="w-full sm:w-auto transition-all duration-300 hover:scale-105 disabled:opacity-50"
                disabled={isLoading}
              />
              <PrimeButton
                type="submit"
                label={
                  isLoading
                    ? "Creating Account..."
                    : currentStep === 1
                    ? "Next: Upload Documents"
                    : "Register School"
                }
                onClick={handleSubmit}
                className={`w-full sm:w-auto transition-all duration-300 hover:scale-105 ${
                  ((currentStep === 1 && isStep1Valid) ||
                    (currentStep === 2 && isStep2Valid)) &&
                  !isLoading
                    ? "hover:shadow-lg transform hover:translate-y-[-1px]"
                    : "opacity-50 cursor-not-allowed"
                }`}
                disabled={
                  (currentStep === 1 && !isStep1Valid) ||
                  (currentStep === 2 && !isStep2Valid) ||
                  isLoading
                }
              />
            </div>

            <div className="border-b w-full my-4 opacity-30"></div>

            <div className="text-center text-sm lg:text-base transition-all duration-300 hover:scale-105">
              Already have an account? &nbsp;
              <Link
                to="/login"
                className="text-[var(--secondary-color)] font-bold hover:underline transition-all duration-200 hover:text-opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)] focus:ring-opacity-50 rounded px-1"
              >
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SchoolRegister;
