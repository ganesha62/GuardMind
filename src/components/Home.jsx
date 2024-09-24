import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaRegUserCircle } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';

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
  const username = localStorage.getItem('username')

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    navigate('/auth');
  };

    return (
      <div className="min-h-screen bg-blackishbg flex flex-col" style={{backgroundImage: 'url(https://static.vecteezy.com/system/resources/thumbnails/011/478/774/small_2x/loop-flicker-orange-red-particles-stars-black-background-free-video.jpg)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <nav className="bg-blackishbg p-4 shadow-md">
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-off-white text-center sm:text-left mb-4 sm:mb-0">GUARDMIND- AN AI-POWERED MENTAL HEALTH SUPPORT PLATFORM</h1>
            <div className="relative">
              <button
                className="flex flex-col items-center focus:outline-none"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <FaRegUserCircle color='white' size={24} />
                <b><h2 style={{color: 'white'}} className='text-sm'>{username}</h2></b>
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
            <h2 className="text-2xl sm:text-4xl font-bold text-off-white mb-4">Welcome to Your Mental Health Support Platform</h2>
            <p className="text-lg sm:text-xl text-off-white">Empowering you on your journey to better mental health</p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <Link
                key={module.name}
                to={module.path}
                className="bg-blackishbginside rounded-lg shadow-lg p-6 transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blackishbginsidehover"
              >
                <div className="flex items-center mb-4">
                  <div className="text-3xl sm:text-4xl mr-4">{module.icon}</div>
                  <h2 className="text-lg sm:text-xl font-semibold text-white">{module.name}</h2>
                </div>
                <p className="text-sm sm:text-base text-white">{module.description}</p>
              </Link>
            ))}
          </div>
        </div>
  
        <footer className="bg-blackishbg text-off-white text-center p-4 mt-8">
          <p className="text-sm">&copy; 2024 Project: GuardMind: A Mental Health Platform. All rights reserved.</p>
          <p className="text-sm">Designed and developed by: <a href='https://github.com/ganesha62' className='text-blue-400'>Team GuardMind</a></p>
        </footer>
      </div>
    );
  }
export default Home;