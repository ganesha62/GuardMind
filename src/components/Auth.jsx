import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../components/Config.js';
import { motion } from 'framer-motion';

function Auth({ setIsLoggedIn }) {
  const [isLogin, setIsLogin] = useState(true);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      let response;
      if (isLogin) {
        const formData = new FormData();
        formData.append('username', data.username);
        localStorage.setItem('username', data.username);
        formData.append('password', data.password);
        response = await apiClient.post('/token', formData, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
      } else {
        response = await apiClient.post('/register', data);
      }
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('userId', response.data.user_id);
      setIsLoggedIn(true);
      navigate('/');
    } catch (error) {
      alert('Authentication error: Incorrect credentials');
      console.error('Authentication error:', error.response ? error.response.data : error.message);
    }
  };

  const continueAsGuest = () => {
    localStorage.setItem('username', 'guest');
    localStorage.setItem('token', 'guest-token');
    setIsLoggedIn(true);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-indigo-900 to-purple-900 p-4">
      <nav className="bg-gray-900 p-4 shadow-lg">
        <h1 className="text-xl sm:text-2xl font-bold text-center text-white">
          GUARDMIND - AN AI-POWERED MENTAL HEALTH SUPPORT PLATFORM
        </h1>
      </nav>
      <div className="flex-grow flex items-center justify-center p-4" >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            {isLogin ? 'Login to GuardMind' : 'Register for GuardMind'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                {...register('username', { required: 'Username is required' })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200"
              />
              {errors.username && <span className="text-red-500 text-sm mt-1">{errors.username.message}</span>}
            </div>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200"
                />
                {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200"
              />
              {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>}
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
            </button>
          </div>
          <div className="mt-6">
            <button
              onClick={continueAsGuest}
              className="w-full py-2 px-4 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
            >
              Continue as Guest
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Auth;