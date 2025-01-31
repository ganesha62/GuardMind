import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaRegUserCircle } from 'react-icons/fa';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const modules = [
  { name: 'Chatbot', path: '/chatbot', icon: '🤖', description: 'AI-powered mental health support chat' },
  { name: 'Daily Journal', path: '/journal', icon: '📓', description: 'A Diary to record your thoughts and feelings' },
  { name: 'CBT Exercises', path: '/cbt-exercises', icon: '🧠', description: 'Interactive cognitive behavioral therapy exercises' },
  { name: 'Mood Tracker', path: '/mood-tracker', icon: '📊', description: 'Track and analyze your daily moods' },
  { name: 'Community Forum', path: '/community-forum', icon: '👥', description: 'Connect with others in a supportive environment' },
  { name: 'Resource Library', path: '/resource-library', icon: '📚', description: 'Access mental health articles and videos' },
  { name: 'Meditation', path: '/meditation', icon: '🧘', description: 'Guided meditation and mindfulness practices' },
  { name: 'Stress Tracker', path: '/progress', icon: '📈', description: 'Test your mental health journey' },
  { name: 'Crisis Support', path: '/crisis', icon: '🆘', description: 'Immediate help for urgent situations' },
];

function Home({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-900 to-purple-900 p-4 flex flex-col">
      <nav className="bg-gray-900 p-4 shadow-lg">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-white text-center sm:text-left mb-4 sm:mb-0">
            GUARDMIND - AN AI-POWERED MENTAL HEALTH SUPPORT PLATFORM
          </h1>
          <div className="relative">
            <button
              className="flex flex-col items-center focus:outline-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <FaRegUserCircle color="white" size={24} />
              <b>
                <h2 style={{ color: 'white' }} className="text-sm">
                  {username}
                </h2>
              </b>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-200"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
          >
            Welcome to Your Mental Health Support Platform
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-300"
          >
            Empowering you on your journey to better mental health
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {modules.map((module, index) => (
    <motion.div
      key={module.name}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-gray-800 rounded-xl shadow-lg" // Add background here
    >
      <Link
        to={module.path}
        className="block w-full p-6 transition duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-700 rounded-xl"
      >
        <div className="flex items-center mb-4">
          <div className="text-3xl sm:text-4xl mr-4">{module.icon}</div>
          <h2 className="text-lg sm:text-xl font-semibold text-white">{module.name}</h2>
        </div>
        <p className="text-sm sm:text-base text-gray-300">{module.description}</p>
      </Link>
    </motion.div>
  ))}
</div>
        {/* Special PPTM Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 mb-8"
        >
          <Link
            to="/pptm"
            className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 transform transition-all duration-300 hover:scale-102 hover:shadow-2xl"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <span className="text-6xl animate-bounce inline-block">🎯</span>
                <span className="text-6xl ml-4 animate-pulse inline-block">🧠</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Discover Your Psychological Profile</h3>
              <p className="text-lg text-white opacity-90">Click here to unlock insights into your mental well-being through our advanced psychological analysis</p>
              <div className="mt-4 bg-white bg-opacity-20 px-6 py-2 rounded-full">
                <span className="text-white font-semibold">Start Your Analysis Journey</span>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      <footer className="bg-gray-900 text-white text-center p-4 mt-8">
        <p className="text-sm">&copy; 2024 Project: GuardMind: A Mental Health Platform. All rights reserved.</p>
        <p className="text-sm">Designed and developed by: <a href="https://github.com/ganesha62" className="text-blue-400">Team GuardMind</a></p>
      </footer>
    </div>
  );
}

export default Home;