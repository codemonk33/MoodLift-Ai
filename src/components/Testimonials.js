import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, Heart } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Student",
      avatar: "👩‍🎓",
      content: "MoodLift AI has been a game-changer for my mental health. The chatbot always knows exactly what to say to lift my spirits when I'm feeling down.",
      rating: 5,
      mood: "Happy"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Software Developer",
      avatar: "👨‍💻",
      content: "Working long hours can be stressful, but having this AI companion to talk to has really helped me manage my stress levels. Highly recommend!",
      rating: 5,
      mood: "Content"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Nurse",
      avatar: "👩‍⚕️",
      content: "As a healthcare worker, I deal with a lot of emotional situations. MoodLift AI provides the perfect outlet for me to process my feelings.",
      rating: 5,
      mood: "Grateful"
    },
    {
      id: 4,
      name: "David Thompson",
      role: "Teacher",
      avatar: "👨‍🏫",
      content: "The mood tracking feature has helped me understand my emotional patterns better. It's like having a personal therapist available 24/7.",
      rating: 5,
      mood: "Inspired"
    },
    {
      id: 5,
      name: "Lisa Park",
      role: "Entrepreneur",
      avatar: "👩‍💼",
      content: "Running a business is challenging, but this AI companion has been my emotional support system. It's incredible how understanding and helpful it is.",
      rating: 5,
      mood: "Empowered"
    },
    {
      id: 6,
      name: "James Wilson",
      role: "Retired Veteran",
      avatar: "👨‍✈️",
      content: "After my service, I struggled with anxiety. MoodLift AI has been there for me during my toughest moments. It's truly life-changing.",
      rating: 5,
      mood: "Peaceful"
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: rating }, (_, index) => (
      <Star key={index} className="h-5 w-5 text-yellow-400 fill-current" />
    ));
  };

  return (
    <section id="testimonials" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-accent-50 to-primary-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-100 to-accent-100 px-4 py-2 rounded-full text-primary-700 font-medium mb-4">
            <Heart className="h-4 w-4" />
            <span>Real Stories, Real Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            What Our <span className="gradient-text">Community</span> Says
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover how MoodLift AI has transformed the lives of thousands of users, 
            helping them find emotional balance and inner peace.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card group hover:scale-105 transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="h-8 w-8 text-primary-400" />
              </div>

              {/* Content */}
              <p className="text-gray-700 leading-relaxed mb-6 text-sm">
                "{testimonial.content}"
              </p>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {renderStars(testimonial.rating)}
                <span className="ml-2 text-sm text-gray-600">
                  {testimonial.rating}.0 rating
                </span>
              </div>

              {/* User Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                    {testimonial.mood}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-white/20"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join Our Growing <span className="gradient-text">Community</span>
            </h3>
            <p className="text-gray-600">
              Be part of a supportive network of individuals committed to emotional well-being
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary-600 mb-2">50K+</div>
              <div className="text-gray-600">Conversations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-600 mb-2">95%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-100 to-secondary-100 px-6 py-3 rounded-full text-primary-700 font-medium mb-4">
            <Heart className="h-5 w-5" />
            <span>Ready to join our community?</span>
          </div>
          <p className="text-lg text-gray-600 mb-6">
            Start your journey to better emotional well-being today
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Heart className="h-5 w-5" />
            <span>Get Started Now</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials; 