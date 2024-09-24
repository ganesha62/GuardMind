import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {apiClient} from '../components/Config.js';

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
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          });
        } else {
          response = await apiClient.post('/register', data);
        }
        localStorage.setItem('token', response.data.access_token);

        setIsLoggedIn(true);
        navigate('/'); // Redirect to homepage after successful login/register
      } catch (error) {
        alert('Authentication error: Incorrect credentials');
        console.error('Authentication error:', error.response ? error.response.data : error.message);
      }
    };

    const continueAsGuest = () => {
      localStorage.setItem('username', 'guest');
      localStorage.setItem('token', 'guest-token'); // You might want to generate a unique token for guests
      setIsLoggedIn(true);
      navigate('/');
    };

    return (
      <div className="min-h-screen flex flex-col">
        <nav className="bg-blackishbg p-4 shadow-md">
          <h1 className="text-xl sm:text-2xl font-bold text-center text-white">GUARDMIND- AN AI-POWERED MENTAL HEALTH SUPPORT PLATFORM</h1>
        </nav>
        <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-blackishbg to-blackishbginside p-4" style={{backgroundImage: 'url(https://thumbs.dreamstime.com/b/mental-fitness-word-cloud-white-background-mental-fitness-word-cloud-108487964.jpg)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-dark-maroon">
              {isLogin ? 'Login to GuardMind' : 'Register for GuardMind'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  {...register('username', { required: 'Username is required' })}
                  className="mt-1 block w-full rounded-md border border-black shadow-sm focus:border-dark-maroon focus:ring focus:ring-dark-maroon focus:ring-opacity-50"
                />
                {errors.username && <span className="text-red-500 text-xs">{errors.username.message}</span>}
              </div>
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                    className="mt-1 block w-full rounded-md border border-black shadow-sm focus:border-dark-maroon focus:ring focus:ring-dark-maroon focus:ring-opacity-50"
                  />
                  {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                  className="mt-1 block w-full rounded-md border border-black shadow-sm focus:border-dark-maroon focus:ring focus:ring-dark-maroon focus:ring-opacity-50"
                />
                {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-dark-maroon hover:bg-light-maroon focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark-maroon"
              >
                {isLogin ? 'Login' : 'Register'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-dark-maroon hover:text-light-maroon"
              >
                {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
              </button>
            </div>
            <div className="mt-4">
              <button
                onClick={continueAsGuest}
                className="w-full py-2 px-4 border border-dark-maroon rounded-md shadow-sm text-sm font-medium text-dark-maroon bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark-maroon"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };


export default Auth;