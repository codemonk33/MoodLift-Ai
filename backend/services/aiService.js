const OpenAI = require('openai');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    this.model = process.env.OPENAI_MODEL || 'gpt-4';
    this.maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS) || 150;
  }

  // Generate AI response for emotional support
  async generateResponse(userMessage, context = {}) {
    try {
      const startTime = Date.now();
      
      const systemPrompt = this.buildSystemPrompt(context);
      const userPrompt = this.buildUserPrompt(userMessage, context);
      
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: this.maxTokens,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      const responseTime = Date.now() - startTime;
      const aiResponse = completion.choices[0].message.content;

      return {
        response: aiResponse,
        responseTime,
        tokensUsed: completion.usage.total_tokens,
        model: this.model
      };

    } catch (error) {
      console.error('AI Service Error:', error);
      
      // Fallback responses if AI service fails
      return {
        response: this.getFallbackResponse(context.currentMood),
        responseTime: 0,
        tokensUsed: 0,
        model: 'fallback',
        error: error.message
      };
    }
  }

  // Build system prompt based on context
  buildSystemPrompt(context) {
    const basePrompt = `You are MoodLift AI, a compassionate and empathetic AI emotional companion. Your role is to:

1. Provide emotional support and understanding
2. Help users process their feelings
3. Offer gentle guidance and perspective
4. Maintain a warm, caring, and non-judgmental tone
5. Encourage self-reflection and emotional awareness
6. Provide practical coping strategies when appropriate

IMPORTANT GUIDELINES:
- Always respond with empathy and compassion
- Never give medical advice or replace professional therapy
- Keep responses concise but meaningful (max ${this.maxTokens} tokens)
- Use encouraging and uplifting language
- Include relevant emojis to make responses warm and friendly
- If someone is in crisis, encourage them to seek professional help

Current Context:
- User's mood: ${context.currentMood || 'unknown'}
- Mood intensity: ${context.intensity || 'moderate'}
- Recent topics: ${context.topics?.join(', ') || 'none'}
- User's goals: ${context.goals?.join(', ') || 'general emotional support'}`;

    return basePrompt;
  }

  // Build user prompt
  buildUserPrompt(userMessage, context) {
    return `User message: "${userMessage}"

Please provide a supportive, empathetic response that:
- Acknowledges their feelings
- Offers understanding and validation
- Provides gentle encouragement
- Suggests helpful perspectives or coping strategies if appropriate

Remember to keep the tone warm, caring, and uplifting.`;
  }

  // Get fallback responses when AI service is unavailable
  getFallbackResponse(mood) {
    const fallbackResponses = {
      happy: "I'm so glad you're feeling happy! 😊 Your positive energy is wonderful. What's bringing you joy today?",
      sad: "I'm here for you during this difficult time. 💙 It's okay to feel sad, and your feelings are completely valid. Would you like to talk more about what's on your mind?",
      angry: "I can sense that you're feeling frustrated. 😤 It's natural to feel angry sometimes. Taking a few deep breaths might help. What triggered these feelings?",
      anxious: "I understand that anxiety can be overwhelming. 🌸 Remember, you're safe right now. Let's take this one moment at a time. What's making you feel anxious?",
      calm: "It's beautiful that you're feeling peaceful. ✨ Inner calm is such a precious state. How are you maintaining this sense of tranquility?",
      excited: "Your excitement is contagious! 🎉 It's wonderful to feel energized and enthusiastic. What are you looking forward to?",
      tired: "It sounds like you could use some rest. 😴 Being tired is your body's way of asking for care. What would help you feel more refreshed?",
      neutral: "I'm here to listen and support you. 🤗 Sometimes a neutral mood is just what we need. How are you feeling about things right now?"
    };

    return fallbackResponses[mood] || fallbackResponses.neutral;
  }

  // Analyze user's emotional state from message
  async analyzeEmotion(message) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `Analyze the emotional content of the user's message and return a JSON response with:
            {
              "primaryEmotion": "one of: happy, sad, angry, anxious, calm, excited, tired, neutral",
              "intensity": "1-10 scale",
              "sentiment": "positive, negative, or neutral",
              "confidence": "0.0-1.0",
              "keyTopics": ["array of main topics discussed"],
              "suggestedResponse": "brief suggestion for response approach"
            }`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 200,
        temperature: 0.3
      });

      const analysis = JSON.parse(completion.choices[0].message.content);
      return analysis;

    } catch (error) {
      console.error('Emotion Analysis Error:', error);
      return {
        primaryEmotion: 'neutral',
        intensity: 5,
        sentiment: 'neutral',
        confidence: 0.5,
        keyTopics: [],
        suggestedResponse: 'general support'
      };
    }
  }

  // Generate mood improvement suggestions
  async generateMoodSuggestions(currentMood, intensity) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `Generate 3-5 practical, actionable suggestions to help improve the user's mood. 
            Current mood: ${currentMood}, Intensity: ${intensity}/10.
            
            Return as JSON:
            {
              "suggestions": [
                {
                  "title": "brief title",
                  "description": "detailed explanation",
                  "category": "physical, mental, social, or creative",
                  "timeRequired": "estimated time in minutes"
                }
              ]
            }`
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      });

      const suggestions = JSON.parse(completion.choices[0].message.content);
      return suggestions;

    } catch (error) {
      console.error('Mood Suggestions Error:', error);
      return {
        suggestions: [
          {
            title: "Take a Walk",
            description: "A short walk outside can help clear your mind and boost your mood",
            category: "physical",
            timeRequired: 15
          },
          {
            title: "Deep Breathing",
            description: "Practice deep breathing exercises to help calm your nervous system",
            category: "mental",
            timeRequired: 5
          }
        ]
      };
    }
  }

  // Check if message indicates crisis
  async detectCrisis(message) {
    const crisisKeywords = [
      'suicide', 'kill myself', 'want to die', 'end it all',
      'self-harm', 'cut myself', 'hurt myself',
      'no reason to live', 'better off dead', 'give up'
    ];

    const lowerMessage = message.toLowerCase();
    const hasCrisisKeywords = crisisKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );

    if (hasCrisisKeywords) {
      return {
        isCrisis: true,
        severity: 'high',
        response: `I'm very concerned about what you're sharing. 💙 Your life has value, and you're not alone. Please reach out to a crisis helpline immediately:

🌍 National Suicide Prevention Lifeline (US): 988
🌍 Crisis Text Line: Text HOME to 741741
🌍 Emergency Services: 911

You deserve support and care. Please talk to someone who can help you right now.`
      };
    }

    return { isCrisis: false };
  }
}

module.exports = new AIService(); 