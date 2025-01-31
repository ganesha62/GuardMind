import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import testsData from './tests.json';

function ProgressTracker() {
  const navigate = useNavigate();
  const [currentTest, setCurrentTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [scoreData, setScoreData] = useState({ score: 0, maxScore: 0 });

  const getQuestions = (title) => {
    const test = testsData.tests.find(test => test.title === title);
    return test ? test.questions : [];
  };

  const getTestMessages = (title, score) => {
    const maxScore = title.toLowerCase() === "depression test" ? 27 : 21;
    setScoreData({ score, maxScore });
    
    let message = "";
    
    if (title.toLowerCase() === "depression test") {
      message += `<b>Score:</b> ${score}/${maxScore}<br>`;
      
      if (score > 20) {
        message += "<b>Depression Test:</b><br>Severe Depression";
      } else if (score > 15) {
        message += "<b>Depression Test:</b><br>Moderately Severe Depression";
      } else if (score > 10) {
        message += "<b>Depression Test:</b><br>Moderate Depression";
      } else if (score > 5) {
        message += "<b>Depression Test:</b><br>Mild Depression";
      } else {
        message += "<b>Depression Test:</b><br>No Depression";
      }
    } else if (title.toLowerCase() === "anxiety test") {
      message += `<b>Score:</b> ${score}/${maxScore}<br>`;
      
      if (score > 15) {
        message += "<b>Anxiety Test:</b><br>Severe Anxiety";
      } else if (score > 10) {
        message += "<b>Anxiety Test:</b><br>Moderate Anxiety";
      } else if (score > 5) {
        message += "<b>Anxiety Test:</b><br>Mild Anxiety";
      } else {
        message += "<b>Anxiety Test:</b><br>No Anxiety";
      }
    }
    
    message += "<br><br><i>These results are not meant to be a diagnosis. You can meet with a doctor or therapist to get a diagnosis and/or access therapy or medications. Sharing these results with someone you trust can be a great place to start.</i>";
    
    return message;
  };

  const handleStartTest = (test) => {
    setCurrentTest(test);
    setAnswers({});
    setResult(null);
    setScoreData({ score: 0, maxScore: 0 });
    setQuestions(getQuestions(test));
  };

  const handleAnswer = (questionIndex, points) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: points }));
  };

  const handleSubmit = () => {
    const score = Object.values(answers).reduce((sum, value) => sum + value, 0);
    const scoreMessage = getTestMessages(currentTest, score);
    setResult(scoreMessage);
  };

  // Data for visualization
  const chartData = [
    { 
      name: currentTest || "Score",
      Score: scoreData.score,
      "Max Score": scoreData.maxScore
    }
  ];

  const pieData = [
    { name: "Score", value: scoreData.score },
    { name: "Remaining", value: scoreData.maxScore - scoreData.score }
  ];

  const COLORS = ['#4CAF50', '#FF5252'];

  return (
    <div className="container mx-auto px-4 py-8 bg-blackishbginside min-h-screen" style={{backgroundImage: 'url("https://media.istockphoto.com/id/1478776181/video/flying-pink-neon-question-marks-on-a-black-background-3d-animation-question-mark-looping.jpg?s=640x640&k=20&c=5iaBIXjs7ydswVcvKqjjqRySe6ksY2njjWn4h3SYQFQ=")'}}>
     <h1 className="text-4xl font-bold text-white mb-8 text-center">Mental Health Tracker</h1>
      
      {!currentTest && !result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testsData.tests.map((test) => (
            <div key={test.title} className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg overflow-hidden">
              <div className="bg-white/20 text-white text-xl font-semibold p-4">
                {test.title}
              </div>
              <div className="p-6">
                <button
                  onClick={() => handleStartTest(test.title)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                >
                  Start Test
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {currentTest && questions.length > 0 && !result && (
        <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg overflow-hidden">
          <div className="bg-white/20 text-white text-xl font-semibold p-4">
            {currentTest}
          </div>
          <div className="p-6">
            {questions.map((question, index) => (
              <div key={index} className="mb-6">
                <p className="mb-2 text-lg font-medium text-white">{question.question}</p>
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option.points}
                        onChange={(e) => handleAnswer(index, parseInt(e.target.value))}
                        className="form-radio h-5 w-5 text-blue-600"
                      />
                      <span className="text-white">{option.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== questions.length}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg overflow-hidden">
          <div className="bg-white/20 text-white text-xl font-semibold p-4">
            Test Result
          </div>
          <div className="p-6">
            <div 
              className="text-white mb-4" 
              dangerouslySetInnerHTML={{ __html: result }} 
            />
            {scoreData.score > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">Score Visualization</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/20 p-4 rounded-lg flex justify-center">
                    <PieChart width={300} height={300}>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </div>
                  <div className="bg-white/20 p-4 rounded-lg flex justify-center">
                    <BarChart width={300} height={300} data={chartData}>
                      <XAxis dataKey="name" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Score" fill="#4CAF50" />
                      <Bar dataKey="Max Score" fill="#FF5252" />
                    </BarChart>
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={() => {
                setCurrentTest(null);
                setResult(null);
                setScoreData({ score: 0, maxScore: 0 });
              }}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 mt-4"
            >
              Back to Tests
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => navigate('/')}
        className="mt-8 bg-gray-500 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 transition duration-300 block mx-auto"
      >
        Back to Home
      </button>
    </div>
  );
}

export default ProgressTracker;