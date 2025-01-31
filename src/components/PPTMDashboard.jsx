import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Box,
  CircularProgress,
  Switch,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { apiClient } from './Config';
import { motion } from 'framer-motion';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

const PPTMDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    healthScore: true,
    psychologicalProfile: true,
    recommendations: true,
    insights: true,
    advancedAnalytics: true,
    sleepTrends: true,
    stressLevels: true,
    activityBreakdown: true,
  });
  const navigate = useNavigate();

  const loadingPhrases = [
    "Analyzing your psychological score based on your activity...",
    "Processing behavioral patterns...",
    "Calculating personality insights...",
    "Generating your personalized report...",
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        const response = await apiClient.get(`/pptm/dashboard/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDashboardData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Loading phrases rotation effect
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [loading]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        className='bg-gradient-to-br from-black via-indigo-900 to-purple-900'
      >
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography color='white' variant="body1" sx={{ textAlign: 'center' }}>
            {loadingPhrases[loadingPhraseIndex]}
          </Typography>
        </motion.div>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" variant="filled">
        {error}
      </Alert>
    );
  }

  const radarData = [
    {
      subject: 'Emotional Stability',
      A: dashboardData?.current_metrics?.psychological_dimensions?.emotional_stability || 0,
      fullMark: 100,
    },
    {
      subject: 'Social Engagement',
      A: dashboardData?.current_metrics?.psychological_dimensions?.social_engagement || 0,
      fullMark: 100,
    },
    {
      subject: 'Cognitive Flexibility',
      A: dashboardData?.current_metrics?.psychological_dimensions?.cognitive_flexibility || 0,
      fullMark: 100,
    },
    {
      subject: 'Stress Resilience',
      A: dashboardData?.current_metrics?.psychological_dimensions?.stress_resilience || 0,
      fullMark: 100,
    },
  ];

  const moodTrendData = dashboardData?.historical_data || [];
  const sleepTrendData = dashboardData?.sleep_data || [];
  const stressLevelData = dashboardData?.stress_data || [];
  const activityBreakdownData = dashboardData?.activity_data || [];
  

  const correlationData = [
    { x: 70, y: 80, z: 200 }, // Example data
    { x: 60, y: 70, z: 150 },
    { x: 50, y: 60, z: 100 },
  ];

  return (
    <Box
      sx={{
        padding: '2rem',
        bgcolor: darkMode ? '#121212' : '#f5f5f5',
        minHeight: '100vh',
        color: darkMode ? '#000' : '#000',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
        <Box display="flex" alignItems="center">
          <Typography variant="body1" sx={{ mr: 1 }}>
            Dark Mode
          </Typography>
          <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </Box>
      </Box>

      {/* Health Score */}
      <Card sx={{ mb: 4, bgcolor: darkMode ? '#1e1e1e' : '#fff' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" gutterBottom>
              Psychological Health Score
            </Typography>
            <IconButton onClick={() => toggleSection('healthScore')}>
              {expandedSections.healthScore ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          <Collapse in={expandedSections.healthScore}>
            <Typography
              variant="h2"
              sx={{ textAlign: 'center', color: '#2563eb', fontWeight: 'bold' }}
            >
              {Math.round(dashboardData?.current_metrics?.health_score || 0)}
            </Typography>
            <Typography sx={{ textAlign: 'center', color: darkMode ? '#aaa' : '#757575' }}>
              out of 100
            </Typography>
          </Collapse>
        </CardContent>
      </Card>

      {/* Psychological Profile Radar Chart */}
      <Card sx={{ mb: 4, bgcolor: darkMode ? '#1e1e1e' : '#fff' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" gutterBottom>
              Psychological Profile
            </Typography>
            <IconButton onClick={() => toggleSection('psychologicalProfile')}>
              {expandedSections.psychologicalProfile ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          <Collapse in={expandedSections.psychologicalProfile}>
            <Box sx={{ width: '100%', height: '400px' }}>
              <RadarChart width={600} height={400} data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Current Profile"
                  dataKey="A"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.6}
                />
                <Tooltip />
                <Legend />
              </RadarChart>
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card sx={{ mb: 4, bgcolor: darkMode ? '#1e1e1e' : '#fff' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" gutterBottom>
              Personalized Recommendations
            </Typography>
            <IconButton onClick={() => toggleSection('recommendations')}>
              {expandedSections.recommendations ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          <Collapse in={expandedSections.recommendations}>
            <Box>
              {dashboardData?.recommendations?.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Box
                    sx={{
                      padding: '1rem',
                      backgroundColor: darkMode ? '#333' : '#e3f2fd',
                      borderRadius: '8px',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" color="primary">
                      {rec.title}
                    </Typography>
                    <Typography sx={{ color: darkMode ? '#aaa' : '#616161' }}>
                      {rec.description}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card sx={{ mb: 4, bgcolor: darkMode ? '#1e1e1e' : '#fff' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" gutterBottom>
              Insights
            </Typography>
            <IconButton onClick={() => toggleSection('insights')}>
              {expandedSections.insights ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          <Collapse in={expandedSections.insights}>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Card sx={{ bgcolor: darkMode ? '#333' : '#f5f5f5' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Stress Triggers
                  </Typography>
                  <ul style={{ paddingLeft: '1.5rem' }}>
                    {dashboardData?.insights?.triggers?.map((trigger, index) => (
                      <li key={index} style={{ color: darkMode ? '#aaa' : '#616161' }}>
                        {trigger}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card sx={{ bgcolor: darkMode ? '#333' : '#f5f5f5' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Coping Mechanisms
                  </Typography>
                  <ul style={{ paddingLeft: '1.5rem' }}>
                    {dashboardData?.insights?.coping_mechanisms?.map((mechanism, index) => (
                      <li key={index} style={{ color: darkMode ? '#aaa' : '#616161' }}>
                        {mechanism}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      {/* Advanced Analytics */}
      <Card sx={{ mb: 4, bgcolor: darkMode ? '#1e1e1e' : '#fff' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" gutterBottom>
              Advanced Analytics
            </Typography>
            <IconButton onClick={() => toggleSection('advancedAnalytics')}>
              {expandedSections.advancedAnalytics ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          <Collapse in={expandedSections.advancedAnalytics}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Mood Trends Over Time
              </Typography>
              <Box sx={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer>
                  <LineChart data={moodTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      formatter={(value) => [`${value}%`, 'Mood']}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 8 }}
                      name="Mood Level"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
      {/* AI-Generated Insights */}
      <Card sx={{ mb: 4, bgcolor: darkMode ? '#1e1e1e' : '#fff' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" gutterBottom>
              AI-Generated Insights
            </Typography>
            <IconButton onClick={() => toggleSection('aiGeneratedInsights')}>
              {expandedSections.aiGeneratedInsights ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          <Collapse in={expandedSections.aiGeneratedInsights}>
            <Box>
              {dashboardData?.ai_insights?.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Box
                    sx={{
                      padding: '1rem',
                      backgroundColor: darkMode ? '#333' : '#e3f2fd',
                      borderRadius: '8px',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" color="primary">
                      {insight.title}
                    </Typography>
                    <Typography sx={{ color: darkMode ? '#aaa' : '#616161' }}>
                      {insight.description}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PPTMDashboard;