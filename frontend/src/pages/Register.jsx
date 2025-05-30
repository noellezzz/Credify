import React, { useState } from "react";
import TextInput from "../components/inputs/TextInput";
import PrimeButton from "../components/buttons/PrimeButton";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import Swal from "sweetalert2";
import Gradient from "../components/gradient/Gradient";
import Logo from "../assets/Credify.png";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await axios.post("/auth/register", formData);
      if (res.data.message === "Register successful") {
        Swal.fire({
          title: "Successfully Registered!",
          text: "Redirecting you to login page...",
          icon: "success",
        });

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (e) {
      if (e.response.data.error.startsWith("For security purposes")) {
        Swal.fire({
          title: "Request Timeout",
          text: e.response.data.error,
          icon: "error",
        });
      } else if (
        e.response.data.error ===
        'duplicate key value violates unique constraint "users_email_key"'
      ) {
        Swal.fire({
          title: "Email Already Exists",
          text: "Please login using the email you entered or enter a new email.",
          icon: "error",
        });
      }
    }
  };

  const handleReturn = () => {
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="font-poppins w-full h-screen">
      <div className="fixed overflow-hidden w-full h-full">
        <Gradient />
      </div>

      <div className="h-full w-full flex items-center justify-center lg:justify-center px-4 lg:px-8">
        <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-lg min-h-[600px] lg:h-[650px] bg-[var(--tertiary-color)] rounded-2xl lg:rounded-4xl header-shadow flex flex-col items-center p-6 sm:p-8 lg:p-12">
          <div className="text-center mb-6 lg:mb-8">
            <div className="flex flex-col items-center space-y-2 mb-4">
              {/* Responsive Logo Container */}
              <div className="w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32">
                <img
                  src={Logo}
                  alt="Credify"
                  className="w-full h-auto drop-shadow-sm"
                />
              </div>
            </div>
            <div className="text-xs sm:text-[13px] uppercase -mt-1 lg:-mt-2 text-gray-600">
              Verify your certificates with Credify
            </div>
          </div>

          <div className="flex flex-col flex-grow w-full justify-center items-center space-y-4 lg:space-y-6">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
              <TextInput
                label="First Name"
                name="firstname"
                value={formData.firstname}
                handleChange={handleChange}
              />
              <TextInput
                label="Last Name"
                name="lastname"
                value={formData.lastname}
                handleChange={handleChange}
              />
            </div>

            <TextInput
              maxWidth
              label="Email"
              name="email"
              value={formData.email}
              handleChange={handleChange}
            />

            <TextInput
              maxWidth
              password
              label="Password"
              name="password"
              value={formData.password}
              handleChange={handleChange}
            />

            <div className="w-full flex flex-col sm:flex-row gap-2 mt-4 lg:mt-6">
              <PrimeButton
                secondary
                label="Sign In"
                onClick={handleReturn}
                className="w-full sm:w-auto"
              />
              <PrimeButton
                label="Register"
                onClick={handleSubmit}
                className="w-full sm:w-auto"
              />
            </div>

            <div className="border-b w-full my-4"></div>

            <div className="text-center text-sm lg:text-base">
              Already have an account? &nbsp;
              <Link
                to="/login"
                className="text-[var(--secondary-color)] font-bold hover:underline"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
