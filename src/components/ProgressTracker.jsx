import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import the JSON data directly
import testsData from './tests.json';

function ProgressTracker() {
  const navigate = useNavigate();
  const [currentTest, setCurrentTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const getQuestions = (title) => {
    const test = testsData.tests.find(test => test.title === title);
    return test ? test.questions : [];
  };

  const getTestMessages = (title, score) => {
    score = parseInt(score);
    let message = "";
    
    if (title.toLowerCase() === "depression test") {
      message += ` <b>Score:</b> ${score}/27<br>`;
      
      if (score > 20) {
        message += "<b>Depression Test:</b><br>Severe Depression: (Your responses indicate that you may be at severe risk of harming yourself. If you need immediate help, you can reach the <a href='#'>SOS Page</a>)";
      } else if (score > 15) {
        message += "<b>Depression Test:</b><br>Moderately Severe Depression: (Your responses indicate that you may be at severe risk of harming yourself. If you need immediate help, you can reach the <a href='#'>SOS Page</a>)";
      } else if (score > 10) {
        message += "<b>Depression Test:</b><br>Moderate Depression: (Your responses indicate that you may be at moderate risk of harming yourself. If you need immediate help, you can reach the <a href='#'>SOS Page</a>)";
      } else if (score > 5) {
        message += "<b>Depression Test:</b><br>Mild Depression: (Your responses indicate that you may be at lesser risk of harming yourself. If you need immediate help, you can reach the <a href='#'>SOS Page</a>)";
      } else {
        message += "<b>Depression Test:</b><br>No Depression: (Your responses indicate that you are mentally healthy and not at risk of harming yourself. If you need immediate help, you can reach the <a href='#'>SOS Page</a>)";
      }
      
    } else if (title.toLowerCase() === "anxiety test") {
      if (score > 15) {
        message += "<b>Anxiety Test:</b><br>Severe Anxiety";
      } else if (score > 10) {
        message += "<b>Anxiety Test:</b><br>Moderate Anxiety";
      } else if (score > 5) {
        message += "<b>Anxiety Test:</b><br>Mild Anxiety";
      } else {
        message += "<b>Anxiety Test:</b><br>No Anxiety";
      }
      message += ` - <b>Score:</b> ${score}/21<br>`;
    } else {
      message = "<b>Test Title not found</b><br>";
    }
    
    message += "<br><i>These results are not meant to be a diagnosis. You can meet with a doctor or therapist to get a diagnosis and/or access therapy or medications. Sharing these results with someone you trust can be a great place to start.</i>";
    
    return message;
  };
  

  const handleStartTest = (test) => {
    setCurrentTest(test);
    setAnswers({});
    setResult(null);
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

  return (
    <div className="container mx-auto px-4 py-8 bg-blackishbginside min-h-screen" style={{backgroundImage: 'url("https://media.istockphoto.com/id/1478776181/video/flying-pink-neon-question-marks-on-a-black-background-3d-animation-question-mark-looping.jpg?s=640x640&k=20&c=5iaBIXjs7ydswVcvKqjjqRySe6ksY2njjWn4h3SYQFQ=")'}}>
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Mental Health Tracker</h1>
      
      {!currentTest && !result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testsData.tests.map((test) => (
            <div key={test.title} className="bg-blackishbginside rounded-lg shadow-md overflow-hidden">
              <div className="bg-blackishbg text-white text-xl font-semibold p-4">
                {test.title}
              </div>
              <div className="p-6">
                <button
                  onClick={() => handleStartTest(test.title)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
                >
                  Start Test
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {currentTest && questions.length > 0 && !result && (
        <div className="bg-blackishbg text-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blackishbginside text-white text-xl font-semibold p-4">
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
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 ease-in-out mt-4"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-blackishbg text-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blackishbginside text-white text-xl font-semibold p-4">
            Test Result
          </div>
          <div className="p-6">
          <div 
        className="text-white mb-4" 
        dangerouslySetInnerHTML={{ __html: result }} // Use dangerouslySetInnerHTML here
      />
            
          </div>
        </div>
      )}

      <button
        onClick={() => navigate('/')}
        className="mt-8 bg-gray-500 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 transition duration-300 ease-in-out block mx-auto"
      >
        Back to Home
      </button>
    </div>
  );
}

export default ProgressTracker;