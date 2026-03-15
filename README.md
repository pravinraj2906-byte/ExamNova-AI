# ExamNova AI - Intelligent Tutoring Platform

ExamNova AI is a comprehensive AI-powered tutoring platform that helps students learn smarter through personalized tutoring, intelligent problem solving, and adaptive study planning.

## Features

### 1. **Chat with Nova**
- Real-time AI tutoring for any subject
- Adaptive explanations based on learning style
- 24/7 availability
- Context-aware responses

### 2. **Image Problem Solver**
- Upload photos of math problems, chemistry equations, or any academic problem
- Get instant step-by-step solutions
- Learn through detailed explanations
- Support for multiple problem types

### 3. **AI-Generated Quizzes**
- Create customized quizzes on any topic
- Multiple difficulty levels (Easy, Medium, Hard)
- Instant feedback and explanations
- Track quiz performance

### 4. **Study Planner**
- Generate personalized study schedules
- Customizable duration and difficulty
- Daily learning objectives and exercises
- Progressive learning paths

### 5. **Progress Tracking**
- Monitor learning statistics
- Track accuracy rates and problems solved
- View study time analytics
- Unlock achievements and badges

### 6. **User Profiles & Settings**
- Customize learning preferences
- Set preferred subjects
- Select learning style (Visual, Auditory, Kinesthetic, Reading)
- Update grade level

## Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/UI** - Component library
- **Lucide React** - Icons

### Backend
- **Next.js API Routes** - Serverless functions
- **Groq AI** - LLM integration
- **Prisma ORM** - Database management
- **JWT Authentication** - Secure auth

### Database
- **Neon PostgreSQL** - Relational database
- **Prisma** - ORM

### Authentication
- JWT-based authentication
- Bcrypt password hashing
- Session management

## Project Structure

```
app/
├── api/                      # API routes
│   ├── auth/                # Authentication endpoints
│   ├── chat/                # Chat API
│   ├── solve-image/         # Image problem solver
│   ├── generate-quiz/       # Quiz generation
│   ├── generate-study-plan/ # Study plan generation
│   ├── progress/            # Progress tracking
│   └── user/                # User profile
├── chat/                    # Chat interface
├── dashboard/               # Dashboard page
├── image-solver/            # Image solver page
├── quiz/                    # Quiz page
├── study-planner/           # Study planner page
├── progress/                # Progress tracking page
├── settings/                # Settings page
├── login/                   # Login page
├── signup/                  # Signup page
└── layout.tsx               # Root layout
components/
├── sidebar.tsx              # Navigation sidebar
├── protected-route.tsx      # Auth protection
└── ui/                      # UI components
lib/
├── db.ts                    # Database client
├── auth.ts                  # Authentication utilities
├── auth-context.tsx         # Auth provider
└── utils.ts                 # Utility functions
prisma/
├── schema.prisma            # Database schema
└── migrations/              # Database migrations
scripts/
├── init-db.sql             # Database initialization
└── setup.sh                # Setup script
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon)
- Groq API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd examnova-ai
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
Create a `.env.local` file:
```
DATABASE_URL=your_neon_database_url
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
GROQ_API_KEY=your_groq_api_key
```

4. **Initialize the database**
```bash
pnpm exec prisma migrate dev --name init
```

5. **Run the development server**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user

### Chat
- `POST /api/chat` - Send message to AI tutor
- `GET /api/chat` - Get chat sessions

### Problem Solving
- `POST /api/solve-image` - Solve problem from image

### Quizzes
- `POST /api/generate-quiz` - Generate quiz

### Study Plans
- `POST /api/generate-study-plan` - Generate study plan

### Progress
- `GET /api/progress` - Get progress data
- `POST /api/progress` - Update progress

### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## Database Schema

The application uses PostgreSQL with the following main tables:

- **users** - User accounts and profiles
- **chat_sessions** - Conversation sessions
- **chat_messages** - Chat messages
- **quizzes** - Quiz metadata
- **quiz_questions** - Quiz questions
- **quiz_answers** - User quiz answers
- **study_plans** - Study plan data
- **study_plan_days** - Daily study schedule
- **documents** - Uploaded files for analysis
- **progress_tracking** - User progress metrics
- **achievements** - User badges and achievements

## Authentication Flow

1. User signs up with email and password
2. Password is hashed with bcrypt
3. JWT token is generated and stored in localStorage
4. Protected routes check for valid token
5. API requests include token in Authorization header

## AI Integration

ExamNova AI uses Groq's language models for:
- Natural language tutoring
- Problem explanation and solving
- Quiz question generation
- Study plan creation
- Image-based problem analysis

## Features in Development

- [ ] Voice tutoring
- [ ] Video explanations
- [ ] Collaborative study groups
- [ ] Peer-to-peer tutoring marketplace
- [ ] Gamified learning challenges
- [ ] Mobile app
- [ ] Integration with learning management systems

## Performance Optimizations

- Client-side authentication state management
- Streaming responses from AI
- Database query optimization with Prisma
- Image compression before upload
- Lazy loading of components
- CSS-in-JS for dynamic styling

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT authentication with expiration
- Protected API routes
- Input validation on all endpoints
- SQL injection prevention with Prisma
- CORS configuration

## Deployment

The application is optimized for deployment on Vercel:

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

## Contributing

Contributions are welcome! Please follow these steps:

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, open an issue on GitHub or contact support@examnova.ai

## Roadmap

- Q1 2024: Beta launch with core features
- Q2 2024: Mobile app release
- Q3 2024: Advanced analytics and reporting
- Q4 2024: Enterprise features and API access

---

Built with love by the ExamNova team. Transforming education through AI.
