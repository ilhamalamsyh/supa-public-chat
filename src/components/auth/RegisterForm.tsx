import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/auth/authStore";
import Button from "../ui/Button";
import Input from "../ui/Input";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "../../utils/validation";

const RegisterForm: React.FC = () => {
  const { signUp, signIn, isLoading, error, clearError, isAuthenticated } =
    useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    name?: string;
  }>({});
  const [autoLoginError, setAutoLoginError] = useState<string | null>(null);

  useEffect(() => {
    clearError();
    if (isAuthenticated || localStorage.getItem("auth_token")) {
      window.location.replace("/chat");
    }
  }, [clearError, isAuthenticated]);

  // Redirect to /chat after successful registration
  useEffect(() => {
    if (isAuthenticated) {
      window.location.replace("/chat");
    }
  }, [isAuthenticated]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
      name?: string;
    } = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Name validation
    const nameValidation = validateName(formData.name);
    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (!nameValidation.isValid) {
      newErrors.name = nameValidation.errors[0];
    }

    // Password validation
    const passwordValidation = validatePassword(formData.password);
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setAutoLoginError(null);
    await signUp({
      email: formData.email,
      password: formData.password,
      username: formData.name,
    });
    // Auto-login after successful registration
    const loginResult = await signIn({
      email: formData.email,
      password: formData.password,
    });
    // Debug log
    console.log("Auto-login result after register:", loginResult);
    if (!localStorage.getItem("auth_token")) {
      setAutoLoginError(
        "Auto-login failed after registration. Please try logging in manually."
      );
    }
  };

  const userIcon = (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );

  const emailIcon = (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
      />
    </svg>
  );

  const passwordIcon = (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );

  const lockIcon = (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background-main">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-purple rounded-2xl flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Join ChatApp</h2>
          <p className="text-gray-300">
            Create your account and start chatting with others
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-background-card/90 backdrop-blur-sm rounded-2xl shadow-xl border border-background-main p-8">
          <form onSubmit={handleSubmit} className="space-y-6" method="post">
            {error && (
              <div className="bg-red-900/10 border border-red-900/30 rounded-xl p-4">
                <div className="flex">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="ml-3 text-sm text-red-300">{error}</p>
                </div>
              </div>
            )}
            {autoLoginError && (
              <div className="bg-red-900/10 border border-red-900/30 rounded-xl p-4 mt-2">
                <div className="flex">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="ml-3 text-sm text-red-300">{autoLoginError}</p>
                </div>
              </div>
            )}

            <Input
              label="Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              error={errors.name}
              icon={userIcon}
              helperText="3-50 characters, letters and spaces only"
              required
            />

            <Input
              label="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              error={errors.email}
              icon={emailIcon}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              error={errors.password}
              icon={passwordIcon}
              helperText="At least 6 characters with uppercase, lowercase, and number"
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              error={errors.confirmPassword}
              icon={lockIcon}
              required
            />

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Create account
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background-card text-gray-400">
                  Already have an account?
                </span>
              </div>
            </div>
          </div>

          {/* Sign in link */}
          <div className="mt-6 text-center">
            <a
              href="/login"
              className="text-primary-purple hover:text-primary-purple-dark font-medium transition-colors"
            >
              Sign in to your account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
