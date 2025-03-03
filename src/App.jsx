import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Auth from './components/Auth';
import MoodTracker from './components/MoodTracker';
import CBTExercises from './components/CBTExercises';
import Meditation from './components/Meditation';
import Chatbot from './components/Chatbot';
import CommunityForum from './components/CommunityForum';
import ResourceLibrary from './components/ResourceLibrary';
import ProgressTracker from './components/ProgressTracker';
import DailyJournal from './components/DailyJournal';
import CrisisSupport from './components/CrisisSupport';
import PPTMDashboard from './components/PPTMDashboard';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-black via-indigo-900 to-purple-900 p-4" >
        <Routes>
          <Route 
            path="/auth" 
            element={isLoggedIn ? <Navigate to="/" /> : <Auth setIsLoggedIn={setIsLoggedIn} />} 
          />
          <Route
            path="/"
            element={isLoggedIn ? <Home setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/auth" />}
          />
          <Route
            path="/mood-tracker"
            element={isLoggedIn ? <MoodTracker /> : <Navigate to="/auth" />}
          />
          <Route
            path="/cbt-exercises"
            element={isLoggedIn ? <CBTExercises /> : <Navigate to="/auth" />}
          />
          <Route
            path="/meditation"
            element={isLoggedIn ? <Meditation /> : <Navigate to="/auth" />}
          />
          <Route
            path="/chatbot"
            element={isLoggedIn ? <Chatbot /> : <Navigate to="/auth" />}
          />
          <Route
            path="/community-forum"
            element={isLoggedIn ? <CommunityForum /> : <Navigate to="/auth" />}
          />
          <Route
            path="/resource-library"
            element={isLoggedIn ? <ResourceLibrary /> : <Navigate to="/auth" />}
          />
                  <Route path="/progress"   element={isLoggedIn ? <ProgressTracker /> : <Navigate to="/auth" />} />
        <Route path="/journal"   element={isLoggedIn ? <DailyJournal /> : <Navigate to="/auth" />} /> 
        <Route path="/crisis"   element={isLoggedIn ? <CrisisSupport /> : <Navigate to="/auth" />} />
<Route path="/pptm" element={isLoggedIn ?<PPTMDashboard />: <Navigate to="/auth" />} />
        </Routes>

        
      </div>
    </Router>
  );
}

export default App;