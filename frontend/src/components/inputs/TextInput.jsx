import React, { useState } from "react";

const TextInput = ({
  maxWidth,
  label,
  password,
  value,
  handleChange,
  name,
  error,
  placeholder,
  type = "text",
  autoComplete,
  disabled,
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const shouldFloat = isFocused || value;
  const inputId = `input-${name}`;
  const hasError = error && error.length > 0;

  return (
    <div className={`relative ${maxWidth ? "w-full" : ""} mt-2 ${className}`}>
      <label
        htmlFor={inputId}
        className={`absolute left-4 px-1 transition-all duration-200 bg-white cursor-text z-10
          ${shouldFloat ? "text-xs -top-2" : "text-sm top-4"}
          ${
            hasError
              ? "text-red-500"
              : isFocused
              ? "text-[var(--secondary-color)]"
              : "text-gray-500"
          }`}
      >
        {label}
      </label>

      <input
        id={inputId}
        type={password ? "password" : type}
        name={name}
        placeholder={shouldFloat ? placeholder : ""}
        autoComplete={autoComplete}
        disabled={disabled}
        className={`border p-2 pt-5 rounded-lg w-full focus:outline-none transition-all duration-200
          ${
            hasError
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-[var(--secondary-color)] focus:ring-2 focus:ring-[var(--secondary-color)] focus:ring-opacity-20"
          }
          ${disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : "bg-white"}
        `}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={value}
        onChange={handleChange}
      />

      {hasError && (
        <div className="mt-1 flex items-center">
          <svg
            className="w-4 h-4 text-red-500 mr-1 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-red-500 text-xs">{error}</p>
        </div>
      )}
    </div>
  );
};

export default TextInput;
