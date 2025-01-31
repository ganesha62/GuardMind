import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Heart, Shield, Star, X, ArrowUp, ArrowDown, Check, ThumbsUp, Frown, Smile } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const CBTExercises = ({ onGameComplete, difficulty = 'medium' }) => {
  const [currentGame, setCurrentGame] = useState('mindMaze');
  const [gameState, setGameState] = useState('instruction');
  const navigate = useNavigate();
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [collectedTools, setCollectedTools] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState(null);

  // Mental health challenges and coping tools
  const challenges = [
    {
      id: 1,
      type: 'anxiety',
      text: "You encounter anxious thoughts. What's a healthy way to respond?",
      options: [
        { text: "Take deep breaths and ground yourself", correct: true, tool: "Breathing Compass" },
        { text: "Try to suppress the thoughts", correct: false },
        { text: "Practice mindful observation", correct: true, tool: "Mindfulness Mirror" }
      ]
    },
    {
      id: 2,
      type: 'stress',
      text: "You're feeling overwhelmed. Which coping strategy would help?",
      options: [
        { text: "Break the task into smaller steps", correct: true, tool: "Task Divider" },
        { text: "Push through without breaks", correct: false },
        { text: "Ask for help or support", correct: true, tool: "Support Beacon" }
      ]
    },
    {
      id: 3,
      type: 'confidence',
      text: "Self-doubt is blocking your path. How do you proceed?",
      options: [
        { text: "Remember past achievements", correct: true, tool: "Memory Lantern" },
        { text: "Compare yourself to others", correct: false },
        { text: "Set a small, achievable goal", correct: true, tool: "Goal Compass" }
      ]
    }
  ];

  // Game map generation
  const generateLevel = (level) => {
    const maps = {
      1: {
        layout: [
          ['S', 'P', 'P', 'T', 'P'],
          ['W', 'W', 'P', 'W', 'P'],
          ['P', 'P', 'T', 'P', 'P'],
          ['P', 'W', 'W', 'W', 'P'],
          ['P', 'P', 'T', 'P', 'E']
        ],
        tools: ['Breathing Compass', 'Mindfulness Mirror', 'Support Beacon']
      },
      2: {
        layout: [
          ['S', 'P', 'T', 'W', 'P', 'P'],
          ['W', 'P', 'P', 'T', 'W', 'P'],
          ['P', 'W', 'W', 'P', 'P', 'T'],
          ['P', 'T', 'P', 'W', 'W', 'P'],
          ['P', 'W', 'P', 'T', 'P', 'P'],
          ['P', 'P', 'P', 'W', 'P', 'E']
        ],
        tools: ['Task Divider', 'Memory Lantern', 'Goal Compass']
      }
    };
    return maps[level] || maps[1];
  };

  const [currentMap, setCurrentMap] = useState(generateLevel(1));

  // Movement and game logic
  const handleMovement = (direction) => {
    if (gameState !== 'playing') return;

    const moves = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 }
    };

    const move = moves[direction];
    if (!move) return;

    const newPos = {
      x: playerPosition.x + move.x,
      y: playerPosition.y + move.y
    };

    if (isValidMove(newPos)) {
      const cell = currentMap.layout[newPos.y][newPos.x];
      
      if (cell === 'T') {
        const unusedChallenges = challenges.filter(c => 
          !collectedTools.includes(c.options.find(o => o.correct)?.tool)
        );
        if (unusedChallenges.length > 0) {
          setCurrentChallenge(unusedChallenges[0]);
          setGameState('challenge');
        }
      }
      
      if (cell === 'E') {
        if (currentLevel < 2) {
          setCurrentLevel(prev => prev + 1);
          setCurrentMap(generateLevel(currentLevel + 1));
          setPlayerPosition({ x: 0, y: 0 });
        } else {
          setGameState('complete');
        }
      }

      setPlayerPosition(newPos);
      setScore(prev => prev + 10);
    }
  };

  const isValidMove = (pos) => {
    const map = currentMap.layout;
    return (
      pos.y >= 0 && 
      pos.y < map.length && 
      pos.x >= 0 && 
      pos.x < map[0].length && 
      map[pos.y][pos.x] !== 'W'
    );
  };

  const handleChallengeResponse = (option) => {
    if (option.correct) {
      if (option.tool) {
        setCollectedTools(prev => [...prev, option.tool]);
        setScore(prev => prev + 50);
      }
      setCurrentChallenge(null);
      setGameState('playing');
    } else {
      setScore(prev => Math.max(0, prev - 20));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState === 'playing') {
        handleMovement(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, playerPosition]);
  const ThoughtTower = () => {
    const [thoughts, setThoughts] = useState([]);
    const [currentThought, setCurrentThought] = useState('');
    const [score, setScore] = useState(0);
    const [showTutorial, setShowTutorial] = useState(true);

    const handleAddThought = () => {
      if (currentThought.trim() === '') return;
      setThoughts([...thoughts, {
        text: currentThought,
        type: 'negative',
        height: Math.floor(Math.random() * 3) + 1
      }]);
      setCurrentThought('');
    };

    const handleChallengeThought = (index) => {
      const newThoughts = [...thoughts];
      newThoughts[index].type = 'positive';
      setThoughts(newThoughts);
      setScore(prev => prev + 10);
    };

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center p-4 w-full max-w-4xl mx-auto"
      >
        {showTutorial && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-blue-50 p-4 rounded-lg mb-6 w-full"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold mb-2">Welcome to Thought Tower!</h3>
                <p className="text-gray-700">Build your tower by:</p>
                <ul className="list-disc ml-6 mt-2">
                  <li>Adding negative thoughts that trouble you</li>
                  <li>Challenging and transforming them into positive ones</li>
                  <li>Watch your tower grow stronger with each transformation</li>
                </ul>
              </div>
              <button 
                onClick={() => setShowTutorial(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}

        <div className="w-full bg-white rounded-lg shadow-lg p-6">
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={currentThought}
              onChange={(e) => setCurrentThought(e.target.value)}
              className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter a negative thought..."
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddThought}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center gap-2"
            >
              <ArrowUp size={20} />
              Add Block
            </motion.button>
          </div>

          <div className="flex justify-center mb-6">
            <div className="relative w-full max-w-2xl h-96 bg-gradient-to-b from-sky-100 to-white rounded-lg">
              <AnimatePresence>
                {thoughts.map((thought, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    className={`absolute bottom-${index * 16} w-full p-4 ${
                      thought.type === 'negative' ? 'bg-red-100' : 'bg-green-100'
                    } rounded-lg shadow-md transition-all duration-300`}
                    style={{
                      bottom: `${index * 60}px`,
                      zIndex: thoughts.length - index,
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="flex-1">{thought.text}</span>
                      {thought.type === 'negative' ? (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleChallengeThought(index)}
                          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                          <Shield size={16} />
                          Challenge
                        </motion.button>
                      ) : (
                        <ThumbsUp className="text-green-500" size={20} />
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold">Score: {score}</div>
            <div className="text-gray-600">Thoughts Transformed: {thoughts.filter(t => t.type === 'positive').length}</div>
          </div>
        </div>
      </motion.div>
    );
  };
  
  const EmotionExplorer = () => {
    const [emotions, setEmotions] = useState([]);
    const [currentEmotion, setCurrentEmotion] = useState('');
    const [currentIntensity, setCurrentIntensity] = useState(5);
    const [score, setScore] = useState(0);
    const [showGuide, setShowGuide] = useState(true);

    const emotionCategories = {
      joy: ['happy', 'excited', 'content', 'peaceful'],
      sadness: ['sad', 'disappointed', 'lonely', 'hopeless'],
      anger: ['angry', 'frustrated', 'irritated', 'enraged'],
      fear: ['anxious', 'worried', 'scared', 'nervous'],
      surprise: ['amazed', 'shocked', 'confused', 'unexpected']
    };

    const handleAddEmotion = () => {
      if (currentEmotion.trim() === '') return;
      
      const category = Object.entries(emotionCategories)
        .find(([_, emotions]) => 
          emotions.some(e => currentEmotion.toLowerCase().includes(e))
        )?.[0] || 'other';

      setEmotions([...emotions, {
        text: currentEmotion,
        intensity: currentIntensity,
        category,
        type: 'unprocessed',
        reflection: ''
      }]);
      setCurrentEmotion('');
      setCurrentIntensity(5);
    };

    const handleProcessEmotion = (index, reflection) => {
      const newEmotions = [...emotions];
      newEmotions[index].type = 'processed';
      newEmotions[index].reflection = reflection;
      setEmotions(newEmotions);
      setScore(prev => prev + 15);
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center p-4 w-full max-w-4xl mx-auto"
      >
        {showGuide && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-purple-50 p-4 rounded-lg mb-6 w-full"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold mb-2">Welcome to Emotion Explorer!</h3>
                <p className="text-gray-700">Understand your emotions better by:</p>
                <ul className="list-disc ml-6 mt-2">
                  <li>Identifying and naming your emotions</li>
                  <li>Rating their intensity</li>
                  <li>Reflecting on their triggers and meanings</li>
                </ul>
              </div>
              <button 
                onClick={() => setShowGuide(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}

<div className="w-full bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={currentEmotion}
                onChange={(e) => setCurrentEmotion(e.target.value)}
                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="What emotion are you feeling?"
              />
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Intensity:</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentIntensity}
                  onChange={(e) => setCurrentIntensity(parseInt(e.target.value))}
                  className="w-32"
                />
                <span className="w-8 text-center">{currentIntensity}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddEmotion}
                className="bg-purple-500 text-white px-6 py-3 rounded-lg flex items-center gap-2"
              >
                <Heart size={20} />
                Add
              </motion.button>
            </div>
          </div>

          <div className="grid gap-4">
            <AnimatePresence>
              {emotions.map((emotion, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  className={`p-4 rounded-lg ${
                    emotion.type === 'unprocessed' 
                      ? 'bg-yellow-50 border border-yellow-200' 
                      : 'bg-green-50 border border-green-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{emotion.text}</span>
                        <div className={`px-2 py-1 rounded text-sm ${
                          emotion.intensity > 7 ? 'bg-red-100 text-red-700' :
                          emotion.intensity > 4 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          Intensity: {emotion.intensity}
                        </div>
                      </div>
                      {emotion.type === 'processed' && (
                        <div className="mt-2 text-gray-600">
                          <strong>Reflection:</strong> {emotion.reflection}
                        </div>
                      )}
                    </div>
                    {emotion.type === 'unprocessed' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const reflection = prompt('What have you learned from this emotion?');
                          if (reflection) handleProcessEmotion(index, reflection);
                        }}
                        className="bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        <Brain size={16} />
                        Process
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-6 text-center">
            <div className="text-2xl font-bold">Score: {score}</div>
            <div className="text-gray-600">Emotions Processed: {emotions.filter(e => e.type === 'processed').length}</div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Main component return
  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setCurrentGame('mindMaze')}
          className={`px-4 py-2 rounded ${
            currentGame === 'mindMaze' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Mind Maze
        </button>
        <button
          onClick={() => setCurrentGame('thoughtTower')}
          className={`px-4 py-2 rounded ${
            currentGame === 'thoughtTower' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Thought Tower
        </button>
        <button
          onClick={() => setCurrentGame('emotionExplorer')}
          className={`px-4 py-2 rounded ${
            currentGame === 'emotionExplorer' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Emotion Explorer
        </button>
<br></br>
        <button
        onClick={() => navigate('/')}
        className="m-4 bg-dark-maroon text-white font-bold py-2 px-4 rounded hover:bg-light-maroon transition duration-300"
      >
        Back to Home
      </button>
      </div>

      {currentGame === 'mindMaze' && (
        <AnimatePresence mode="wait">
          {/* Mind Maze game states */}
          {gameState === 'instruction' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-6 rounded-lg max-w-2xl mb-6"
            >
              <h2 className="text-2xl font-bold mb-4">Mind Maze: Journey to Wellness</h2>
              <div className="space-y-4">
                <p>Welcome to Mind Maze! Navigate through the maze while:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Collecting mental health tools (T) to build your coping toolkit</li>
                  <li>Solving therapeutic challenges to progress</li>
                  <li>Using arrow keys to move</li>
                  <li>Reaching the exit (E) to complete each level</li>
                </ul>
                <p>Map Legend:</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded">S</div>
                    <span>Start</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-500 rounded">E</div>
                    <span>Exit</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-500 rounded">T</div>
                    <span>Tool Location</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-700 rounded">W</div>
                    <span>Wall</span>
                  </div>
                </div>
                <button
                  onClick={() => setGameState('playing')}
                  className="w-full mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Start Journey
                </button>
              </div>
            </motion.div>
          )}
          {gameState === 'playing' && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white p-6 rounded-lg max-w-2xl mb-6"
  >
    <h2 className="text-2xl font-bold mb-4">Mind Maze: Level {currentLevel}</h2>
    <div className="grid gap-1">
      {currentMap.layout.map((row, y) => (
        <div key={y} className="flex gap-1">
          {row.map((cell, x) => (
            <div
              key={x}
              className={`w-10 h-10 flex items-center justify-center rounded ${
                cell === 'W' ? 'bg-gray-700' :
                cell === 'S' ? 'bg-blue-500' :
                cell === 'E' ? 'bg-green-500' :
                cell === 'T' ? 'bg-purple-500' :
                'bg-gray-200'
              } ${
                playerPosition.x === x && playerPosition.y === y ? 'border-4 border-yellow-400' : ''
              }`}
            >
              {cell === 'S' && 'S'}
              {cell === 'E' && 'E'}
              {cell === 'T' && 'T'}
            </div>
          ))}
        </div>
      ))}
    </div>
    <div className="mt-4 text-center">
      <p className="text-lg font-bold">Score: {score}</p>
      <p className="text-gray-600">Collected Tools: {collectedTools.join(', ')}</p>
    </div>
  </motion.div>
)}
{gameState === 'challenge' && currentChallenge && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white p-6 rounded-lg max-w-2xl mb-6"
  >
    <h2 className="text-2xl font-bold mb-4">Challenge: {currentChallenge.type}</h2>
    <p className="mb-4">{currentChallenge.text}</p>
    <div className="space-y-3">
      {currentChallenge.options.map((option, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleChallengeResponse(option)}
          className={`w-full p-3 rounded-lg ${
            option.correct ? 'bg-green-100 hover:bg-green-200' : 'bg-red-100 hover:bg-red-200'
          }`}
        >
          {option.text}
        </motion.button>
      ))}
    </div>
  </motion.div>
)}
{gameState === 'complete' && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white p-6 rounded-lg max-w-2xl mb-6"
  >
    <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
    <p className="mb-4">You've completed all levels of the Mind Maze.</p>
    <div className="text-center">
      <p className="text-lg font-bold">Final Score: {score}</p>
      <p className="text-gray-600">Collected Tools: {collectedTools.join(', ')}</p>
    </div>
    <button
      onClick={onGameComplete}
      className="w-full mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
    >
      Finish Game
    </button>
  </motion.div>
)}

          {/* Rest of the Mind Maze game states */}
          {/* ... (keep all the existing Mind Maze game state renders) */}
        </AnimatePresence>
      )}

      {currentGame === 'thoughtTower' && (
        <ThoughtTower />
      )}

      {currentGame === 'emotionExplorer' && (
        <EmotionExplorer />
      )}
    </div>
    
  );

  
};

export default CBTExercises;