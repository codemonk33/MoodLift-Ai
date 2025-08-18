# MoodLift AI - Your AI Emotional Companion

A complete, full-stack AI-powered emotional companion platform that uplifts users' spirits, reduces stress, and enhances emotional well-being.

## ✨ **What is MoodLift AI?**

MoodLift AI is an intelligent digital companion that provides:
- 🤖 **AI-Powered Emotional Support** - Real conversations with OpenAI integration
- 😊 **Mood Tracking & Analytics** - Monitor emotional patterns over time
- 💬 **Real-time Chat Interface** - Instant, responsive communication
- 🚨 **Crisis Detection** - AI-powered safety monitoring and intervention
- 📊 **Personalized Insights** - Data-driven emotional wellness recommendations
- 🔒 **Secure & Private** - Enterprise-grade security and data protection

## 🏗️ **Architecture Overview**

```
MoodLift AI
├── 🎨 Frontend (React + Tailwind CSS)
│   ├── Responsive UI components
│   ├── Real-time chat interface
│   ├── Mood tracking dashboard
│   └── Beautiful animations
│
├── 🚀 Backend (Node.js + Express)
│   ├── RESTful API endpoints
│   ├── Socket.IO real-time communication
│   ├── OpenAI integration
│   └── MongoDB database
│
└── 🤖 AI Services
    ├── Emotional support responses
    ├── Crisis detection
    ├── Mood analysis
    └── Personalized recommendations
```

## 🚀 **Quick Start**

### **Option 1: Full-Stack Development (Recommended)**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MoodLift-AI
   ```

2. **Start the Backend**
   ```bash
   cd backend
   npm install
   node start.js
   ```
   The backend will be available at `http://localhost:5000`

3. **Start the Frontend**
   ```bash
   # In a new terminal
   cd frontend  # or root directory
   npm install
   npm start
   ```
   The frontend will be available at `http://localhost:3000`

### **Option 2: Frontend Only (Demo Mode)**

If you want to test the frontend without the backend:

```bash
npm install
npm start
```

The frontend will run with simulated AI responses and local storage.

## 🛠️ **Technology Stack**

### **Frontend**
- **React 18** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **Responsive Design** - Mobile-first approach

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Socket.IO** - Real-time communication
- **OpenAI API** - AI integration
- **JWT** - Authentication
- **bcrypt** - Password hashing

### **AI & ML**
- **OpenAI GPT-4** - Natural language processing
- **Emotion Analysis** - Sentiment detection
- **Crisis Detection** - Safety monitoring
- **Personalized Responses** - Context-aware AI

## 📱 **Features**

### **🎯 Core Functionality**
- **Interactive Chatbot** - AI-powered emotional conversations
- **Mood Tracker** - Daily emotional state monitoring
- **Crisis Intervention** - AI safety monitoring
- **Progress Analytics** - Emotional wellness insights
- **User Profiles** - Personalized experience

### **🔒 Security Features**
- **JWT Authentication** - Secure user sessions
- **Password Encryption** - bcrypt hashing
- **Rate Limiting** - API abuse prevention
- **Input Validation** - XSS and injection protection
- **CORS Configuration** - Cross-origin security

### **📊 Analytics & Insights**
- **Mood Patterns** - Emotional trend analysis
- **Chat Statistics** - Conversation metrics
- **Response Times** - Performance monitoring
- **User Engagement** - Feature usage tracking

## 🗄️ **Database Models**

### **User Model**
- Authentication (username, email, password)
- Profile information (firstName, lastName, avatar)
- Preferences and settings
- Subscription management

### **Chat Model**
- Session metadata and context
- Mood and topic tracking
- Performance metrics
- Status management

### **Message Model**
- Conversation content
- AI response metadata
- Crisis detection flags
- Sentiment analysis

### **Mood Model**
- Emotional state tracking
- Intensity and context
- Activity associations
- Temporal patterns

## 🔌 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get profile
- `PUT /api/auth/me` - Update profile

### **Chat**
- `POST /api/chat/start` - Start conversation
- `POST /api/chat/:id/message` - Send message
- `GET /api/chat/:id/messages` - Get history
- `GET /api/chat/sessions` - List sessions

### **Mood Tracking**
- `POST /api/mood/record` - Record mood
- `GET /api/mood/history` - Get history
- `GET /api/mood/analytics` - Get insights

## 🔧 **Configuration**

### **Environment Variables**

Create a `.env` file in the backend directory:

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

### **Required Services**

1. **MongoDB** - Database server
2. **OpenAI API Key** - AI service access
3. **Node.js** - Runtime environment

## 🚀 **Deployment**

### **Development**
```bash
# Backend
cd backend
npm run dev

# Frontend
npm start
```

### **Production**
```bash
# Build frontend
npm run build

# Start backend
cd backend
npm start
```

### **Docker (Optional)**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 **Testing**

### **Frontend Testing**
```bash
npm test
npm run test:coverage
```

### **Backend Testing**
```bash
cd backend
npm test
```

### **API Testing**
- Use Postman or similar tools
- Import the provided API collection
- Test all endpoints with authentication

## 📱 **Responsive Design**

The application is fully responsive and works on:
- 📱 **Mobile** - Optimized for smartphones
- 📱 **Tablet** - Touch-friendly interface
- 💻 **Desktop** - Full-featured experience
- 🖥️ **Large Screens** - Enhanced layouts

## 🎨 **Customization**

### **Themes**
- Light/Dark mode support
- Custom color schemes
- Personalized avatars
- Customizable preferences

### **AI Behavior**
- Adjustable response styles
- Custom crisis detection
- Personalized conversation flows
- Language preferences

## 🔮 **Future Enhancements**

- [ ] **Multi-language Support** - Internationalization
- [ ] **Voice Chat** - Speech-to-text integration
- [ ] **Group Sessions** - Community support
- [ ] **Mobile App** - Native iOS/Android apps
- [ ] **Advanced Analytics** - Machine learning insights
- [ ] **Integration APIs** - Third-party connections
- [ ] **Offline Mode** - Local AI processing
- [ ] **VR/AR Support** - Immersive experiences

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### **Development Guidelines**
- Follow ESLint configuration
- Use Prettier for formatting
- Write comprehensive tests
- Document new features
- Follow commit message conventions

## 📄 **License**

This project is licensed under the MIT License.

## 🆘 **Support**

### **Documentation**
- **Frontend**: Check component documentation
- **Backend**: See `backend/README.md`
- **API**: Use `/health` endpoint for status

### **Getting Help**
- Create an issue in the repository
- Check the troubleshooting guide
- Review the FAQ section
- Contact the development team

### **Community**
- Join our Discord server
- Follow us on social media
- Participate in discussions
- Share your experiences

## 🙏 **Acknowledgments**

- **OpenAI** - For providing the AI capabilities
- **React Team** - For the amazing frontend framework
- **Tailwind CSS** - For the beautiful styling system
- **MongoDB** - For the robust database solution
- **Open Source Community** - For all the amazing tools

---

## 🎯 **Getting Started Checklist**

- [ ] Clone the repository
- [ ] Install Node.js and npm
- [ ] Set up MongoDB
- [ ] Get OpenAI API key
- [ ] Configure environment variables
- [ ] Install dependencies
- [ ] Start the backend server
- [ ] Start the frontend application
- [ ] Test the application
- [ ] Customize as needed

## 🚀 **Ready to Launch?**

Your MoodLift AI platform is now ready! Start helping people improve their emotional well-being with the power of AI.

**Remember**: This is a mental health application. Always ensure proper crisis intervention protocols and professional support resources are available.

---

**Built with ❤️ for better mental health**

*MoodLift AI - Because everyone deserves emotional support* 