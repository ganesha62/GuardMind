import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaReply } from 'react-icons/fa';
import {apiClient} from '../components/Config.js';

function CommunityForum() {
  const [posts, setPosts] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [message, setMessage] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await apiClient.get('/community', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.message) {
        setMessage(response.data.message);
      } else {
        setPosts(response.data);
      }
    } catch (error) {
      console.error('Error fetching community posts:', error);
      setMessage('Please Login to view the Community Posts');
    }
  };

  const onSubmit = async (data) => {
    try {
      let response;
      if (replyingTo) {
        response = await apiClient.post(`/community/${replyingTo}/reply`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setPosts(prevPosts => prevPosts.map(post => 
          post._id === replyingTo 
            ? { ...post, replies: [...(post.replies || []), response.data] }
            : post
        ));
        setReplyingTo(null);
      } else {
        response = await apiClient.post('/community', data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setPosts(prevPosts => [response.data, ...prevPosts]);
      }
      reset();
    } catch (error) {
      console.error('Error creating post:', error);
      setMessage('An error occurred while creating the post.');
    }
  };

  const deletePost = async (postId) => {
    try {
      await apiClient.delete(`/community/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      setMessage('An error occurred while deleting the post.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8">Community Forum</h1>
      
      {message ? (
        <div>
        <div className="bg-dark-maroonn text-white p-4 rounded-md mb-8">
          {message}
        
        </div>
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
              placeholder={replyingTo ? "Write your reply here..." : "Share your thoughts with the community..."}
            ></textarea>
            <button
              type="submit"
              className="mt-2 bg-dark-maroonn text-white font-bold py-2 px-4 rounded hover:bg-light-maroon transition duration-300"
            >
              {replyingTo ? "Post Reply" : "Create Post"}
            </button>
            {replyingTo && (
              <button
                onClick={() => setReplyingTo(null)}
                className="mt-2 ml-2 bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 transition duration-300"
              >
                Cancel Reply
              </button>
            )}
                  &nbsp;&nbsp;
      <button
        onClick={() => navigate('/')}
        className="mt-8 bg-dark-maroonn text-white font-bold py-2 px-4 rounded hover:bg-light-maroon transition duration-300"
      >
        Back to Home
      </button>
          </form>

          <h2 className="text-2xl font-bold text-white mb-4">Community Posts:</h2>

          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post._id} className="bg-blackishbg p-4 rounded-md shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white"><b>{post.content}</b></p>
                    <p className="text-sm text-gray-400 mt-2">
                      Posted by: {post.username} at {new Date(post.date).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <button 
                      onClick={() => setReplyingTo(post._id)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      <FaReply />
                    </button>
                    {post.is_owner && (
                      <button 
                        onClick={() => deletePost(post._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>
                {post.replies && post.replies.length > 0 && (
                  <div className="mt-4 ml-8 space-y-2">
                    {post.replies.map((reply) => (
                      <div key={reply._id} className="bg-blackishbginside p-2 rounded-md">
                        <p className="text-white">{reply.content}</p>
                        <p className="text-xs text-gray-300">
                          Reply by: {reply.username} at {new Date(reply.date).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
}

export default CommunityForum;