import React, { useState } from 'react';
import { Search, BookOpen, Video, ChevronRight } from 'lucide-react';
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
  <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center mb-4">
      {resource.type === 'article' ? (
        <BookOpen className="text-blue-400 mr-2" />
      ) : (
        <Video className="text-green-400 mr-2" />
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
    <div className="min-h-screen bg-gray-900 text-white" style={{backgroundImage: `url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwD1526PHQ8xSpfshhYkmqjaqpaqhCg8onZg&s)`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Resource Library</h1>
        
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-full py-2 px-4 pl-10 focus:outline-none focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-full ${filter === 'all' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition-colors duration-300`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`px-4 py-2 rounded-full ${filter === 'article' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition-colors duration-300`}
              onClick={() => setFilter('article')}
            >
              Articles
            </button>
            <button
              className={`px-4 py-2 rounded-full ${filter === 'video' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition-colors duration-300`}
              onClick={() => setFilter('video')}
            >
              Videos
            </button>
          </div>
        </div>

        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No resources found. Try adjusting your search or filter.</p>
        )}
      </div>
      <button style={{ marginLeft: '100px' }}
        onClick={() => navigate('/')}
        className="mb-4 bg-dark-maroonn text-white font-bold py-2 px-4 rounded hover:bg-light-maroon transition duration-300"
      >
        Back to Home
      </button>
    </div>
  );
};

export default ResourceLibrary;