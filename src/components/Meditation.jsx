import React, { useState, useEffect, useRef } from 'react';
import { PlayCircle, PauseCircle, StopCircle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const meditationSteps = [
  { instruction: "Find a comfortable position and close your eyes", duration: 10 },
  { instruction: "Take a deep breath in...", duration: 5 },
  { instruction: "...and slowly exhale", duration: 5 },
  { instruction: "Focus on your breath", duration: 20 },
  { instruction: "If your mind wanders, gently bring it back to your breath", duration: 20 },
  { instruction: "Continue breathing deeply", duration: 20 },
  { instruction: "Slowly open your eyes", duration: 10 },
];

const Meditation = () => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalMeditationTime, setTotalMeditationTime] = useState(0);
  const [sessionHistory, setSessionHistory] = useState([]);
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  useEffect(() => {
    // Load total meditation time and session history from local storage
    const storedTime = localStorage.getItem('totalMeditationTime');
    const storedHistory = localStorage.getItem('sessionHistory');
    if (storedTime) setTotalMeditationTime(parseInt(storedTime, 10));
    if (storedHistory) setSessionHistory(JSON.parse(storedHistory));
  }, []);

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, isPaused]);

  useEffect(() => {
    if (isActive && !isPaused) {
      const currentStepDuration = meditationSteps[currentStep].duration;
      if (time >= currentStepDuration) {
        setCurrentStep((prevStep) => (prevStep + 1) % meditationSteps.length);
        setTime(0); // Reset time for the next step
      }
    }
  }, [time, isActive, isPaused, currentStep]);

  useEffect(() => {
    if (isActive && !isPaused) {
      playAudioInstruction(meditationSteps[currentStep].instruction);
    }
  }, [currentStep, isActive, isPaused]);

  const playAudioInstruction = (instruction) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(instruction);
      utterance.voice = window.speechSynthesis.getVoices().find(voice => voice.name.includes('Google UK English Female')) || null;
      utterance.rate = 0.9; // Slightly slower for calmness
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    setTime(0);
    setCurrentStep(0);
    playAudioInstruction(meditationSteps[0].instruction);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      playAudioInstruction("Resuming meditation");
    } else {
      playAudioInstruction("Pausing meditation");
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    setIsActive(false);
    setIsPaused(false);
    const sessionTime = time;
    setTime(0);
    setCurrentStep(0);
    updateTotalMeditationTime(sessionTime);
    playAudioInstruction("Meditation session completed");
  };

  const updateTotalMeditationTime = (sessionTime) => {
    const newTotalTime = totalMeditationTime + sessionTime;
    setTotalMeditationTime(newTotalTime);
    localStorage.setItem('totalMeditationTime', newTotalTime.toString());

    // Update session history
    const newSession = { date: new Date().toLocaleString(), duration: sessionTime };
    const updatedHistory = [...sessionHistory, newSession];
    setSessionHistory(updatedHistory);
    localStorage.setItem('sessionHistory', JSON.stringify(updatedHistory));
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return [hours, minutes, seconds]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
  };

  const progress = (time / meditationSteps[currentStep].duration) * 100;

  return (
    <div style={{backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/002/906/093/non_2x/man-meditate-dark-black-abstract-background-yoga-ray-beam-buddhist-hindu-meditation-free-vector.jpg')", backgroundSize: 'cover', backgroundPosition: 'center'}} className="container mx-auto px-4 py-8 text-white">
        <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8">Mindful Meditation</h1>

        <motion.div 
          className="bg-gray-800 bg-opacity-75 rounded-xl p-8 shadow-2xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold mb-6">Guided Session</h2>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              className="text-2xl mb-6 text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              {meditationSteps[currentStep].instruction}
            </motion.p>
          </AnimatePresence>

          <div className="text-6xl font-bold text-center mb-6">{formatTime(time)}</div>
          <div className="w-full bg-gray-700 rounded-full h-3 mb-6">
            <motion.div
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            {!isActive && !isPaused ? (
              <motion.button
                onClick={handleStart}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlayCircle className="mr-2" /> Start
              </motion.button>
            ) : (
              <>
                <motion.button
                  onClick={handlePauseResume}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isPaused ? <PlayCircle className="mr-2" /> : <PauseCircle className="mr-2" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </motion.button>
                <motion.button
                  onClick={handleStop}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <StopCircle className="mr-2" /> Stop
                </motion.button>
              </>
            )}
          </div>

          <div className="text-center">
            <p className="text-xl">Total time meditated: {formatTime(totalMeditationTime)}</p>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gray-800 bg-opacity-75 rounded-xl p-8 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-semibold mb-6">Session History</h2>
          {sessionHistory.length > 0 ? (
            <ul className="space-y-4">
              {sessionHistory.map((session, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-700 p-4 rounded-lg">
                  <span>{session.date}</span>
                  <span className="font-bold">{formatTime(session.duration)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-400">No sessions recorded yet.</p>
          )}
        </motion.div>

        <motion.button
          onClick={() => navigate('/')}
          className="mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-full flex items-center mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Home className="mr-2" /> Back to Home
        </motion.button>
      </div>
    </div>
  );
};

export default Meditation;