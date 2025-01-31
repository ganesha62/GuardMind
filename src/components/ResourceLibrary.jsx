import React, { useState } from 'react';
import { Search, BookOpen, Video, ChevronRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const resources = [
  { id: 1, type: 'article', title: 'Understanding Anxiety Disorders', description: 'Learn about the different types of anxiety disorders and their symptoms.', link: 'https://newsinhealth.nih.gov/2016/03/understanding-anxiety-disorders' },
  { id: 2, type: 'video', title: 'Mindfulness Meditation Techniques', description: 'A guided video on practicing mindfulness for stress reduction.', link: 'https://www.youtube.com/watch?v=ssss7V1_eyA' },
  { id: 3, type: 'article', title: 'The Importance of Sleep for Mental Health', description: 'Explore the connection between sleep and mental well-being.', link: 'https://www.mentalhealth.org.uk/explore-mental-health/publications/sleep-matters-impact-sleep-health-and-wellbeing#:~:text=Sleep%20is%20an%20essential%20and,brains%2C%20not%20just%20our%20bodies.' },
  { id: 4, type: 'video', title: 'Cognitive Behavioral Therapy Explained', description: 'An overview of CBT and how it can help manage mental health issues.', link: 'https://www.youtube.com/watch?v=ZdyOwZ4_RnI' },
  { id: 5, type: 'article', title: 'Nutrition and Mental Health', description: 'Discover how diet can impact your mood and mental state.', link: 'https://www.health.harvard.edu/blog/nutritional-psychiatry-your-brain-on-food-201511168626' },
  { id: 6, type: 'video', title: 'Stress Management Strategies', description: 'Practical tips for managing stress in daily life.', link: 'https://www.youtube.com/watch?v=0fL-pn80s-c' },
];

const ResourceCard = ({ resource }) => (
  <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
    <div className="flex items-center mb-4">
      {resource.type === 'article' ? (
        <BookOpen className="text-blue-400 mr-3 h-6 w-6" />
      ) : (
        <Video className="text-green-400 mr-3 h-6 w-6" />
      )}
      <h3 className="text-xl font-semibold text-white">{resource.title}</h3>
    </div>
    <p className="text-gray-300 mb-4">{resource.description}</p>
    <a
      href={resource.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300"
    >
      Read more <ChevronRight className="ml-1" size={16} />
    </a>
  </div>
);

const ResourceLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const filteredResources = resources.filter(resource =>
    (filter === 'all' || resource.type === filter) &&
    resource.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-900 to-purple-900 p-4 text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          Resource Library
        </h1>

        {/* Search and Filter Section */}
        <div className="mb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-grow max-w-lg">
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full bg-gray-800/70 backdrop-blur-sm text-white border border-gray-700 rounded-full py-3 px-5 pl-12 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          </div>
          <div className="flex gap-2">
            <button
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                filter === 'all' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                filter === 'article' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => setFilter('article')}
            >
              Articles
            </button>
            <button
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                filter === 'video' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => setFilter('video')}
            >
              Videos
            </button>
          </div>
        </div>

        {/* Resource Cards Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-lg">No resources found. Try adjusting your search or filter.</p>
        )}

        {/* Back to Home Button */}
        <button
          onClick={() => navigate('/')}
          className="mt-12 mx-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition duration-300"
        >
          <Home className="h-5 w-5" />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
};

export default ResourceLibrary;