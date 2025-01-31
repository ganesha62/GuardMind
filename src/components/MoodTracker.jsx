import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smile, Frown, Meh, Calendar, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOODS = [
  { icon: Frown, color: 'text-red-500', label: 'Bad', bgColor: 'bg-red-200' },
  { icon: Meh, color: 'text-yellow-500', label: 'Okay', bgColor: 'bg-yellow-200' },
  { icon: Smile, color: 'text-green-500', label: 'Good', bgColor: 'bg-green-200' },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function MoodTracker() {
  const navigate = useNavigate();
  const [moodData, setMoodData] = useState(() => {
    const stored = localStorage.getItem('moodData');
    return stored ? JSON.parse(stored) : Array(28).fill(null);
  });
  const [currentWeek, setCurrentWeek] = useState(0);
  const [interaction, setInteraction] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    localStorage.setItem('moodData', JSON.stringify(moodData));
  }, [moodData]);

  useEffect(() => {
    const checkAndResetMoods = () => {
      const today = new Date().getDay();
      if (today === 0 && currentWeek === 3) {
        triggerMonthlySummary();
        setTimeout(() => {
          setMoodData(Array(28).fill(null));
          setCurrentWeek(0);
        }, 5000);
      }
    };

    const timer = setInterval(checkAndResetMoods, 1000 * 60 * 60); // Check every hour
    return () => clearInterval(timer);
  }, [currentWeek]);

  useEffect(() => {
    let currentStreak = 0;
    for (let i = moodData.length - 1; i >= 0; i--) {
      if (moodData[i] !== null) {
        currentStreak++;
      } else {
        break;
      }
    }
    setStreak(currentStreak);
  }, [moodData]);

  const setMood = (day, moodIndex) => {
    const newMoodData = [...moodData];
    newMoodData[currentWeek * 7 + day] = moodIndex;
    setMoodData(newMoodData);
  };

  const triggerMonthlySummary = () => {
    setShowSummary(true);
    setTimeout(() => setShowSummary(false), 5000);
  };

  const handleInteraction = (day, moodIndex) => {
    setMood(day, moodIndex);
    setInteraction({ day, mood: MOODS[moodIndex].label });
    setTimeout(() => setInteraction(null), 2000);
  };

  const getWeekSummary = (weekIndex) => {
    const weekData = moodData.slice(weekIndex * 7, (weekIndex + 1) * 7);
    return MOODS.map((mood, index) => ({
      ...mood,
      count: weekData.filter(m => m === index).length
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-900 to-purple-900 p-4 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">Mood Tracker</h1>
      
      <motion.div 
        className="bg-gray-900 rounded-lg shadow-2xl p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => setCurrentWeek(prev => Math.max(0, prev - 1))}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-300"
            disabled={currentWeek === 0}
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-semibold flex items-center">
            <Calendar className="mr-2" />
            Week {currentWeek + 1}
          </h2>
          <button 
            onClick={() => setCurrentWeek(prev => Math.min(3, prev + 1))}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-300"
            disabled={currentWeek === 3}
          >
            <ChevronRight size={24} />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-4 mb-6">
          {DAYS.map((day, index) => (
            <div key={day} className="text-center">
              <p className="font-medium mb-2">{day}</p>
              <div className="flex flex-col items-center space-y-2">
                {MOODS.map((mood, moodIndex) => {
                  const MoodIcon = mood.icon;
                  const isSelected = moodData[currentWeek * 7 + index] === moodIndex;
                  return (
                    <motion.button
                      key={moodIndex}
                      onClick={() => handleInteraction(index, moodIndex)}
                      className={`p-3 rounded-full transition-all duration-300 ${
                        isSelected ? `${mood.bgColor} ${mood.color}` : 'hover:bg-gray-800'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MoodIcon size={24} />
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <AnimatePresence>
          {interaction && (
            <motion.div 
              className="text-center my-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-lg font-semibold">
                You're feeling {interaction.mood} on {DAYS[interaction.day]}!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="space-y-4">
          <h3 className="font-semibold mb-2">Week {currentWeek + 1} Summary</h3>
          {getWeekSummary(currentWeek).map((mood, index) => (
            <div key={index} className="flex items-center">
              <mood.icon className={`${mood.color} mr-2`} size={20} />
              <div className="flex-grow bg-gray-800 rounded-full h-3 overflow-hidden">
                <motion.div
                  className={`h-full ${mood.bgColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(mood.count / 7) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="ml-2 font-medium">{mood.count} day(s)</span>
            </div>
          ))}
        </div>
      </motion.div>
      
      <motion.div 
        className="bg-gray-900 rounded-lg shadow-2xl p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="font-semibold mb-4 flex items-center">
          <Award className="mr-2" />
          Mood Streak: {streak} day(s)
        </h3>
        <div className="w-full bg-gray-800 rounded-full h-3 mb-2">
          <motion.div 
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(streak / 28) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-sm">Keep tracking your mood to increase your streak!</p>
      </motion.div>
      
      <AnimatePresence>
        {showSummary && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-900 p-8 rounded-lg shadow-xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-bold mb-6 text-2xl">Monthly Mood Summary</h3>
              {MOODS.map((mood, index) => (
                <div key={index} className="flex items-center mb-3">
                  <mood.icon className={`${mood.color} mr-2`} size={24} />
                  <span className="font-medium">{mood.label}:</span>
                  <span className="ml-2">
                    {moodData.filter(m => m === index).length} day(s)
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        onClick={() => navigate('/')}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Back to Home
      </motion.button>
    </div>
  );
}

export default MoodTracker;