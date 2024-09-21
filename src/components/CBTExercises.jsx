import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, Key, Home, Castle, Shield, Sword } from 'lucide-react';

const games = [
  {
    id: 1,
    title: "Mindful Garden",
    description: "Grow a garden by practicing mindfulness and positive thinking.",
    thumbnail: "https://thumbs.dreamstime.com/b/cartoon-summer-scene-path-forest-garden-nobody-illustration-children-158939660.jpg",
  },
  {
    id: 2,
    title: "Resilience Quest",
    description: "Build and strengthen your resilience fortress through CBT-based challenges.",
    thumbnail: "https://t3.ftcdn.net/jpg/00/41/93/02/360_F_41930281_h5kO1HfGE4s1efKycuv72Z15zMjLJ4mq.jpg",
  },
  {
    id: 3,
    title: "Emotion Escape Room",
    description: "Solve puzzles in themed rooms to escape negative emotions and practice positive thinking.",
    thumbnail: "https://img.freepik.com/free-vector/vector-cartoon-background-quest-room-with-closed-doors_33099-1202.jpg",
  }
];

const EmotionEscapeRoom = ({ onClose }) => {
  const [currentRoom, setCurrentRoom] = useState("anxiety");
  const [inventory, setInventory] = useState([]);
  const [puzzle, setPuzzle] = useState(null);
  const [isEscaping, setIsEscaping] = useState(false);

  const rooms = {
    anxiety: { color: "bg-purple-200", icon: <Lock size={24} /> },
    sadness: { color: "bg-blue-200", icon: <Key size={24} /> },
    joy: { color: "bg-yellow-200", icon: <Home size={24} /> },
  };

  const puzzles = {
    anxiety: {
      question: "Identify the cognitive distortion: 'I'll never be good enough.'",
      options: ["Overgeneralization", "Mind Reading", "Catastrophizing"],
      answer: "Overgeneralization",
    },
    sadness: {
      question: "Challenge the thought: 'Nobody cares about me.'",
      options: ["Evidence for", "Evidence against", "Balanced thought"],
      answer: "Evidence against",
    },
    joy: {
      question: "Practice gratitude: List one thing you're grateful for.",
      options: ["Family", "Health", "Achievements"],
      answer: null, // Any answer is correct for gratitude
    },
  };

  const selectRoom = (room) => {
    setCurrentRoom(room);
    setPuzzle(puzzles[room]);
  };

  const solvePuzzle = (answer) => {
    if (puzzle.answer === null || answer === puzzle.answer) {
      setIsEscaping(true);
      setTimeout(() => {
        setInventory([...inventory, currentRoom]);
        setPuzzle(null);
        setIsEscaping(false);
        if (inventory.length === 2) {
          alert("Congratulations! You've escaped all rooms and mastered your emotions!");
          onClose();
        }
      }, 2000); // Animation duration
    } else {
      alert("That's not quite right. Try again!");
    }
  };

  return (
    <div className="bg-blackishbginside p-6 rounded-lg relative">
      <button onClick={onClose} className="absolute top-2 right-2">
        <X color='white' size={30} />
      </button>
      <h2 className="text-white font-bold mb-4">Emotion Escape Room</h2>
      <div className="flex space-x-4 mb-4">
  {Object.entries(rooms).map(([room, { color, icon }]) => (
    <div key={room} className="relative">
      <button
        onClick={() => selectRoom(room)}
        className={`${color} p-4 rounded-lg flex items-center justify-center ${
          currentRoom === room ? 'ring-2 ring-blue-500' : ''
        } ${isEscaping && inventory.includes(room) ? 'animate-doorOpen' : ''}`}
        disabled={isEscaping}
      >
        {icon}
        <span className="ml-2 capitalize">{room}</span>
      </button>
      {inventory.includes(room) && (
        <div className="absolute inset-0 bg-green-500 bg-opacity-50 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">Escaped!</span>
        </div>
      )}
    </div>
  ))}
</div>
      {puzzle && (
        <div className="bg-white p-4 rounded-lg">
          <p className="mb-2">{puzzle.question}</p>
          <div className="space-y-2">
            {puzzle.options.map((option) => (
              <button
                key={option}
                onClick={() => solvePuzzle(option)}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="mt-4">
        <h3 className="font-bold text-white">Inventory:</h3>
        <div className="flex space-x-2">
          {inventory.map((item) => (
            <span key={item} className="bg-green-200 px-2 py-1 rounded capitalize">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const ResilienceQuest = ({ onClose }) => {
  const [fortressLevel, setFortressLevel] = useState(1);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);


  const challenges = [
    {
      type: "cognitive_distortion",
      question: "Identify the cognitive distortion: 'I failed one test, so I'm a total failure.'",
      options: ["All-or-Nothing Thinking", "Overgeneralization", "Mental Filter"],
      answer: "All-or-Nothing Thinking",
    },
    {
      type: "goal_setting",
      question: "Which of these is a SMART goal?",
      options: [
        "I want to be happier",
        "I will practice meditation for 10 minutes daily for the next month",
        "I'll try to exercise more",
      ],
      answer: "I will practice meditation for 10 minutes daily for the next month",
    },
    {
      type: "assertiveness",
      question: "Which response is the most assertive?",
      options: [
        "I guess I can do that if you really want me to.",
        "No way, find someone else to do your work!",
        "I appreciate you thinking of me, but I'm not able to take on additional tasks right now.",
      ],
      answer: "I appreciate you thinking of me, but I'm not able to take on additional tasks right now.",
    },
  ];

  const startChallenge = () => {
    setCurrentChallenge(challenges[Math.floor(Math.random() * challenges.length)]);
  };

  const handleAnswer = (answer) => {
    if (answer === currentChallenge.answer) {
      setIsAnimating(true);
      setTimeout(() => {
        setFortressLevel(fortressLevel + 1);
        setIsAnimating(false);
        alert("Correct! Your fortress has been upgraded.");
      }, 2000); // Animation duration
    } else {
      alert("That's not quite right. Your fortress remains unchanged. Try again!");
    }
    setCurrentChallenge(null);
  };

  return (
    <div className="bg-blackishbginside p-6 rounded-lg relative">
      <button onClick={onClose} className="absolute top-2 right-2">
      <X color='white' size={30} />
      </button>
      <h2 className="text-white font-bold mb-4">Resilience Quest</h2>
      <div className="mb-4 relative h-60">
  <h3 className="font-bold text-white">Fortress Level: {fortressLevel}</h3>
  <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center space-x-2">
    {Array.from({ length: fortressLevel }).map((_, index) => (
      <div
        key={index}
        className={`bg-purple-500 w-20 transition-all duration-1000 ease-in-out ${
          isAnimating && index === fortressLevel - 1 ? 'h-0 animate-grow' : 'h-10'
        }`}
        style={{ transitionDelay: `${index * 100}ms` }}
      ></div>
    ))}
  </div>
  <div className="absolute top-0 left-0 right-0 flex justify-center space-x-2">
    <Castle color='white' size={24 + fortressLevel * 4} />
    <Shield color='white' size={20 + fortressLevel * 2} />
    <Sword color='white' size={20 + fortressLevel * 2} />
  </div>
</div>
      {currentChallenge ? (
        <div className="bg-white p-4 rounded-lg">
          <p className="mb-2">{currentChallenge.question}</p>
          <div className="space-y-2">
            {currentChallenge.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={startChallenge}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Start New Challenge
        </button>
      )}
    </div>
  );
};

const MindfulGarden = ({ onClose }) => {
  const [plants, setPlants] = useState([]);
  const [activity, setActivity] = useState("");

  const addPlant = () => {
    if (activity.trim() !== "") {
      setPlants([...plants, { type: Math.random() > 0.5 ? "🌻" : "🌷", activity }]);
      setActivity("");
    }
  };

  return (
    <div className="bg-pink-100 p-6 rounded-lg relative" style={{backgroundImage:'url(https://static.vecteezy.com/system/resources/thumbnails/011/478/774/small_2x/loop-flicker-orange-red-particles-stars-black-background-free-video.jpg)'}}>
      <button onClick={onClose} className="absolute top-2 right-2">
      <X color='white' size={30} />
      </button>
      <h2 className="text-white font-bold mb-4">Mindful Garden</h2>
      <div className="mb-4">
        <input 
          type="text" 
          value={activity} 
          onChange={(e) => setActivity(e.target.value)}
          placeholder="Enter a mindful activity"
          className="border p-2 mr-2"
        />
        <button 
          onClick={addPlant}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Plant
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {plants.map((plant, index) => (
          <div key={index} className="text-center">
            <div className="text-4xl mb-2">{plant.type}</div>
            <div className="text-white font-bold">{plant.activity}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CBTExercises = () => {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState(null);

  const renderGame = () => {
    switch(selectedGame) {
      case 1:
        return <MindfulGarden onClose={() => setSelectedGame(null)} />;
      case 2:
        return <ResilienceQuest onClose={() => setSelectedGame(null)} />;
      case 3:
        return <EmotionEscapeRoom onClose={() => setSelectedGame(null)} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8">Cognitive Behavioral Therapy Exercises</h1>
      {selectedGame ? (
        renderGame()
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map((game) => (
            <div key={game.id} className="blackishbginside text-white rounded-lg shadow-lg overflow-hidden">
              <img src={game.thumbnail} alt={game.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{game.title}</h2>
                <p className="text-white">{game.description}</p>
                <button
                  onClick={() => setSelectedGame(game.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                >
                  Play
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => navigate('/')}
        className="mt-8 bg-dark-maroonn text-white font-bold py-2 px-4 rounded hover:bg-light-maroon transition duration-300"
      >
        Back to Home
      </button>
    </div>
  );
};

export default CBTExercises;