# ArvyaX AI-Assisted Journal System

A full-stack wellness journaling application built with Next.js, MongoDB, and Gemini AI. Users can record reflections after immersive nature sessions (forest, ocean, mountain) and receive AI-powered emotional analysis and insights.

## 🚀 Features
- **Nature Session Journaling**: Post-session reflections for Forest, Ocean, and Mountain ambiences.
- **AI Emotion Analysis**: Real-time analysis using Gemini 1.5 Flash to extract emotions, keywords, and summaries.
- **Interactive Insights**: Dashboard showing total entries, dominant emotions, and frequent keywords.
- **Modern UI**: Clean, responsive interface built with Tailwind CSS and Framer Motion.

## 🛠️ Tech Stack
- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Database**: [MongoDB](https://www.mongodb.com/) (via Mongoose)
- **AI**: [Google Gemini API](https://aistudio.google.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)

## 🏁 Getting Started

### 1. Prerequisites
- Node.js 18+ 
- MongoDB (Local or Atlas)
- Gemini API Key

### 2. Environment Setup
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/arvyax_journal
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 3. Installation
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🧪 API Endpoints

- `POST /api/journal`: Create a new journal entry.
- `GET /api/journal?userId=123`: Retrieve entries for a user.
- `POST /api/journal/analyze`: Analyze text and update an entry with AI insights.
- `GET /api/journal/insights/123`: Get aggregated user data.

---
*Created for the ArvyaX Full-Stack Assignment.*

