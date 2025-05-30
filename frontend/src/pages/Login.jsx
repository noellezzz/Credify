import React, { useState } from "react";
import TextInput from "../components/inputs/TextInput";
import PrimeButton from "../components/buttons/PrimeButton";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../features/user/userSlice";
import { selectUser } from "../features/user/userSelector";
import Gradient from "../components/gradient/Gradient";
import Logo from "../assets/Credify.png";

const Login = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    try {
      const res = await axios.post("/auth/login", formData);
      if (res.data.message === "Success") {
        Swal.fire({
          title: "Successfully Verified!",
          text: "Redirecting you now...",
          icon: "success",
        });
        dispatch(setUser(res.data.parsedUser));
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (e) {
      if (e.response.data.message === "invalid_credentials") {
        Swal.fire({
          title: "Invalid Credentials",
          text: "Please check your email or password.",
          icon: "error",
        });
      } else if (e.response.data.message === "email_not_confirmed") {
        Swal.fire({
          title: "Account Unverified",
          text: "Please verify your account first.",
          icon: "error",
        });
      }
    }
  };

  const handleReturn = () => {
    navigate("/");
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
        <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-lg min-h-[600px] lg:h-[600px] bg-[var(--tertiary-color)] rounded-2xl lg:rounded-4xl header-shadow flex flex-col items-center p-6 sm:p-8 lg:p-12">
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
                label="Go Back"
                onClick={handleReturn}
                className="w-full sm:w-auto"
              />
              <PrimeButton
                label="Login"
                onClick={handleSubmit}
                className="w-full sm:w-auto"
              />
            </div>

            <div className="border-b w-full my-4"></div>

            <div className="text-center text-sm lg:text-base">
              Don't have an account? &nbsp;
              <Link
                to="/register"
                className="text-[var(--secondary-color)] font-bold hover:underline"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
