# MoodLift AI Backend API

A robust, scalable backend API for the MoodLift AI emotional companion platform, built with Node.js, Express, and MongoDB.

## 🚀 Features

### **Core Functionality**
- **AI-Powered Chatbot**: OpenAI integration for intelligent emotional support
- **Real-time Communication**: Socket.IO for instant messaging
- **User Authentication**: JWT-based secure authentication
- **Mood Tracking**: Comprehensive emotional state monitoring
- **Crisis Detection**: AI-powered crisis identification and response
- **Data Analytics**: User engagement and mood pattern analysis

### **Technical Features**
- **RESTful API**: Clean, standardized endpoints
- **Real-time Updates**: WebSocket integration for live chat
- **Rate Limiting**: Protection against abuse
- **Security**: Helmet, CORS, input validation
- **Database**: MongoDB with Mongoose ODM
- **Error Handling**: Comprehensive error management
- **Logging**: Request/response logging with Morgan

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.IO
- **AI Integration**: OpenAI API
- **Security**: Helmet, CORS, rate limiting
- **Validation**: Joi, validator.js

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- OpenAI API key
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install
```bash
cd backend
npm install
```

### 2. Environment Setup
```bash
cp env.example .env
```

Edit `.env` with your configuration:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/moodlift-ai

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# JWT
JWT_SECRET=your-super-secret-key
```

### 3. Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### **Authentication Endpoints**

#### `POST /api/auth/register`
Register a new user
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### `POST /api/auth/login`
User login
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### `GET /api/auth/me`
Get current user profile (requires auth)

### **Chat Endpoints**

#### `POST /api/chat/start`
Start a new chat session
```json
{
  "title": "Feeling anxious today",
  "initialMood": "anxious",
  "moodIntensity": 7
}
```

#### `POST /api/chat/:chatId/message`
Send a message and get AI response
```json
{
  "message": "I'm feeling really stressed about work"
}
```

#### `GET /api/chat/:chatId/messages`
Get chat history with pagination
```
GET /api/chat/123/messages?page=1&limit=50
```

#### `GET /api/chat/sessions`
Get user's chat sessions
```
GET /api/chat/sessions?status=active&mood=anxious
```

#### `PUT /api/chat/:chatId/end`
End a chat session

### **Mood Tracking Endpoints**

#### `POST /api/mood/record`
Record a new mood entry
```json
{
  "mood": "happy",
  "intensity": 8,
  "notes": "Had a great day at work",
  "activities": ["work", "exercise"],
  "triggers": ["positive feedback"]
}
```

#### `GET /api/mood/history`
Get mood history with analytics
```
GET /api/mood/history?startDate=2024-01-01&endDate=2024-01-31
```

#### `GET /api/mood/analytics`
Get mood insights and trends
```
GET /api/mood/analytics?period=week
```

### **User Management Endpoints**

#### `GET /api/user/profile`
Get user profile

#### `PUT /api/user/profile`
Update user profile
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "preferences": {
    "theme": "dark",
    "notifications": {
      "email": true,
      "push": false
    }
  }
}
```

#### `GET /api/user/stats`
Get user statistics and insights

## 🔌 Real-time Features

### **Socket.IO Events**

#### **Client to Server**
- `send_message`: Send a chat message
- `mood_update`: Update current mood
- `typing_start`: Indicate user is typing
- `typing_stop`: Stop typing indicator

#### **Server to Client**
- `message_received`: New AI response
- `mood_updated`: Mood update confirmation
- `user_typing`: Other user typing
- `error`: Error notifications

### **Connection Example**
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-jwt-token'
  }
});

socket.on('connect', () => {
  console.log('Connected to chat server');
});

socket.emit('send_message', {
  message: 'Hello AI!',
  chatId: 'chat123'
});

socket.on('message_received', (data) => {
  console.log('AI response:', data);
});
```

## 🗄️ Database Models

### **User Model**
- Authentication fields (username, email, password)
- Profile information (firstName, lastName, avatar)
- Preferences and settings
- Subscription information

### **Chat Model**
- Chat session metadata
- Context information (mood, topics, goals)
- Performance metrics (response time, message count)
- Status tracking (active, paused, ended)

### **Message Model**
- Message content and metadata
- Sender identification (user/AI)
- Timestamps and conversation flow
- Crisis detection flags

### **Mood Model**
- Emotional state tracking
- Intensity and context
- Activity and trigger associations
- Temporal patterns

## 🔒 Security Features

### **Authentication & Authorization**
- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Token expiration and refresh

### **Input Validation**
- Request body validation
- SQL injection prevention
- XSS protection
- Rate limiting

### **Data Protection**
- Encrypted sensitive data
- Secure session management
- CORS configuration
- Helmet security headers

## 📊 Monitoring & Analytics

### **Performance Metrics**
- Response time tracking
- Token usage monitoring
- Database query performance
- Error rate tracking

### **User Analytics**
- Mood pattern analysis
- Chat engagement metrics
- Feature usage statistics
- User behavior insights

### **Health Checks**
- API endpoint monitoring
- Database connectivity
- External service status
- System resource usage

## 🚀 Deployment

### **Environment Variables**
```bash
# Production
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/moodlift-ai
JWT_SECRET=your-production-secret
OPENAI_API_KEY=your-openai-key
```

### **Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### **PM2 Process Management**
```bash
npm install -g pm2
pm2 start server.js --name "moodlift-api"
pm2 save
pm2 startup
```

## 🧪 Testing

### **Run Tests**
```bash
npm test
```

### **Test Coverage**
```bash
npm run test:coverage
```

### **API Testing**
```bash
# Using Postman or similar
# Import the provided Postman collection
```

## 🔧 Development

### **Code Structure**
```
backend/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Helper functions
├── server.js        # Main server file
└── package.json     # Dependencies
```

### **Adding New Features**
1. Create model in `models/`
2. Add routes in `routes/`
3. Implement business logic in `services/`
4. Add validation middleware
5. Update API documentation

### **Code Style**
- ESLint configuration
- Prettier formatting
- Consistent naming conventions
- Comprehensive error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Email: backend@moodlift.ai
- Documentation: `/docs` endpoint

---

**Built with ❤️ for better mental health** 