const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
    index: true
  },
  sender: {
    type: String,
    enum: ['user', 'ai'],
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  metadata: {
    // AI-specific metadata
    responseTime: Number, // in milliseconds
    tokensUsed: Number,
    model: String,
    
    // Crisis detection
    isCrisis: {
      type: Boolean,
      default: false
    },
    crisisSeverity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low'
    },
    
    // Message analysis
    sentiment: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
      default: 'neutral'
    },
    emotion: {
      type: String,
      enum: ['happy', 'sad', 'angry', 'anxious', 'calm', 'excited', 'tired', 'neutral']
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5
    },
    
    // User interaction
    readAt: Date,
    reactions: [{
      type: String,
      enum: ['like', 'love', 'helpful', 'confused']
    }],
    
    // Technical metadata
    clientInfo: {
      userAgent: String,
      ipAddress: String,
      deviceType: String
    }
  },
  
  // For AI messages, store the original user message that triggered this response
  parentMessageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  
  // Message threading support
  threadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  
  // Message status
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed'],
    default: 'sent'
  },
  
  // For AI messages, store context used to generate response
  aiContext: {
    userMood: String,
    conversationHistory: [{
      role: String,
      content: String,
      timestamp: Date
    }],
    topics: [String],
    triggers: [String]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for message age
messageSchema.virtual('age').get(function() {
  return Date.now() - this.timestamp;
});

// Virtual for message length
messageSchema.virtual('wordCount').get(function() {
  return this.content.split(/\s+/).length;
});

// Virtual for isRecent (within last 5 minutes)
messageSchema.virtual('isRecent').get(function() {
  return this.age < 5 * 60 * 1000;
});

// Indexes for better query performance
messageSchema.index({ chatId: 1, timestamp: 1 });
messageSchema.index({ sender: 1, timestamp: -1 });
messageSchema.index({ 'metadata.isCrisis': 1 });
messageSchema.index({ 'metadata.sentiment': 1 });
messageSchema.index({ 'metadata.emotion': 1 });

// Pre-save middleware
messageSchema.pre('save', function(next) {
  // Auto-detect if message might be crisis-related
  if (this.sender === 'user' && !this.metadata.isCrisis) {
    const crisisKeywords = [
      'suicide', 'kill myself', 'want to die', 'end it all',
      'self-harm', 'cut myself', 'hurt myself',
      'no reason to live', 'better off dead', 'give up'
    ];
    
    const lowerContent = this.content.toLowerCase();
    const hasCrisisKeywords = crisisKeywords.some(keyword => 
      lowerContent.includes(keyword)
    );
    
    if (hasCrisisKeywords) {
      this.metadata.isCrisis = true;
      this.metadata.crisisSeverity = 'high';
    }
  }
  
  next();
});

// Instance methods
messageSchema.methods.markAsRead = function() {
  this.metadata.readAt = new Date();
  this.status = 'read';
  return this.save();
};

messageSchema.methods.addReaction = function(reaction) {
  if (!this.metadata.reactions.includes(reaction)) {
    this.metadata.reactions.push(reaction);
  }
  return this.save();
};

messageSchema.methods.removeReaction = function(reaction) {
  this.metadata.reactions = this.metadata.reactions.filter(r => r !== reaction);
  return this.save();
};

// Static methods
messageSchema.statics.findByChat = function(chatId, options = {}) {
  const { page = 1, limit = 50, sort = { timestamp: 1 } } = options;
  
  return this.find({ chatId })
    .sort(sort)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));
};

messageSchema.statics.findCrisisMessages = function(chatId) {
  return this.find({
    chatId,
    'metadata.isCrisis': true
  }).sort({ timestamp: -1 });
};

messageSchema.statics.getMessageStats = async function(chatId) {
  const stats = await this.aggregate([
    { $match: { chatId: new mongoose.Types.ObjectId(chatId) } },
    {
      $group: {
        _id: null,
        totalMessages: { $sum: 1 },
        userMessages: {
          $sum: { $cond: [{ $eq: ['$sender', 'user'] }, 1, 0] }
        },
        aiMessages: {
          $sum: { $cond: [{ $eq: ['$sender', 'ai'] }, 1, 0] }
        },
        crisisMessages: {
          $sum: { $cond: ['$metadata.isCrisis', 1, 0] }
        },
        avgResponseTime: { $avg: '$metadata.responseTime' },
        totalTokens: { $sum: '$metadata.tokensUsed' }
      }
    }
  ]);

  if (stats.length === 0) {
    return {
      totalMessages: 0,
      userMessages: 0,
      aiMessages: 0,
      crisisMessages: 0,
      avgResponseTime: 0,
      totalTokens: 0
    };
  }

  return stats[0];
};

messageSchema.statics.getSentimentAnalysis = async function(chatId) {
  const analysis = await this.aggregate([
    { $match: { chatId: new mongoose.Types.ObjectId(chatId) } },
    {
      $group: {
        _id: '$metadata.sentiment',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  return analysis;
};

messageSchema.statics.getEmotionTrends = async function(chatId, days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const trends = await this.aggregate([
    {
      $match: {
        chatId: new mongoose.Types.ObjectId(chatId),
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          emotion: '$metadata.emotion'
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.date',
        emotions: {
          $push: {
            emotion: '$_id.emotion',
            count: '$count'
          }
        }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return trends;
};

module.exports = mongoose.model('Message', messageSchema); 