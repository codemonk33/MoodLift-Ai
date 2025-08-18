import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import Hero from '../components/Hero';
import ChatInterface from '../components/ChatInterface';
import MoodTracker from '../components/MoodTracker';
import AboutSection from '../components/AboutSection';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const Home = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { isDarkMode } = useTheme();
  const { isAuthenticated } = useAuth();

  return (
    <div className={`App min-h-screen ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900'
    }`}>
      <Navbar />

      <main>
        <Hero onStartChat={() => setIsChatOpen(true)} />
        <AboutSection />
        <MoodTracker />
        <Testimonials />
        
        {/* Call to Action Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`text-4xl md:text-5xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              Ready to Start Your Journey?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-xl mb-8 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Join thousands of users who have already improved their emotional well-being with MoodLift AI
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="btn-primary text-lg px-8 py-4"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn-primary text-lg px-8 py-4"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/login"
                    className="btn-secondary text-lg px-8 py-4"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      <ChatInterface
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
};

export default Home; 