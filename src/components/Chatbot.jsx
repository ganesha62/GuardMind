import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Mic, MicOff } from 'lucide-react';
import { apiClient } from '../components/Config.js';

const Chatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize speech recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

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

  // Set up speech recognition handlers
  recognition.onstart = () => {
    setIsListening(true);
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setInput(transcript);
    setIsListening(false);
    // Automatically send message after voice input
    handleSendVoiceMessage(transcript);
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    setIsListening(false);
  };

  recognition.onend = () => {
    setIsListening(false);
  };

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

  const handleSendVoiceMessage = async (voiceInput) => {
    if (!voiceInput.trim()) return;

    const newMessage = { text: voiceInput, sender: 'user' };
    setMessages([...messages, newMessage]);
    setInput('');

    try {
      const token = localStorage.getItem('token');
      const response = await apiClient.post('/chat', {
        message: voiceInput,
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

  const toggleVoiceInput = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-black via-indigo-900 to-purple-900 p-4">
      <h1 className="text-2xl sm:text-4xl font-bold text-white p-4">Mental Health Chatbot</h1>
      
      <div className="flex-grow flex flex-col sm:flex-row overflow-hidden">
        {!isGuest && (
          <div className="w-full sm:w-1/4 bg-gray-800 p-4 overflow-y-auto">
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
                <span onClick={() => loadChat(chat.id)} className="truncate flex-grow mr-2">
                  {new Date(chat.created_at).toLocaleString()}
                </span>
                <button
                  onClick={(e) => deleteChat(chat.id, e)}
                  className="text-red-500 hover:text-red-700 flex-shrink-0"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className={`flex-grow flex flex-col bg-gray-800 ${isGuest ? 'w-full' : ''}`}>
          <div 
            className="flex-grow p-4 overflow-y-auto" 
            style={{ 
              maxHeight: 'calc(100vh - 240px)', 
              backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPkiuItwmZIyMoc0eBJxifrRhSKUe5ZMYtlyS9oMuErc3xlGfRZdlfXaWSs31yLN-WZ4U&usqp=CAU')`, 
              backgroundRepeat: 'no-repeat', 
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                <span
                  className={`inline-block p-2 rounded-lg max-w-[80%] ${
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
                placeholder={isListening ? 'Listening...' : 'Type your message...'}
              />
              <button
                onClick={toggleVoiceInput}
                className={`p-2 rounded ${
                  isListening 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                } transition duration-300`}
                title={isListening ? "Stop voice input" : "Start voice input"}
              >
                {isListening ? <MicOff className="text-white" /> : <Mic className="text-white" />}
              </button>
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
        className="m-4 bg-dark-maroon text-white font-bold py-2 px-4 rounded hover:bg-light-maroon transition duration-300"
      >
        Back to Home
      </button>
    </div>
  );
};

export default Chatbot;