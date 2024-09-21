import React from 'react';
import { Phone, AlertTriangle } from 'lucide-react';
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
    <div className="bg-blackishbg container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8">Crisis Support</h1>
      
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8" role="alert">
        <div className="flex">
          <AlertTriangle className="h-6 w-6 mr-2" />
          <div>
            <p className="font-bold">Emergency</p>
            <p>If you or someone you know is in immediate danger, please call your local emergency services immediately.</p>
          </div>
        </div>
      </div>

      <div className="bg-blackishbginside text-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Mental Health Helplines</h2>
        <ul className="space-y-4">
          {helplines.map((helpline, index) => (
            <li key={index} className="flex items-center">
              <Phone className="mr-2" />
              <span>
                <strong>{helpline.country}:</strong> {helpline.name} - {helpline.number}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-blackishbginside text-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">What to Do in a Mental Health Emergency</h2>
        <ol className="list-decimal list-inside space-y-2">
          {emergencySteps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div><br></br>
      <button
        onClick={() => navigate('/')}
        className="mb-4 bg-dark-maroonn text-white font-bold py-2 px-4 rounded hover:bg-light-maroon transition duration-300"
      >
        Back to Home
      </button>
    </div>
  );
};

export default CrisisSupport;