import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { apiClient } from './Config';

function DailyJournal() {
  const [entries, setEntries] = useState([]);
  const [message, setMessage] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await apiClient.get('/journal', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.message) {
        setMessage(response.data.message);
      } else {
        setEntries(response.data.map(entry => ({
          id: entry.id || entry._id,
          content: entry.content,
          date: entry.date
        })));
      }
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      setMessage('Please Login to post Journal entries.');
    }
  };

  const onSubmit = async (data) => {
    try {
      const entryData = {
        content: data.content
      };
      const response = await apiClient.post('/journal', entryData, {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Server response:', response.data);
      reset();
      fetchEntries();
    } catch (error) {
      console.error('Error creating journal entry:', error.response ? error.response.data : error.message);
      setMessage(error.response?.data?.detail || 'An error occurred while creating the entry.');
    }
  };

  const deleteEntry = async (entryId) => {
    try {
      await apiClient.delete(`/journal/${entryId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchEntries();
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      setMessage('An error occurred while deleting the entry.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-black via-indigo-900 to-purple-900 p-4" >
      <h1 className="text-4xl font-bold text-white mb-8">Daily Journal</h1>
      
      {message ? (
        <div>
        <div className="bg-dark-maroonn text-white p-4 rounded-md mb-8">
          {message}
        </div>
        <br></br>
        <button
        onClick={() => navigate('/')}
        className="mt-8 bg-dark-maroonn text-white font-bold py-2 px-4 rounded hover:bg-light-maroon transition duration-300"
      >
        Back to Home
      </button>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
            <textarea
              {...register('content', { required: true })}
              className="w-full p-2 rounded-md bg-blackishbginside text-white"
              rows="4"
              placeholder="Write your thoughts here..."
            ></textarea>
            <button
              type="submit"
              className="mt-2 bg-dark-maroonn text-white font-bold py-2 px-4 rounded hover:bg-light-maroon transition duration-300"
            >
              Save Entry
            </button>
            &nbsp; &nbsp;
            <button
        onClick={() => navigate('/')}
        className="mt-8 bg-dark-maroonn text-white font-bold py-2 px-4 rounded hover:bg-light-maroon transition duration-300"
      >
        Back to Home
      </button>
          </form>

          <h2 className="text-2xl font-bold text-white mb-4">Your Journal Entries:</h2>

          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="bg-blackishbginside text-white p-4 rounded-md shadow flex justify-between items-start">
                <div>
                  <p className="text-white"><b>{entry.content}</b></p>
                  <p className="text-sm text-white mt-2">
                    {new Date(entry.date).toLocaleString()}
                  </p>
                </div>
                <button 
                  onClick={() => deleteEntry(entry.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      
    
    </div>
  );
}

export default DailyJournal;