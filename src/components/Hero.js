import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles, ArrowRight } from 'lucide-react';

const Hero = ({ onStartChat }) => {
  return (
    <section id="home" className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-6"
            >
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-100 to-secondary-100 px-4 py-2 rounded-full text-primary-700 font-medium mb-4">
                <Sparkles className="h-4 w-4" />
                <span>AI-Powered Emotional Support</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Your Personal
                <span className="block gradient-text">Mood Companion</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Experience the power of AI-driven conversations that uplift your spirits, 
                reduce stress, and enhance your emotional well-being. 
                Your journey to better mental health starts here.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <button
                onClick={onStartChat}
                className="btn-primary inline-flex items-center space-x-2 group"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Start Chatting</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button className="btn-secondary">
                Learn More
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">10K+</div>
                <div className="text-sm text-gray-600">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-600">95%</div>
                <div className="text-sm text-gray-600">Mood Improvement</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-600">24/7</div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Chatbot Mascot */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Main Chatbot Bubble */}
              <motion.div
                className="relative w-80 h-80 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center shadow-2xl"
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Chatbot Face */}
                <div className="text-white text-8xl">🤖</div>
                
                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 360]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <MessageCircle className="h-8 w-8 text-white" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 w-12 h-12 bg-accent-400/80 rounded-full flex items-center justify-center"
                  animate={{ 
                    y: [0, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  <Sparkles className="h-6 w-6 text-white" />
                </motion.div>
              </motion.div>

              {/* Background Decorative Elements */}
              <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-accent-300 to-accent-400 rounded-full opacity-20 animate-float"></div>
              <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-gradient-to-br from-secondary-300 to-secondary-400 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
              <div className="absolute top-1/2 -right-12 w-16 h-16 bg-gradient-to-br from-primary-300 to-primary-400 rounded-full opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 