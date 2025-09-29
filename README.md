# SmartStudentHub - Vercel Deployment Guide

## Quick Setup for Vercel Deployment

### 1. Environment Variables Setup

Before deploying to Vercel, you need to set up the following environment variables in your Vercel dashboard:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add the following variables:

```bash
DATABASE_URL=your_neon_database_url_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
SESSION_SECRET=your_session_secret_here
NODE_ENV=production
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your Vercel domain to authorized redirect URIs:
   - `https://your-app-name.vercel.app/api/auth/google/callback`
   - `http://localhost:3000/api/auth/google/callback` (for development)

### 3. Database Setup (Neon)

1. Create a [Neon](https://neon.tech/) account
2. Create a new database
3. Copy the connection string
4. Add it as `DATABASE_URL` in Vercel environment variables

### 4. Deploy to Vercel

#### Option 1: Through Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your GitHub repository
3. Configure environment variables
4. Deploy

#### Option 2: Through Vercel CLI
```bash
npm install -g vercel
vercel --prod
```

### 5. Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your actual values

# Run development server
npm run dev
```

## Project Structure

```
├── api/                 # Vercel serverless functions
├── client/             # React frontend
├── server/             # Express backend
├── shared/             # Shared types and schemas
├── types/              # TypeScript type definitions
├── vercel.json         # Vercel configuration
└── package.json        # Dependencies and scripts
```

## Features

- 🔐 Google OAuth Authentication
- 📊 Student Management Dashboard
- 🎓 Activity Tracking
- 📈 Analytics and Reports
- 🔄 Real-time Updates
- 📱 Responsive Design

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (Neon)
- **Authentication**: Passport.js with Google OAuth
- **Deployment**: Vercel

## Troubleshooting

### Common Issues:

1. **Environment Variables Not Set**: Make sure all required environment variables are configured in Vercel dashboard

2. **Google OAuth Redirect Error**: Ensure your Vercel domain is added to Google OAuth redirect URIs

3. **Database Connection Issues**: Verify your Neon database URL is correct and accessible

4. **Build Errors**: Check that all dependencies are properly installed and TypeScript compilation succeeds

### Support

If you encounter any issues, please check:
1. Vercel deployment logs
2. Browser console for frontend errors
3. Network tab for API call failures

## License

MIT License - see LICENSE file for details