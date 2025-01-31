import React from 'react';
import { Phone, AlertTriangle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CrisisSupport = () => {
  const helplines = [
    { country: 'United States', number: '1-800-273-8255', name: 'National Suicide Prevention Lifeline' },
    { country: 'United Kingdom', number: '116 123', name: 'Samaritans' },
    { country: 'Canada', number: '1-833-456-4566', name: 'Crisis Services Canada' },
    { country: 'Australia', number: '13 11 14', name: 'Lifeline' },
    { country: 'India', number: '91-9820466726', name: 'Aasra' },
  ];
  const navigate = useNavigate();

  const emergencySteps = [
    'Ensure your own safety first',
    'Call your local emergency number (e.g., 911 in the US)',
    'Stay with the person until help arrives',
    'Remove any objects that could be used for self-harm',
    'Listen without judgment and offer reassurance',
  ];

  return (
    <div className="bg-gradient-to-br from-black via-indigo-900 to-purple-900 p-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-8 text-center">
          Crisis Support
        </h1>

        {/* Emergency Alert */}
        <div className="bg-red-900/20 border-l-4 border-red-500 text-red-200 p-6 rounded-lg mb-8 flex items-start space-x-4">
          <AlertTriangle className="h-8 w-8 flex-shrink-0" />
          <div>
            <p className="font-bold text-lg">Emergency</p>
            <p className="text-sm">
              If you or someone you know is in immediate danger, please call your local emergency services immediately.
            </p>
          </div>
        </div>

        {/* Helplines Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <Phone className="mr-3" />
            Mental Health Helplines
          </h2>
          <ul className="space-y-4">
            {helplines.map((helpline, index) => (
              <li
                key={index}
                className="bg-gray-700/30 hover:bg-gray-700/50 transition-all duration-300 p-4 rounded-lg flex items-center space-x-4"
              >
                <span className="text-white flex-1">
                  <strong className="text-indigo-300">{helpline.country}:</strong>{' '}
                  {helpline.name} - <span className="text-green-400">{helpline.number}</span>
                </span>
                <a
                  href={`tel:${helpline.number}`}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300"
                >
                  Call Now
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Emergency Steps Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <AlertTriangle className="mr-3" />
            What to Do in a Mental Health Emergency
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-200">
            {emergencySteps.map((step, index) => (
              <li key={index} className="bg-gray-700/30 p-4 rounded-lg">
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Back to Home Button */}
        <button
          onClick={() => navigate('/')}
          className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition duration-300"
        >
          <Home className="h-5 w-5" />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
};

export default CrisisSupport;