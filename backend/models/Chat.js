const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    default: 'New Conversation'
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'ended'],
    default: 'active'
  },
  context: {
    currentMood: {
      type: String,
      enum: ['happy', 'sad', 'angry', 'anxious', 'calm', 'excited', 'tired', 'neutral'],
      default: 'neutral'
    },
    moodIntensity: {
      type: Number,
      min: 1,
      max: 10,
      default: 5
    },
    topics: [{
      type: String,
      trim: true
    }],
    triggers: [{
      type: String,
      trim: true
    }],
    goals: [{
      type: String,
      trim: true
    }]
  },
  metadata: {
    startTime: {
      type: Date,
      default: Date.now
    },
    endTime: Date,
    duration: Number, // in minutes
    messageCount: {
      type: Number,
      default: 0
    },
    aiResponseTime: {
      average: Number,
      total: Number,
      count: Number
    }
  },
  settings: {
    aiModel: {
      type: String,
      default: 'gpt-4'
    },
    temperature: {
      type: Number,
      min: 0,
      max: 2,
      default: 0.7
    },
    maxTokens: {
      type: Number,
      default: 150
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for chat duration
chatSchema.virtual('durationMinutes').get(function() {
  if (this.metadata.endTime && this.metadata.startTime) {
    return Math.round((this.metadata.endTime - this.metadata.startTime) / (1000 * 60));
  }
  return 0;
});

// Virtual for average response time
chatSchema.virtual('avgResponseTime').get(function() {
  if (this.metadata.aiResponseTime.count > 0) {
    return this.metadata.aiResponseTime.total / this.metadata.aiResponseTime.count;
  }
  return 0;
});

// Indexes for better query performance
chatSchema.index({ userId: 1, createdAt: -1 });
chatSchema.index({ userId: 1, status: 1 });
chatSchema.index({ 'context.currentMood': 1 });
chatSchema.index({ tags: 1 });

// Pre-save middleware to update metadata
chatSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'ended' && !this.metadata.endTime) {
    this.metadata.endTime = new Date();
    this.metadata.duration = Math.round((this.metadata.endTime - this.metadata.startTime) / (1000 * 60));
  }
  next();
});

// Instance method to pause chat
chatSchema.methods.pauseChat = function() {
  this.status = 'paused';
  return this.save();
};

// Instance method to resume chat
chatSchema.methods.resumeChat = function() {
  this.status = 'active';
  return this.save();
};

// Instance method to end chat
chatSchema.methods.endChat = function() {
  this.status = 'ended';
  this.metadata.endTime = new Date();
  this.metadata.duration = Math.round((this.metadata.endTime - this.metadata.startTime) / (1000 * 60));
  return this.save();
};

// Instance method to update message count
chatSchema.methods.incrementMessageCount = function() {
  this.metadata.messageCount += 1;
  return this.save();
};

// Instance method to add AI response time
chatSchema.methods.addResponseTime = function(responseTime) {
  if (!this.metadata.aiResponseTime.total) {
    this.metadata.aiResponseTime.total = 0;
    this.metadata.aiResponseTime.count = 0;
  }
  this.metadata.aiResponseTime.total += responseTime;
  this.metadata.aiResponseTime.count += 1;
  this.metadata.aiResponseTime.average = this.metadata.aiResponseTime.total / this.metadata.aiResponseTime.count;
  return this.save();
};

// Static method to find active chats for a user
chatSchema.statics.findActiveChats = function(userId) {
  return this.find({ userId, status: 'active' }).sort({ updatedAt: -1 });
};

// Static method to find chats by mood
chatSchema.statics.findByMood = function(userId, mood) {
  return this.find({ userId, 'context.currentMood': mood }).sort({ createdAt: -1 });
};

// Static method to find chats by date range
chatSchema.statics.findByDateRange = function(userId, startDate, endDate) {
  return this.find({
    userId,
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ createdAt: -1 });
};

// Static method to get chat statistics
chatSchema.statics.getChatStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalChats: { $sum: 1 },
        totalDuration: { $sum: '$metadata.duration' },
        totalMessages: { $sum: '$metadata.messageCount' },
        avgResponseTime: { $avg: '$metadata.aiResponseTime.average' },
        moodDistribution: {
          $push: '$context.currentMood'
        }
      }
    }
  ]);

  if (stats.length === 0) {
    return {
      totalChats: 0,
      totalDuration: 0,
      totalMessages: 0,
      avgResponseTime: 0,
      moodDistribution: {}
    };
  }

  const stat = stats[0];
  const moodCounts = stat.moodDistribution.reduce((acc, mood) => {
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {});

  return {
    totalChats: stat.totalChats,
    totalDuration: stat.totalDuration || 0,
    totalMessages: stat.totalMessages || 0,
    avgResponseTime: stat.avgResponseTime || 0,
    moodDistribution: moodCounts
  };
};

module.exports = mongoose.model('Chat', chatSchema); 