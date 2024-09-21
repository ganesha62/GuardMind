import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import {apiClient} from '../components/Config.js';

const Chatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const messagesEndRef = useRef(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem('username');
    const isGuestUser = username === 'guest';
    setIsGuest(isGuestUser);
    if (!isGuestUser) {
      fetchChatHistory();
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiClient.get('/chat-history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setChatHistory(response.data);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const newMessage = { text: input, sender: 'user' };
    setMessages([...messages, newMessage]);
    setInput('');

    try {
      const token = localStorage.getItem('token');
      const response = await apiClient.post('/chat', {
        message: input,
        chat_id: isGuest ? null : currentChatId
      }, {
        headers: {
          'Authorization': `Bearer ${isGuest ? 'guest' : token}`
        }
      });
      
      setMessages(prevMessages => [...prevMessages, { text: response.data.response, sender: 'bot' }]);
      if (!isGuest && response.data.chat_id) {
        setCurrentChatId(response.data.chat_id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
  };

  const loadChat = async (chatId) => {
    if (isGuest) return;
    try {
      const token = localStorage.getItem('token');
      const response = await apiClient.get(`/chat/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMessages(response.data.messages);
      setCurrentChatId(chatId);
    } catch (error) {
      console.error('Error loading chat:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  const deleteChat = async (chatId, event) => {
    if (isGuest) return;
    event.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      await apiClient.delete(`/chat/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setChatHistory(chatHistory.filter(chat => chat.id !== chatId));
      if (currentChatId === chatId) {
        setMessages([]);
        setCurrentChatId(null);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col h-screen">
      <h1 className="text-4xl font-bold text-white mb-8">Mental Health Chatbot</h1>
      
      <div className="flex-grow flex space-x-4 overflow-hidden">
        {!isGuest && (
          <div className="w-1/4 bg-gray-800 p-4 rounded-lg overflow-y-auto">
            <h2 className="text-xl font-semibold text-white mb-4">Chat History</h2>
            <button
              onClick={startNewChat}
              className="w-full mb-4 bg-dark-maroon text-white font-bold py-2 px-4 rounded hover:bg-light-maroon transition duration-300"
            >
              Start New Chat
            </button>
            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                className="flex justify-between items-center cursor-pointer bg-gray-700 hover:bg-gray-600 p-2 rounded mb-2 text-white"
              >
                <span onClick={() => loadChat(chat.id)}>
                  {new Date(chat.created_at).toLocaleString()}
                </span>
                <button
                  onClick={(e) => deleteChat(chat.id, e)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className={`flex-grow flex flex-col bg-gray-800 rounded-lg overflow-hidden ${isGuest ? 'w-full' : ''}`}>
          <div className="flex-grow p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)', backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPkiuItwmZIyMoc0eBJxifrRhSKUe5ZMYtlyS9oMuErc3xlGfRZdlfXaWSs31yLN-WZ4U&usqp=CAU')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-dark-maroon text-white'
                      : 'bg-gray-700 text-white'
                  }`}
                >
                  {message.text}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 bg-gray-900">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-grow px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none"
                placeholder="Type your message..."
              />
              <button
                onClick={handleSend}
                className="bg-dark-maroon text-white font-bold py-2 px-4 rounded hover:bg-light-maroon transition duration-300"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <button
        onClick={() => navigate('/')}
        className="mt-8 bg-dark-maroon text-white font-bold py-2 px-4 rounded hover:bg-light-maroon transition duration-300"
      >
        Back to Home
      </button>
    </div>
  );
};

export default Chatbot;

