const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'angry', 'anxious', 'calm', 'excited', 'tired', 'neutral'],
    required: true
  },
  intensity: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
    default: 5
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
    trim: true
  },
  activities: [{
    type: String,
    trim: true
  }],
  triggers: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    trim: true
  },
  weather: {
    type: String,
    trim: true
  },
  sleepHours: {
    type: Number,
    min: 0,
    max: 24
  },
  exerciseMinutes: {
    type: Number,
    min: 0
  },
  socialInteraction: {
    type: String,
    enum: ['none', 'minimal', 'moderate', 'high'],
    default: 'moderate'
  },
  energyLevel: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  stressLevel: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for mood category
moodSchema.virtual('moodCategory').get(function() {
  const positiveMoods = ['happy', 'excited', 'calm'];
  const negativeMoods = ['sad', 'angry', 'anxious'];
  const neutralMoods = ['tired', 'neutral'];
  
  if (positiveMoods.includes(this.mood)) return 'positive';
  if (negativeMoods.includes(this.mood)) return 'negative';
  return 'neutral';
});

// Virtual for time of day
moodSchema.virtual('timeOfDay').get(function() {
  const hour = this.createdAt.getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
});

// Virtual for day of week
moodSchema.virtual('dayOfWeek').get(function() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[this.createdAt.getDay()];
});

// Indexes for better query performance
moodSchema.index({ userId: 1, createdAt: -1 });
moodSchema.index({ userId: 1, mood: 1 });
moodSchema.index({ userId: 1, 'moodCategory': 1 });
moodSchema.index({ userId: 1, intensity: 1 });
moodSchema.index({ createdAt: -1 });

// Pre-save middleware
moodSchema.pre('save', function(next) {
  // Auto-generate tags based on mood and activities
  if (!this.tags || this.tags.length === 0) {
    this.tags = [this.mood];
    if (this.activities && this.activities.length > 0) {
      this.tags.push(...this.activities.slice(0, 3));
    }
  }
  next();
});

// Instance methods
moodSchema.methods.updateMood = function(newMoodData) {
  Object.assign(this, newMoodData);
  return this.save();
};

moodSchema.methods.addActivity = function(activity) {
  if (!this.activities.includes(activity)) {
    this.activities.push(activity);
    return this.save();
  }
  return this;
};

moodSchema.methods.addTrigger = function(trigger) {
  if (!this.triggers.includes(trigger)) {
    this.triggers.push(trigger);
    return this.save();
  }
  return this;
};

// Static methods
moodSchema.statics.findByUser = function(userId, options = {}) {
  const { limit = 50, skip = 0, mood, startDate, endDate, sort = { createdAt: -1 } } = options;
  
  let query = { userId };
  
  if (mood) query.mood = mood;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
  
  return this.find(query)
    .sort(sort)
    .limit(parseInt(limit))
    .skip(parseInt(skip));
};

moodSchema.statics.getMoodStats = async function(userId, period = 'week') {
  const now = new Date();
  let startDate;
  
  switch (period) {
    case 'day':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
  
  const stats = await this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalEntries: { $sum: 1 },
        avgIntensity: { $avg: '$intensity' },
        avgEnergyLevel: { $avg: '$energyLevel' },
        avgStressLevel: { $avg: '$stressLevel' },
        moodDistribution: {
          $push: {
            mood: '$mood',
            intensity: '$intensity',
            category: '$moodCategory'
          }
        },
        activities: { $addToSet: '$activities' },
        triggers: { $addToSet: '$triggers' }
      }
    }
  ]);
  
  if (stats.length === 0) {
    return {
      totalEntries: 0,
      avgIntensity: 0,
      avgEnergyLevel: 0,
      avgStressLevel: 0,
      moodDistribution: {},
      topActivities: [],
      topTriggers: [],
      period
    };
  }
  
  const stat = stats[0];
  
  // Calculate mood distribution
  const moodCounts = {};
  const categoryCounts = { positive: 0, negative: 0, neutral: 0 };
  
  stat.moodDistribution.forEach(item => {
    moodCounts[item.mood] = (moodCounts[item.mood] || 0) + 1;
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });
  
  // Flatten activities and triggers arrays
  const allActivities = stat.activities.flat().filter(Boolean);
  const allTriggers = stat.triggers.flat().filter(Boolean);
  
  // Count occurrences
  const activityCounts = {};
  const triggerCounts = {};
  
  allActivities.forEach(activity => {
    activityCounts[activity] = (activityCounts[activity] || 0) + 1;
  });
  
  allTriggers.forEach(trigger => {
    triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
  });
  
  // Get top activities and triggers
  const topActivities = Object.entries(activityCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([activity, count]) => ({ activity, count }));
  
  const topTriggers = Object.entries(triggerCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([trigger, count]) => ({ trigger, count }));
  
  return {
    totalEntries: stat.totalEntries,
    avgIntensity: Math.round(stat.avgIntensity * 10) / 10,
    avgEnergyLevel: Math.round(stat.avgEnergyLevel * 10) / 10,
    avgStressLevel: Math.round(stat.avgStressLevel * 10) / 10,
    moodDistribution: moodCounts,
    categoryDistribution: categoryCounts,
    topActivities,
    topTriggers,
    period
  };
};

moodSchema.statics.getMoodTrends = async function(userId, days = 30) {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  const trends = await this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          mood: "$mood"
        },
        count: { $sum: 1 },
        avgIntensity: { $avg: "$intensity" }
      }
    },
    {
      $sort: { "_id.date": 1 }
    }
  ]);
  
  return trends;
};

module.exports = mongoose.model('Mood', moodSchema); 