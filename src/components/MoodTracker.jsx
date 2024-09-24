import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smile, Frown, Meh, Calendar, ChevronLeft, ChevronRight, Award } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-blackishbg to-blackishbginside p-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Mood Tracker</h1>
      
      <div className="bg-blackishbginside rounded-lg shadow-lg p-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => setCurrentWeek(prev => Math.max(0, prev - 1))}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
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
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
            disabled={currentWeek === 3}
          >
            <ChevronRight size={24} />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-6">
          {DAYS.map((day, index) => (
            <div key={day} className="text-center">
              <p className="font-medium mb-1">{day}</p>
              <div className="flex flex-col items-center space-y-1">
                {MOODS.map((mood, moodIndex) => {
                  const MoodIcon = mood.icon;
                  const isSelected = moodData[currentWeek * 7 + index] === moodIndex;
                  return (
                    <button
                      key={moodIndex}
                      onClick={() => handleInteraction(index, moodIndex)}
                      className={`p-2 rounded-full transition-all duration-200 ${
                        isSelected ? `${mood.bgColor} ${mood.color}` : 'hover:bg-gray-700'
                      }`}
                    >
                      <MoodIcon size={20} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {interaction && (
          <div className="text-center my-4 animate-pulse">
            <p className="text-lg font-semibold">
              You're feeling {interaction.mood} on {DAYS[interaction.day]}!
            </p>
          </div>
        )}
        
        <div className="space-y-3">
          <h3 className="font-semibold mb-2">Week {currentWeek + 1} Summary</h3>
          {getWeekSummary(currentWeek).map((mood, index) => (
            <div key={index} className="flex items-center">
              <mood.icon className={`${mood.color} mr-2`} size={20} />
              <div className="flex-grow bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full ${mood.bgColor}`}
                  style={{ width: `${(mood.count / 7) * 100}%` }}
                />
              </div>
              <span className="ml-2 font-medium">{mood.count} day(s)</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-blackishbginside rounded-lg shadow-lg p-4 mb-8">
        <h3 className="font-semibold mb-2 flex items-center">
          <Award className="mr-2" />
          Mood Streak: {streak} day(s)
        </h3>
        <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full rounded-full"
            style={{ width: `${(streak / 28) * 100}%` }}
          />
        </div>
        <p className="text-sm">Keep tracking your mood to increase your streak!</p>
      </div>
      
      {showSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-blackishbginside p-6 rounded-lg shadow-xl animate-scale-in">
            <h3 className="font-bold mb-4">Monthly Mood Summary</h3>
            {MOODS.map((mood, index) => (
              <div key={index} className="flex items-center mb-2">
                <mood.icon className={`${mood.color} mr-2`} size={20} />
                <span className="font-medium">{mood.label}:</span>
                <span className="ml-2">
                  {moodData.filter(m => m === index).length} day(s)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <button
        onClick={() => navigate('/')}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        Back to Home
      </button>
    </div>
  );
}

export default MoodTracker;