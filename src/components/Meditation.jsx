import React, { useState, useEffect } from 'react';
import { PlayCircle, PauseCircle, StopCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  useEffect(() => {
    // Load total meditation time from local storage
    const storedTime = localStorage.getItem('totalMeditationTime');
    if (storedTime) {
      setTotalMeditationTime(parseInt(storedTime, 10));
    }
  }, []);

  useEffect(() => {
    let interval = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  useEffect(() => {
    if (isActive && !isPaused) {
      const currentStepDuration = meditationSteps[currentStep].duration;
      if (time % currentStepDuration === 0 && time !== 0) {
        setCurrentStep((step) => (step + 1) % meditationSteps.length);
        playAudioInstruction(meditationSteps[currentStep].instruction);
      }
    }
  }, [time, isActive, isPaused, currentStep]);

  const playAudioInstruction = (instruction) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(instruction);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
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
    
    // In a real application, you'd send this data to your backend
    console.log(`Meditation session completed: ${sessionTime} seconds`);
    console.log(`Total meditation time: ${newTotalTime} seconds`);
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return [hours, minutes, seconds]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v,i) => v !== "00" || i > 0)
      .join(":");
  };

  return (
    <div style={{backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/002/906/093/non_2x/man-meditate-dark-black-abstract-background-yoga-ray-beam-buddhist-hindu-meditation-free-vector.jpg')", backgroundSize: 'cover', backgroundPosition: 'center'}} className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-4xl font-bold mb-8">Mindful Meditation</h1>
      
      
      <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg opacity-90">
        <h2 className="text-2xl font-semibold mb-4">Guided Session</h2>
        <p className="text-xl mb-4">{meditationSteps[currentStep].instruction}</p>
        <div className="text-5xl font-bold text-center mb-4">{formatTime(time)}</div>
        
        <div className="flex justify-center space-x-4 mb-4">
          {!isActive && !isPaused ? (
            <button onClick={handleStart} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full flex items-center">
              <PlayCircle className="mr-2" />Start
            </button>
          ) : (
            <>
              <button onClick={handlePauseResume} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full flex items-center">
                {isPaused ? <PlayCircle className="mr-2" /> : <PauseCircle className="mr-2" />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button onClick={handleStop} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full flex items-center">
                <StopCircle className="mr-2" />Stop
              </button>
            </>
          )}
        </div>

        <div className="text-center">
          <p className="text-lg">Total time meditated: {formatTime(totalMeditationTime)}</p>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg opacity-90">
        <h2 className="text-2xl font-semibold mb-4">Benefits of Meditation</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Reduces stress and anxiety</li>
          <li>Improves focus and concentration</li>
          <li>Enhances self-awareness</li>
          <li>Promotes emotional health</li>
          <li>May help reduce age-related memory loss</li>
        </ul>
      </div>
      <br/>
      <button
        onClick={() => navigate('/')}
        className="mb-4 bg-dark-maroonn text-white font-bold py-2 px-4 rounded hover:bg-light-maroon transition duration-300"
      >
        Back to Home
      </button>
    </div>
  );
};

export default Meditation;