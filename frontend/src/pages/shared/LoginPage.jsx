import { useEffect, useState } from "react";
import Logo from "../../components/Logo";
import { FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import useAuthStore from "../../stores/useAuthStore.js";
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const [credential, setCredential] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, resetSessionExpired } = useAuthStore(); // Using the auth store for login

  useEffect(() => {
    resetSessionExpired();
  }, [resetSessionExpired]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = credential;

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await login(credential.email, credential.password);
      
      if (response.success) {
        toast.success("Login successful!");
      } else {
        toast.error(response.message || "Login failed.");
      }
    } catch {
      toast.error("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Logo />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
              <p className="text-gray-600 text-sm">
                Sign in to access your QuickStock dashboard
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-left block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={credential.email}
                  onChange={(e) => setCredential({ ...credential, email: e.target.value })}
                  placeholder="Enter your email"
                  required
                  className="text-black w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">📧</span>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className=" text-left block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={credential.password}
                  onChange={(e) => setCredential({ ...credential, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                  className="text-black w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash className="h-4 w-4 hover:cursor-pointer" /> : <FaEye className="h-4 w-4 hover:cursor-pointer" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 hover:cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <FaSignInAlt className="h-4 w-4" />
                </>
              )}
            </button>
            {/* Create Account Link */}
            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">Don't have an account? </span>
              <a href="/register" className="text-orange-600 hover:underline font-semibold">Create Account</a>
            </div>
          </form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Protected by enterprise-grade security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;