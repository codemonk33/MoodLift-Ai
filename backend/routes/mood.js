const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Mood = require('../models/Mood');

// @desc    Record a new mood entry
// @route   POST /api/mood/record
// @access  Private
router.post('/record', protect, async (req, res) => {
  try {
    const { mood, intensity, notes, activities, triggers, location, weather, sleepHours, exerciseMinutes, socialInteraction, energyLevel, stressLevel } = req.body;

    // Validate required fields
    if (!mood || !intensity) {
      return res.status(400).json({
        success: false,
        message: 'Mood and intensity are required'
      });
    }

    // Validate intensity range
    if (intensity < 1 || intensity > 10) {
      return res.status(400).json({
        success: false,
        message: 'Intensity must be between 1 and 10'
      });
    }

    // Create mood entry
    const moodEntry = await Mood.create({
      userId: req.user.id,
      mood,
      intensity,
      notes,
      activities,
      triggers,
      location,
      weather,
      sleepHours,
      exerciseMinutes,
      socialInteraction,
      energyLevel,
      stressLevel
    });

    res.status(201).json({
      success: true,
      message: 'Mood recorded successfully',
      data: moodEntry
    });

  } catch (error) {
    console.error('Record Mood Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record mood'
    });
  }
});

// @desc    Get user's mood history
// @route   GET /api/mood/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, mood, startDate, endDate, sort = 'createdAt' } = req.query;

    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      mood,
      startDate,
      endDate,
      sort: { [sort]: -1 }
    };

    const moods = await Mood.findByUser(req.user.id, options);
    const totalEntries = await Mood.countDocuments({ userId: req.user.id });

    res.json({
      success: true,
      data: {
        moods,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalEntries / parseInt(limit)),
          totalEntries,
          hasNext: parseInt(page) * parseInt(limit) < totalEntries,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get Mood History Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve mood history'
    });
  }
});

// @desc    Get mood analytics and insights
// @route   GET /api/mood/analytics
// @access  Private
router.get('/analytics', protect, async (req, res) => {
  try {
    const { period = 'week' } = req.query;

    const stats = await Mood.getMoodStats(req.user.id, period);
    const trends = await Mood.getMoodTrends(req.user.id, 30);

    res.json({
      success: true,
      data: {
        stats,
        trends
      }
    });

  } catch (error) {
    console.error('Get Mood Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve mood analytics'
    });
  }
});

// @desc    Get a specific mood entry
// @route   GET /api/mood/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const moodEntry = await Mood.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!moodEntry) {
      return res.status(404).json({
        success: false,
        message: 'Mood entry not found'
      });
    }

    res.json({
      success: true,
      data: moodEntry
    });

  } catch (error) {
    console.error('Get Mood Entry Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve mood entry'
    });
  }
});

// @desc    Update a mood entry
// @route   PUT /api/mood/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const moodEntry = await Mood.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!moodEntry) {
      return res.status(404).json({
        success: false,
        message: 'Mood entry not found'
      });
    }

    // Update fields
    const updatedMood = await moodEntry.updateMood(req.body);

    res.json({
      success: true,
      message: 'Mood entry updated successfully',
      data: updatedMood
    });

  } catch (error) {
    console.error('Update Mood Entry Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update mood entry'
    });
  }
});

// @desc    Delete a mood entry
// @route   DELETE /api/mood/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const moodEntry = await Mood.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!moodEntry) {
      return res.status(404).json({
        success: false,
        message: 'Mood entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Mood entry deleted successfully'
    });

  } catch (error) {
    console.error('Delete Mood Entry Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete mood entry'
    });
  }
});

// @desc    Get mood insights and recommendations
// @route   GET /api/mood/insights
// @access  Private
router.get('/insights', protect, async (req, res) => {
  try {
    const stats = await Mood.getMoodStats(req.user.id, 'month');
    
    // Generate insights based on mood data
    const insights = [];
    
    if (stats.totalEntries > 0) {
      // Mood pattern insights
      const dominantMood = Object.entries(stats.moodDistribution)
        .sort(([,a], [,b]) => b - a)[0];
      
      if (dominantMood) {
        insights.push({
          type: 'pattern',
          title: 'Most Common Mood',
          description: `You've been feeling ${dominantMood[0]} most often this month`,
          mood: dominantMood[0],
          count: dominantMood[1]
        });
      }

      // Intensity insights
      if (stats.avgIntensity > 7) {
        insights.push({
          type: 'intensity',
          title: 'High Emotional Intensity',
          description: 'Your emotions have been quite intense lately. Consider practicing mindfulness or relaxation techniques.',
          recommendation: 'Try deep breathing exercises or meditation'
        });
      } else if (stats.avgIntensity < 4) {
        insights.push({
          type: 'intensity',
          title: 'Low Emotional Intensity',
          description: 'Your emotions have been relatively calm. This could be a good time for reflection and planning.',
          recommendation: 'Consider journaling or setting new goals'
        });
      }

      // Activity insights
      if (stats.topActivities.length > 0) {
        const topActivity = stats.topActivities[0];
        insights.push({
          type: 'activity',
          title: 'Most Frequent Activity',
          description: `You've been doing ${topActivity.activity} quite often`,
          activity: topActivity.activity,
          count: topActivity.count
        });
      }

      // Trigger insights
      if (stats.topTriggers.length > 0) {
        const topTrigger = stats.topTriggers[0];
        insights.push({
          type: 'trigger',
          title: 'Common Trigger',
          description: `${topTrigger.trigger} seems to affect your mood frequently`,
          trigger: topTrigger.trigger,
          count: topTrigger.count
        });
      }
    }

    res.json({
      success: true,
      data: {
        insights,
        stats
      }
    });

  } catch (error) {
    console.error('Get Mood Insights Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve mood insights'
    });
  }
});

module.exports = router; 