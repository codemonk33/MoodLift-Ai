import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Heart } from 'lucide-react';

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);

  const moods = [
    { emoji: '😃', name: 'Happy', color: 'from-green-400 to-green-500', message: "You're radiating positivity! Keep spreading that joy around. 🌟" },
    { emoji: '😊', name: 'Content', color: 'from-blue-400 to-blue-500', message: "Inner peace is a beautiful state. You're doing great! ✨" },
    { emoji: '😐', name: 'Neutral', color: 'from-gray-400 to-gray-500', message: "It's okay to feel neutral. Every emotion has its place. 💙" },
    { emoji: '😢', name: 'Sad', color: 'from-blue-400 to-blue-500', message: "Your feelings are valid. Remember, this too shall pass. 🌈" },
    { emoji: '😡', name: 'Angry', color: 'from-red-400 to-red-500', message: "Take deep breaths. You have the strength to overcome this. 💪" },
    { emoji: '😴', name: 'Tired', color: 'from-purple-400 to-purple-500', message: "Rest is essential. Be kind to yourself today. 🌙" },
    { emoji: '🤔', name: 'Confused', color: 'from-yellow-400 to-yellow-500', message: "Uncertainty is part of growth. You'll figure it out! 🌱" },
    { emoji: '🥰', name: 'Loved', color: 'from-pink-400 to-pink-500', message: "You are worthy of love and deserve all the happiness! 💖" }
  ];

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    
    const newMoodEntry = {
      id: Date.now(),
      mood: mood,
      timestamp: new Date()
    };
    
    setMoodHistory(prev => [newMoodEntry, ...prev.slice(0, 6)]); // Keep last 7 entries
  };

  const getMoodTrend = () => {
    if (moodHistory.length < 2) return 'neutral';
    
    const recentMoods = moodHistory.slice(0, 3);
    const positiveMoods = ['Happy', 'Content', 'Loved'];
    const negativeMoods = ['Sad', 'Angry', 'Tired'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    recentMoods.forEach(entry => {
      if (positiveMoods.includes(entry.mood.name)) positiveCount++;
      if (negativeMoods.includes(entry.mood.name)) negativeCount++;
    });
    
    if (positiveCount > negativeCount) return 'improving';
    if (negativeCount > positiveCount) return 'declining';
    return 'stable';
  };

  const getTrendIcon = () => {
    const trend = getMoodTrend();
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'declining':
        return <TrendingUp className="h-5 w-5 text-red-500 transform rotate-180" />;
      default:
        return <TrendingUp className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTrendText = () => {
    const trend = getMoodTrend();
    switch (trend) {
      case 'improving':
        return 'Your mood is improving!';
      case 'declining':
        return 'Your mood seems down lately.';
      default:
        return 'Your mood is stable.';
    }
  };

  return (
    <section id="mood-tracker" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-secondary-50 to-primary-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Track Your <span className="gradient-text">Mood Journey</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Monitor your emotional well-being and discover patterns that help you understand yourself better.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Mood Selection */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="card"
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <Heart className="h-6 w-6 text-primary-500 mr-3" />
              How are you feeling today?
            </h3>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              {moods.map((mood) => (
                <motion.button
                  key={mood.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMoodSelect(mood)}
                  className={`p-4 rounded-2xl transition-all duration-300 ${
                    selectedMood?.name === mood.name
                      ? `bg-gradient-to-br ${mood.color} text-white shadow-lg scale-105`
                      : 'bg-white hover:shadow-md border-2 border-gray-100 hover:border-primary-200'
                  }`}
                >
                  <div className="text-3xl mb-2">{mood.emoji}</div>
                  <div className="text-sm font-medium">{mood.name}</div>
                </motion.button>
              ))}
            </div>

            {selectedMood && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-2xl border border-primary-200"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{selectedMood.emoji}</div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">
                    You're feeling {selectedMood.name}
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedMood.message}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Mood History & Analytics */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Mood Trend */}
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 text-primary-500 mr-2" />
                Mood Trend
              </h3>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                {getTrendIcon()}
                <div>
                  <p className="font-medium text-gray-900">{getTrendText()}</p>
                  <p className="text-sm text-gray-600">Based on your recent entries</p>
                </div>
              </div>
            </div>

            {/* Recent Mood History */}
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 text-primary-500 mr-2" />
                Recent Moods
              </h3>
              
              {moodHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-3">📊</div>
                  <p>Start tracking your mood to see your history here!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {moodHistory.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{entry.mood.emoji}</span>
                        <div>
                          <p className="font-medium text-gray-900">{entry.mood.name}</p>
                          <p className="text-sm text-gray-600">
                            {entry.timestamp.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="card bg-gradient-to-r from-accent-50 to-accent-100 border-accent-200">
              <h3 className="text-xl font-semibold text-accent-900 mb-3">💡 Pro Tip</h3>
              <p className="text-accent-800">
                Tracking your mood regularly helps identify triggers and patterns. 
                Consider logging your mood at the same time each day for consistency!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MoodTracker; 