import React, { useState } from 'react';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../stores/useUserStore.js';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const role = 'supplier'; // Fixed role for registration
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const createUser = useUserStore((state) => state.createUser);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const result = await createUser({ email, password, role });
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => navigate('/login'), 1500);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Logo />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Create Your Account</h1>
              <p className="text-gray-600 text-sm">
                Register to access your QuickStock dashboard
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-500 text-center text-sm">{error}</div>}
            {success && <div className="text-green-500 text-center text-sm">{success}</div>}
            <div className="space-y-2">
              <label className="text-left block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="text-black w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-left block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="text-black w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] hover:cursor-pointer"
            >
              Register
            </button>
          </form>
          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">Already have an account? </span>
            <a href="/" className="text-orange-600 hover:underline font-semibold">Sign In</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 