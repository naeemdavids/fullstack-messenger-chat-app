import React, { useState } from "react";
import { useAuthenticationStore } from "../store/useAuthenticationStore";
import { Eye, EyeOff, KeyRound, Loader2, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

//The sign up if you want to use the app.
const SignUpPage = () => {
  // Toggle for showing/hiding the password for better UX.
  const [showPassword, setShowPassword] = useState(false);
  // Local state to manage user inputs for sign-up.
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // Retrieve the sign-up function and sign-up loading state.
  const { signUp, isSigningUp } = useAuthenticationStore();

  // Custom form validation to ensure all required fields and formats are correct.
  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full Name Required");
    if (!formData.email.trim()) return toast.error("Email Required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Incorrect Email Format");
    if (!formData.password) return toast.error("Password is Required");
    if (!formData.password.length > 6)
      return toast.error("Password must be longer then 6 characters");
    return true;
  };

  // Process the form submission and trigger the sign-up process if validation passes.
  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signUp(formData);
  };

  return (
    <div className="min-h-screen">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header section introducing the sign-up form. */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <h1 className="text-2xl font-bold mt-2">Create an Account</h1>
              <p className="text-base-content/60">
                Enjoy Chating with your Friends and Family.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name input with icon. */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="flex">
                <User className="m-auto border-1 size-8" />
                <input
                  type="text"
                  className="input input-bordered w-full mx-1"
                  placeholder="Naeem Davids"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Email input with icon. */}
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

            {/* Password input with toggle for visibility. */}
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

            {/* Submit button shows a loader while processing. */}
            <button
              type="submit"
              className="btn btn-primary w-full mt-4"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Provide a link for users who already have an account. */}
          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Login
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
        {/*Sign up with Google. */}
        <div className="flex flex-col items-center gap-2 mt-4">
          <a
            href="http://localhost:5001/api/auth/google"
            className="btn btn-outline w-full flex items-center justify-center gap-2"
          >
            <FcGoogle size={20} />
            Sign up with Google
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

export default SignUpPage;
