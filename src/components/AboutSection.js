import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Shield, Zap, Users, Clock, Star, Target } from 'lucide-react';

const AboutSection = () => {
  const benefits = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Advanced machine learning algorithms understand your emotional patterns and provide personalized support.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Heart,
      title: "Emotional Support",
      description: "24/7 compassionate companionship that listens without judgment and offers gentle encouragement.",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: Shield,
      title: "Safe & Private",
      description: "Your conversations are completely confidential and secure, creating a safe space for emotional expression.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Zap,
      title: "Instant Response",
      description: "Get immediate emotional support whenever you need it, without waiting for appointments or callbacks.",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with others on similar emotional journeys and share experiences in a supportive environment.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Clock,
      title: "Always Available",
      description: "Round-the-clock support means you're never alone, even during your darkest moments.",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const stats = [
    { number: "95%", label: "Mood Improvement", icon: Star },
    { number: "10K+", label: "Happy Users", icon: Users },
    { number: "24/7", label: "Availability", icon: Clock },
    { number: "100%", label: "Confidential", icon: Shield }
  ];

  return (
    <section id="about" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            How <span className="gradient-text">MoodLift AI</span> Transforms Your Well-being
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our AI-powered emotional companion is designed to understand, support, and uplift you 
            through intelligent conversations and personalized insights that promote mental wellness.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card group hover:scale-105 transition-all duration-300"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <benefit.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-3xl p-8 lg:p-12 mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              How It <span className="gradient-text">Works</span>
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the power of AI-driven emotional support in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Start a Conversation</h4>
              <p className="text-gray-600">
                Simply open the chat and begin sharing your thoughts, feelings, or concerns.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">AI Analysis</h4>
              <p className="text-gray-600">
                Our AI analyzes your emotional state and provides personalized, empathetic responses.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Feel Better</h4>
              <p className="text-gray-600">
                Experience improved mood, reduced stress, and enhanced emotional well-being.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl p-8 lg:p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Transform Your Emotional Well-being?
            </h3>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have already discovered the power of AI-driven emotional support.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary-600 font-semibold py-4 px-8 rounded-full text-lg hover:bg-gray-100 transition-colors duration-300 inline-flex items-center space-x-2"
            >
              <Target className="h-5 w-5" />
              <span>Start Your Journey</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection; 