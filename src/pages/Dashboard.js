import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Heart, 
  MessageCircle, 
  TrendingUp, 
  Calendar, 
  Settings, 
  LogOut,
  Plus,
  Bot,
  User,
  Moon,
  Sun
} from 'lucide-react';
import ChatInterface from '../components/ChatInterface';
import MoodTracker from '../components/MoodTracker';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Heart },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'mood', label: 'Mood Tracker', icon: TrendingUp },
    { id: 'history', label: 'History', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className={`min-h-screen ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`border-b ${
        isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white/80'
      } backdrop-blur-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
              >
                <Heart className="h-6 w-6 text-white" />
              </motion.div>
              <h1 className={`text-xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                MoodLift AI
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-100 hover:bg-gray-200'
                } transition-colors duration-200`}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </motion.button>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    @{user?.username}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className={`p-2 rounded-lg ${
                    isDarkMode 
                      ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400' 
                      : 'bg-red-100 hover:bg-red-200 text-red-600'
                  } transition-colors duration-200`}
                >
                  <LogOut className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className={`border-b ${
        isDarkMode ? 'border-gray-700 bg-gray-800/30' : 'border-gray-200 bg-white/50'
      } backdrop-blur-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : isDarkMode
                      ? 'border-transparent text-gray-300 hover:text-gray-100 hover:border-gray-300'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Welcome Section */}
            <div className={`rounded-2xl p-6 ${
              isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'
            } backdrop-blur-lg border ${
              isDarkMode ? 'border-gray-700' : 'border-white/20'
            }`}>
              <h2 className={`text-2xl font-bold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Welcome back, {user?.firstName}! 👋
              </h2>
              <p className={`${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                How are you feeling today? Let's check in on your emotional well-being.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsChatOpen(true)}
                className={`p-6 rounded-2xl ${
                  isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'
                } backdrop-blur-lg border ${
                  isDarkMode ? 'border-gray-700' : 'border-white/20'
                } hover:shadow-lg transition-all duration-200`}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Start Chat
                    </h3>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Talk to your AI companion
                    </p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('mood')}
                className={`p-6 rounded-2xl ${
                  isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'
                } backdrop-blur-lg border ${
                  isDarkMode ? 'border-gray-700' : 'border-white/20'
                } hover:shadow-lg transition-all duration-200`}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Track Mood
                    </h3>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Record how you're feeling
                    </p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('history')}
                className={`p-6 rounded-2xl ${
                  isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'
                } backdrop-blur-lg border ${
                  isDarkMode ? 'border-gray-700' : 'border-white/20'
                } hover:shadow-lg transition-all duration-200`}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      View History
                    </h3>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      See your progress over time
                    </p>
                  </div>
                </div>
              </motion.button>
            </div>

            {/* Recent Activity */}
            <div className={`rounded-2xl p-6 ${
              isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'
            } backdrop-blur-lg border ${
              isDarkMode ? 'border-gray-700' : 'border-white/20'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Recent Activity
              </h3>
              <div className={`text-center py-8 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No recent activity to show</p>
                <p className="text-sm">Start chatting or tracking your mood to see activity here</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'chat' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className={`rounded-2xl p-6 ${
              isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'
            } backdrop-blur-lg border ${
              isDarkMode ? 'border-gray-700' : 'border-white/20'
            }`}>
              <div className="text-center">
                <h3 className={`text-lg font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  AI Chat Companion
                </h3>
                <p className={`mb-6 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Ready to start a conversation? Click the button below to open the chat interface.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsChatOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  <MessageCircle className="h-5 w-5 inline mr-2" />
                  Open Chat
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'mood' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MoodTracker />
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`rounded-2xl p-6 ${
              isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'
            } backdrop-blur-lg border ${
              isDarkMode ? 'border-gray-700' : 'border-white/20'
            }`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Activity History
            </h3>
            <div className={`text-center py-8 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No history available yet</p>
              <p className="text-sm">Your chat sessions and mood entries will appear here</p>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`rounded-2xl p-6 ${
              isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'
            } backdrop-blur-lg border ${
              isDarkMode ? 'border-gray-700' : 'border-white/20'
            }`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Settings
            </h3>
            <div className={`text-center py-8 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Settings coming soon</p>
              <p className="text-sm">Customize your experience and preferences</p>
            </div>
          </motion.div>
        )}
      </main>

      {/* Chat Interface */}
      <ChatInterface
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
};

export default Dashboard; 