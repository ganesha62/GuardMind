import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smile, Frown, Meh, Calendar } from 'lucide-react';

const MOODS = [
  { icon: Frown, color: 'text-red-500', label: 'Bad' },
  { icon: Meh, color: 'text-yellow-500', label: 'Okay' },
  { icon: Smile, color: 'text-green-500', label: 'Good' },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function MoodTracker() {
  const navigate = useNavigate();
  const [moodData, setMoodData] = useState(() => {
    const stored = localStorage.getItem('moodData');
    return stored ? JSON.parse(stored) : Array(7).fill(null);
  });
  const [interaction, setInteraction] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    localStorage.setItem('moodData', JSON.stringify(moodData));
  }, [moodData]);

  useEffect(() => {
    const checkAndResetMoods = () => {
      const today = new Date().getDay();
      if (today === 0) { // Sunday
        triggerWeeklySummary();
        setTimeout(() => {
          setMoodData(Array(7).fill(null));
        }, 5000);
      }
    };

    const timer = setInterval(checkAndResetMoods, 1000 * 60 * 60); // Check every hour
    return () => clearInterval(timer);
  }, []);

  const setMood = (day, moodIndex) => {
    const newMoodData = [...moodData];
    newMoodData[day] = moodIndex;
    setMoodData(newMoodData);
  };

  const triggerWeeklySummary = () => {
    setShowSummary(true);
    setTimeout(() => setShowSummary(false), 5000);
  };

  const handleInteraction = (day, moodIndex) => {
    setMood(day, moodIndex);
    setInteraction({ day, mood: MOODS[moodIndex].label });
    setTimeout(() => setInteraction(null), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-blackishbginside min-h-screen" style={{backgroundImage:'url(https://static.vecteezy.com/system/resources/thumbnails/011/478/774/small_2x/loop-flicker-orange-red-particles-stars-black-background-free-video.jpg)'}}>
      <h1 className="font-bold text-white">Mood Tracker</h1>
      <br></br>    <br></br>
      <div className="bg-blackishbginside rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-white font-semibold mb-4 flex items-center">
          <Calendar className="mr-2 text-white" />
          This Week's Mood
        </h2>
        <div className="grid grid-cols-7 gap-4 mb-8 text-white">
          {DAYS.map((day, index) => (
            <div key={day} className="text-center">
              <p className="font-medium mb-2 text-white">{day}</p>
              <div className="flex justify-center space-x-2">
                {MOODS.map((mood, moodIndex) => {
                  const MoodIcon = mood.icon;
                  return (
                    <button
                      key={moodIndex}
                      onClick={() => handleInteraction(index, moodIndex)}
                      className={`p-2 rounded-full transition-all duration-200 ${
                        moodData[index] === moodIndex
                          ? `bg-gray-200 ${mood.color}`
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <MoodIcon size={24} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {interaction && (
          <div className="text-center my-4 animate-fade-in-out">
            <p className="text-lg font-semibold text-white">
              You're feeling {interaction.mood} on {DAYS[interaction.day]}!
            </p>
          </div>
        )}
        <div className="space-y-4">
          <h3 className="text-white font-semibold mb-2">Mood Progress</h3>
          {MOODS.map((mood, index) => (
            <div key={index} className="flex items-center">
              <mood.icon className={`${mood.color} mr-2`} />
              <div className="flex-grow bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full ${mood.color.replace('text', 'bg')}`}
                  style={{
                    width: `${(moodData.filter(m => m === index).length / 7) * 100}%`,
                  }}
                />
              </div>
              <span className="ml-2 font-medium text-white">
                {((moodData.filter(m => m === index).length / 7) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
      {showSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl animate-scale-in">
            <h3 className="text-white font-bold mb-4">Weekly Mood Summary</h3>
            {MOODS.map((mood, index) => (
              <div key={index} className="flex items-center mb-2">
                <mood.icon className={`${mood.color} mr-2`} />
                <span className="font-medium text-white">{mood.label}:</span>
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