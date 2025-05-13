import React, { useState } from "react";
import { useAuthenticationStore } from "../store/useAuthenticationStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, KeyRound, Loader2, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

//Login page for when users log in.
const LoginPage = () => {
  // Manage visibility state for the password field.
  const [showPassword, setShowPassword] = useState(false);
  // Local state to hold email and password inputs.
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Retrieve the login action and the login status from the auth store.
  const { login, isLoggingIn } = useAuthenticationStore();

  // Handle form submission and trigger login.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission.
    login(formData); // Call the login function with user-provided data.
  };
  return (
    <div className="min-h-screen">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and introduction text. */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <h1 className="text-2xl font-bold mt-2">Log Into Your Account</h1>
              <p className="text-base-content/60">
                Enjoy Chating with your Friends and Family.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email input field with icon. */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="flex">
                <Mail className="m-auto border-1 size-8" />
                <input
                  type="email"
                  className="input input-bordered w-full mx-1"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password input with toggle visibility. */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="flex">
                <KeyRound className="m-auto border-1 size-8" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full mx-1"
                  placeholder="*********"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="flex items-center justify-center m-auto border border-gray-400 rounded-sm size-9.5 hover:bg-gray-500 hover:border-gray-600 transition-all duration-300 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="hover:cursor-pointer" />
                  ) : (
                    <Eye className="hover:cursor-pointer" />
                  )}
                </button>
              </div>
            </div>

            {/* Submission button with a loading indicator. */}
            <button
              type="submit"
              className="btn btn-primary w-full mt-4"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Redirect users to the sign-up page if they do not have an account. */}
          <div className="text-center">
            <p className="text-base-content/60">
              Don't have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Sign Up
              </Link>
              .
            </p>
          </div>
          <p className="text-center mt-4">
            <Link to="/admin/login" className="link">
              Login As Administrator
            </Link>
          </p>
        </div>

        {/*Sign in with Google. */}
        <div className="flex flex-col items-center gap-2 mt-4">
          <a
            href="http://localhost:5001/api/auth/google"
            className="btn btn-outline w-full flex items-center justify-center gap-2"
          >
            <FcGoogle size={20} />
            Sign in with Google
          </a>
          <a
            href="http://localhost:5001/api/auth/github"
            className="btn btn-outline w-full flex items-center justify-center gap-2 mt-4"
          >
            <FaGithub size={20} />
            Continue with GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
