# Topic Quiz Creator

A full-stack application that generates AI-powered quizzes on any topic using OpenAI's GPT models, with MongoDB for data persistence.

## 📸 App Screenshots

### 🧠 Guests Screen View
![Guest Screen View Screenshot](./public/screenshots/guest-quiz-screen.png)

### 🧠 Dashboard View
![Dashboard Screenshot](./public/screenshots/quiz-dashboard.png)

### ❓ Quiz Question View
![Quiz Screen Screenshot](./public/screenshots/quiz-screen.png)

## Features

- 🏠 **User Dashboard**: Users can view their previous quiz results, compare scores, and maintain their quiz records. Signed-in users see their details and quiz history on the dashboard.
- 🧑‍💻 **Guest Access**: Anyone can take quizzes without logging in. Results are shown after each quiz, but only signed-in users can save and track their history.
- 🤖 **AI-Powered Quiz Generation**: Uses OpenAI's GPT-4 to generate intelligent, topic-specific questions
- 📊 **MongoDB Integration**: Persistent storage for quizzes and results
- 🎨 **Modern UI**: Sleek, responsive design with dark mode support
- ⚡ **Real-time Grading**: Instant feedback and scoring
- 🔄 **Fallback System**: Graceful degradation when AI service is unavailable
- 📱 **Mobile Responsive**: Works perfectly on all devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **AI**: OpenAI GPT-4 via Vercel AI SDK
- **Styling**: shadcn/ui components
- **Deployment**: Vercel (recommended)

## Prerequisites

- Node.js 18+
- MongoDB database (MongoDB Atlas recommended)
- OpenAI API key

## Environment Variables

Create a `.env` file in the root directory:

\`\`\`env
# MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quiz_app?retryWrites=true&w=majority

# OpenAI API Key for AI-generated quizzes
OPENAI_API_KEY=sk-your-openai-api-key-here
\`\`\`

## Setup Instructions

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/yourusername/topic-quiz-creator.git
cd topic-quiz-creator
\`\`\`

### 2. Install Dependencies

\`\`\`bash
pnpm install
\`\`\`

### 3. Set Up MongoDB

#### Option A: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Add it to your `.env` file

#### Option B: Local MongoDB
\`\`\`bash
# Install MongoDB locally
brew install mongodb/brew/mongodb-community  # macOS
# or follow instructions for your OS

# Start MongoDB
brew services start mongodb/brew/mongodb-community

# Use local connection string
MONGODB_URI=mongodb://localhost:27017/quiz_app
\`\`\`

### 4. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account and get your API key
3. Add it to your `.env` file

### 5. Run the Application

\`\`\`bash
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Generate Quiz
\`\`\`
GET /api/generate?topic=<topic>
\`\`\`

**Response:**
\`\`\`json
{
  "quizId": "abc123",
  "questions": [
    {
      "id": 1,
      "text": "What is React?",
      "options": ["A JavaScript library", "A database", "A server", "An OS"]
    }
  ],
  "generatedBy": "AI"
}
\`\`\`

### Grade Quiz
\`\`\`
POST /api/grade?quizId=<quizId>
\`\`\`

**Body:**
\`\`\`json
{
  "answers": {
    "1": "A JavaScript library",
    "2": "Virtual DOM"
  }
}
\`\`\`

**Response:**
\`\`\`json
{
  "correct": 2,
  "total": 5,
  "feedback": [
    {
      "id": 1,
      "yourAnswer": "A JavaScript library",
      "correctAnswer": "A JavaScript library"
    }
  ]
}
\`\`\`

## Database Schema

### Quizzes Collection
\`\`\`javascript
{
  _id: ObjectId,
  quizId: String,
  topic: String,
  questions: [
    {
      id: Number,
      text: String,
      options: [String]
    }
  ],
  correctAnswers: {
    "1": "Correct answer",
    "2": "Another correct answer"
  },
  createdAt: Date
}
\`\`\`

### Quiz Results Collection
\`\`\`javascript
{
  _id: ObjectId,
  quizId: String,
  userAnswers: {
    "1": "User's answer",
    "2": "Another answer"
  },
  score: Number,
  completedAt: Date
}
\`\`\`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `OPENAI_API_KEY`
4. Deploy!

### Environment Variables for Production

Make sure to add these in your deployment platform:

- `MONGODB_URI`: Your MongoDB connection string
- `OPENAI_API_KEY`: Your OpenAI API key

## Features in Detail

### Dashboard & User Records
- Users who sign up can view their quiz history, compare previous results, and see their account details on the dashboard.
- Guests (not logged in) can take quizzes, but their results are not saved for future reference.

### AI Quiz Generation
- Uses OpenAI's GPT-4 model for intelligent question generation
- Prompts are carefully crafted for educational, factual questions
- Automatic fallback to curated questions if AI fails
- Supports any topic with contextually relevant questions

### MongoDB Integration
- Persistent storage for all quizzes and results
- Efficient querying with proper indexing
- Secure storage of correct answers separate from public quiz data
- Result tracking for analytics

### Error Handling
- Graceful degradation when services are unavailable
- Comprehensive error logging
- User-friendly error messages
- Automatic fallback systems

## Architecture Decisions

### Why Next.js?
- Full-stack capabilities with API routes
- Server-side rendering for better SEO
- Built-in TypeScript support
- Easy deployment to Vercel

### Why MongoDB?
- Flexible schema for quiz data
- Excellent performance for read-heavy workloads
- Easy scaling with MongoDB Atlas
- JSON-like documents match our data structure

### Why OpenAI?
- State-of-the-art language model
- Excellent at generating educational content
- Reliable API with good documentation
- Cost-effective for quiz generation

### Why Dashboard & Auth?
- Provides personalized experience for users
- Enables users to track and compare their quiz results
- Supports both guest and authenticated user flows

## Testing Strategy

### Unit Tests (Recommended)
- Quiz generation logic
- Database operations
- API endpoint validation
- Component rendering

### Integration Tests
- Full quiz flow (generate → take → grade)
- Database connectivity
- AI service integration
- Error handling scenarios

### E2E Tests
- Complete user journeys
- Cross-browser compatibility
- Mobile responsiveness
- Performance under load

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
