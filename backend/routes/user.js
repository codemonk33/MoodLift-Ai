const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Chat = require('../models/Chat');
const Mood = require('../models/Mood');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        preferences: user.preferences,
        subscription: user.subscription,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Get User Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { firstName, lastName, avatar, preferences } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (avatar) user.avatar = avatar;
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        avatar: updatedUser.avatar,
        preferences: updatedUser.preferences,
        subscription: updatedUser.subscription
      }
    });

  } catch (error) {
    console.error('Update User Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user profile'
    });
  }
});

// @desc    Get user statistics and insights
// @route   GET /api/user/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const { period = 'month' } = req.query;

    // Get chat statistics
    const chatStats = await Chat.getChatStats(req.user.id);
    
    // Get mood statistics
    const moodStats = await Mood.getMoodStats(req.user.id, period);

    // Calculate user engagement score
    const engagementScore = calculateEngagementScore(chatStats, moodStats);

    // Get recent activity
    const recentChats = await Chat.find({ userId: req.user.id })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('title status context.moodIntensity updatedAt');

    const recentMoods = await Mood.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('mood intensity notes createdAt');

    res.json({
      success: true,
      data: {
        chatStats,
        moodStats,
        engagementScore,
        recentActivity: {
          chats: recentChats,
          moods: recentMoods
        }
      }
    });

  } catch (error) {
    console.error('Get User Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user statistics'
    });
  }
});

// @desc    Get user preferences
// @route   GET /api/user/preferences
// @access  Private
router.get('/preferences', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('preferences');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.preferences
    });

  } catch (error) {
    console.error('Get User Preferences Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user preferences'
    });
  }
});

// @desc    Update user preferences
// @route   PUT /api/user/preferences
// @access  Private
router.put('/preferences', protect, async (req, res) => {
  try {
    const { theme, notifications, privacy } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update preferences
    if (theme) user.preferences.theme = theme;
    if (notifications) {
      user.preferences.notifications = { ...user.preferences.notifications, ...notifications };
    }
    if (privacy) {
      user.preferences.privacy = { ...user.preferences.privacy, ...privacy };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: user.preferences
    });

  } catch (error) {
    console.error('Update User Preferences Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user preferences'
    });
  }
});

// @desc    Get user subscription details
// @route   GET /api/user/subscription
// @access  Private
router.get('/subscription', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('subscription');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.subscription
    });

  } catch (error) {
    console.error('Get User Subscription Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve subscription details'
    });
  }
});

// @desc    Update user subscription
// @route   PUT /api/user/subscription
// @access  Private
router.put('/subscription', protect, async (req, res) => {
  try {
    const { plan, endDate } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update subscription
    if (plan) user.subscription.plan = plan;
    if (endDate) user.subscription.endDate = new Date(endDate);

    await user.save();

    res.json({
      success: true,
      message: 'Subscription updated successfully',
      data: user.subscription
    });

  } catch (error) {
    console.error('Update User Subscription Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update subscription'
    });
  }
});

// @desc    Delete user account
// @route   DELETE /api/user/account
// @access  Private
router.delete('/account', protect, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to delete account'
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Delete user data (cascade delete)
    await Chat.deleteMany({ userId: req.user.id });
    await Mood.deleteMany({ userId: req.user.id });
    await User.findByIdAndDelete(req.user.id);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete User Account Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user account'
    });
  }
});

// Helper function to calculate engagement score
function calculateEngagementScore(chatStats, moodStats) {
  let score = 0;
  
  // Chat engagement (40% of total score)
  if (chatStats.totalChats > 0) {
    const chatScore = Math.min(chatStats.totalChats * 2, 40);
    score += chatScore;
  }
  
  // Mood tracking engagement (30% of total score)
  if (moodStats.totalEntries > 0) {
    const moodScore = Math.min(moodStats.totalEntries * 1.5, 30);
    score += moodScore;
  }
  
  // Activity consistency (30% of total score)
  if (chatStats.totalChats > 0 && moodStats.totalEntries > 0) {
    const consistencyScore = Math.min(
      (chatStats.totalChats + moodStats.totalEntries) * 0.75, 
      30
    );
    score += consistencyScore;
  }
  
  return Math.round(score);
}

module.exports = router; 