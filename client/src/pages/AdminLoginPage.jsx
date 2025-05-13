import React, { useState } from "react";
import { useAuthenticationStore } from "../store/useAuthenticationStore";
import { Link } from "react-router-dom";
import { Mail, KeyRound, Eye, EyeOff, Loader2 } from "lucide-react";

//Seperate Login page for the admin.
const AdminLoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuthenticationStore();

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form default.
    login(formData); // Use same login action.
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>

        {/* Email input. */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <div className="flex items-center">
            <Mail className="size-6" />
            <input
              type="text"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="boss@gmail.com"
              className="input input-bordered w-full ml-2"
              required
            />
          </div>
        </div>

        {/* Password input. */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <div className="flex items-center">
            <KeyRound className="size-6" />
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="boss1234"
              className="input input-bordered w-full ml-2"
              required
            />
            <button
              type="button"
              className="ml-2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        {/* Submit button. */}
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Loading...
            </>
          ) : (
            "Login"
          )}
        </button>

        <p className="text-sm text-center">
          Back to{" "}
          <Link to="/login" className="link">
            User Login
          </Link>
          .
        </p>
      </form>
    </div>
  );
};

export default AdminLoginPage;
