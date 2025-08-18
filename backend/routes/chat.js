const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const aiService = require('../services/aiService');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

// @desc    Start a new chat session
// @route   POST /api/chat/start
// @access  Private
router.post('/start', protect, async (req, res) => {
  try {
    const { title, initialMood, moodIntensity } = req.body;

    // Create new chat session
    const chat = await Chat.create({
      userId: req.user.id,
      title: title || 'New Conversation',
      context: {
        currentMood: initialMood || 'neutral',
        moodIntensity: moodIntensity || 5
      }
    });

    // Create initial AI greeting message
    const greeting = await aiService.generateResponse(
      'Start conversation',
      { currentMood: initialMood, intensity: moodIntensity }
    );

    const initialMessage = await Message.create({
      chatId: chat._id,
      sender: 'ai',
      content: greeting.response,
      timestamp: new Date()
    });

    res.status(201).json({
      success: true,
      data: {
        chat: chat,
        initialMessage: initialMessage
      }
    });

  } catch (error) {
    console.error('Start Chat Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start chat session'
    });
  }
});

// @desc    Send a message and get AI response
// @route   POST /api/chat/:chatId/message
// @access  Private
router.post('/:chatId/message', protect, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    // Verify chat belongs to user
    const chat = await Chat.findOne({ _id: chatId, userId: req.user.id });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    // Check for crisis indicators
    const crisisCheck = await aiService.detectCrisis(message);
    if (crisisCheck.isCrisis) {
      // Save crisis message
      await Message.create({
        chatId,
        sender: 'user',
        content: message,
        timestamp: new Date(),
        metadata: { isCrisis: true, severity: crisisCheck.severity }
      });

      // Save crisis response
      const crisisMessage = await Message.create({
        chatId,
        sender: 'ai',
        content: crisisCheck.response,
        timestamp: new Date(),
        metadata: { isCrisis: true, severity: crisisCheck.severity }
      });

      return res.json({
        success: true,
        data: {
          userMessage: { content: message, timestamp: new Date() },
          aiResponse: crisisMessage,
          isCrisis: true
        }
      });
    }

    // Save user message
    const userMessage = await Message.create({
      chatId,
      sender: 'user',
      content: message,
      timestamp: new Date()
    });

    // Update chat metadata
    await chat.incrementMessageCount();

    // Get chat context for AI
    const recentMessages = await Message.find({ chatId })
      .sort({ timestamp: -1 })
      .limit(10);

    const context = {
      currentMood: chat.context.currentMood,
      intensity: chat.context.moodIntensity,
      topics: chat.context.topics,
      recentConversation: recentMessages.map(m => ({
        sender: m.sender,
        content: m.content
      }))
    };

    // Generate AI response
    const aiResponse = await aiService.generateResponse(message, context);

    // Save AI response
    const aiMessage = await Message.create({
      chatId,
      sender: 'ai',
      content: aiResponse.response,
      timestamp: new Date(),
      metadata: {
        responseTime: aiResponse.responseTime,
        tokensUsed: aiResponse.tokensUsed,
        model: aiResponse.model
      }
    });

    // Update chat response time
    await chat.addResponseTime(aiResponse.responseTime);

    // Analyze emotion from user message
    const emotionAnalysis = await aiService.analyzeEmotion(message);
    
    // Update chat context if emotion changed significantly
    if (emotionAnalysis.confidence > 0.7) {
      chat.context.currentMood = emotionAnalysis.primaryEmotion;
      chat.context.moodIntensity = emotionAnalysis.intensity;
      
      if (emotionAnalysis.keyTopics.length > 0) {
        chat.context.topics = [
          ...new Set([...chat.context.topics, ...emotionAnalysis.keyTopics])
        ].slice(-5); // Keep last 5 topics
      }
      
      await chat.save();
    }

    res.json({
      success: true,
      data: {
        userMessage,
        aiResponse: aiMessage,
        emotionAnalysis,
        chatContext: chat.context
      }
    });

  } catch (error) {
    console.error('Send Message Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
});

// @desc    Get chat history
// @route   GET /api/chat/:chatId/messages
// @access  Private
router.get('/:chatId/messages', protect, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Verify chat belongs to user
    const chat = await Chat.findOne({ _id: chatId, userId: req.user.id });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    // Get messages with pagination
    const messages = await Message.find({ chatId })
      .sort({ timestamp: 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalMessages = await Message.countDocuments({ chatId });

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalMessages / parseInt(limit)),
          totalMessages,
          hasNext: parseInt(page) * parseInt(limit) < totalMessages,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get Messages Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve messages'
    });
  }
});

// @desc    Get user's chat sessions
// @route   GET /api/chat/sessions
// @access  Private
router.get('/sessions', protect, async (req, res) => {
  try {
    const { status, mood, page = 1, limit = 20 } = req.query;

    let query = { userId: req.user.id };

    if (status) query.status = status;
    if (mood) query['context.currentMood'] = mood;

    const chats = await Chat.find(query)
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('userId', 'firstName lastName avatar');

    const totalChats = await Chat.countDocuments(query);

    res.json({
      success: true,
      data: {
        chats,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalChats / parseInt(limit)),
          totalChats,
          hasNext: parseInt(page) * parseInt(limit) < totalChats,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get Chat Sessions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chat sessions'
    });
  }
});

// @desc    Update chat session
// @route   PUT /api/chat/:chatId
// @access  Private
router.put('/:chatId', protect, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { title, status, context } = req.body;

    const chat = await Chat.findOne({ _id: chatId, userId: req.user.id });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    if (title) chat.title = title;
    if (status) chat.status = status;
    if (context) {
      chat.context = { ...chat.context, ...context };
    }

    await chat.save();

    res.json({
      success: true,
      data: chat
    });

  } catch (error) {
    console.error('Update Chat Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update chat session'
    });
  }
});

// @desc    End chat session
// @route   PUT /api/chat/:chatId/end
// @access  Private
router.put('/:chatId/end', protect, async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOne({ _id: chatId, userId: req.user.id });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    await chat.endChat();

    res.json({
      success: true,
      message: 'Chat session ended successfully',
      data: chat
    });

  } catch (error) {
    console.error('End Chat Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to end chat session'
    });
  }
});

// @desc    Get chat statistics
// @route   GET /api/chat/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const stats = await Chat.getChatStats(req.user.id);

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get Chat Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chat statistics'
    });
  }
});

module.exports = router; 