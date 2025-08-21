import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const isHomePage = location.pathname === '/';

  return (
    <nav className={`${
      isDarkMode 
        ? 'bg-gray-800/80 border-gray-700' 
        : 'bg-white/80 border-white/20'
    } backdrop-blur-lg border-b sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex items-center space-x-2"
          >
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className={`text-xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                MoodLift AI
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          {isHomePage && (
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className={`${
                isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
              } transition-colors duration-200`}>
                About
              </a>
              <a href="#features" className={`${
                isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
              } transition-colors duration-200`}>
                Features
              </a>
              <a href="#testimonials" className={`${
                isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
              } transition-colors duration-200`}>
                Testimonials
              </a>
              <a href="#contact" className={`${
                isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
              } transition-colors duration-200`}>
                Contact
              </a>
            </div>
          )}

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
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

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {user?.firstName}
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
            ) : (
              <>
                <Link
                  to="/login"
                  className={`${
                    isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
                  } transition-colors duration-200`}
                >
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className={`${
                isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
              } transition-colors duration-200`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-t ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isHomePage && (
                <>
                  <a href="#about" className={`block px-3 py-2 ${
                    isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
                  } transition-colors duration-200`}>
                    About
                  </a>
                  <a href="#features" className={`block px-3 py-2 ${
                    isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
                  } transition-colors duration-200`}>
                    Features
                  </a>
                  <a href="#testimonials" className={`block px-3 py-2 ${
                    isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
                  } transition-colors duration-200`}>
                    Testimonials
                  </a>
                  <a href="#contact" className={`block px-3 py-2 ${
                    isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
                  } transition-colors duration-200`}>
                    Contact
                  </a>
                </>
              )}
              
              {/* Theme Toggle Mobile */}
              <button
                onClick={toggleTheme}
                className={`w-full text-left px-3 py-2 ${
                  isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
                } transition-colors duration-200`}
              >
                {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>

              {/* Auth Buttons Mobile */}
              {isAuthenticated ? (
                <div className="pt-4 space-y-2">
                  <div className={`px-3 py-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                    <p className="text-sm">@{user?.username}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-red-600 hover:text-red-700 transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-4 space-y-2">
                  <Link
                    to="/login"
                    className={`block px-3 py-2 ${
                      isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
                    } transition-colors duration-200`}
                  >
                    Sign In
                  </Link>
                  <Link to="/register" className="block w-full btn-primary">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 
