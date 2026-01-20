# Image Search App - MERN Stack with OAuth

A full-stack image search application built with MongoDB, Express.js, React.js, and Node.js, featuring OAuth authentication and Openverse API integration.

## Features

- 🔐 **OAuth Authentication** - Login with Google
- 🔍 **Image Search** - Search images using Openverse API (Creative Commons images, no API key required)
- 📊 **Top Searches** - View the top 5 most searched terms across all users
- 📝 **Search History** - Personal search history for each user
- ✅ **Multi-Select** - Select multiple images with visual feedback
- 🎨 **Modern UI** - Built with Tailwind CSS 4 and React

## Project Structure

```
image-search-app/
├── backend/               # Backend (Express + Node.js) - Deploy to Render
│   ├── config/            # Configuration files
│   │   ├── database.js    # MongoDB connection
│   │   └── passport.js    # Passport OAuth strategies
│   ├── models/            # MongoDB models
│   │   ├── User.js        # User model
│   │   └── Search.js      # Search history model
│   ├── routes/            # API routes
│   │   ├── auth.js        # Authentication routes
│   │   └── search.js      # Search and history routes
│   ├── server.js          # Express server entry point
│   ├── package.json       # Backend dependencies
│   └── render.yaml        # Render deployment configuration
│
├── frontend/              # Frontend (React + Vite) - Deploy to Vercel
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Login.jsx
│   │   │   ├── TopSearches.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── ImageGrid.jsx
│   │   │   └── SearchHistory.jsx
│   │   ├── config/
│   │   │   └── api.js     # API configuration
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # React entry point
│   │   └── index.css      # Tailwind CSS imports
│   ├── public/
│   │   └── favicon.svg
│   ├── index.html
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.js     # Vite configuration
│   ├── tailwind.config.js # Tailwind CSS configuration
│   └── postcss.config.js  # PostCSS configuration
│
├── README.md              # This file
└── .gitignore             # Comprehensive gitignore for both frontend & backend
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/)
- No API key required for image search (uses Openverse - free Creative Commons images)

## Setup Instructions

### 1. Clone and Navigate

```bash
cd image-search-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/image-search
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/image-search

# Session Secret (generate a random string)
SESSION_SECRET=your-random-session-secret-key-here

# OAuth - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL
CLIENT_URL=http://localhost:3000

# Note: Image search uses Openverse API (no API key required)
# Openverse provides free access to Creative Commons images
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. OAuth Configuration

#### Google OAuth Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5001/api/auth/google/callback`

### 5. Start MongoDB

If using local MongoDB:
```bash
mongod
```

Or ensure your MongoDB Atlas connection string is correct in `.env`.

### 6. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## API Endpoints

### Authentication

#### GET `/api/auth/google`
Initiate Google OAuth login

#### GET `/api/auth/me`
Get current authenticated user
- **Response:**
```json
{
  "id": "user_id",
  "name": "User Name",
  "email": "user@example.com",
  "avatar": "https://...",
  "provider": "google"
}
```

#### POST `/api/auth/logout`
Logout current user
- **Response:**
```json
{
  "message": "Logged out successfully"
}
```

### Search

#### POST `/api/search`
Search for images
- **Authentication:** Required
- **Body:**
```json
{
  "term": "nature"
}
```
- **Response:**
```json
{
  "term": "nature",
  "count": 20,
  "images": [
    {
      "id": "image_id",
      "url": "https://...",
      "thumb": "https://...",
      "description": "Image description",
      "author": "Author Name",
      "authorUrl": "https://..."
    }
  ]
}
```

#### GET `/api/top-searches`
Get top 5 most searched terms
- **Authentication:** Not required
- **Response:**
```json
[
  {
    "term": "nature",
    "count": 45
  },
  {
    "term": "mountains",
    "count": 32
  }
]
```

#### GET `/api/history`
Get user's search history
- **Authentication:** Required
- **Response:**
```json
[
  {
    "term": "nature",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
]
```

## cURL Examples

### Get Current User
```bash
curl -X GET http://localhost:5001/api/auth/me \
  -H "Cookie: connect.sid=your-session-id" \
  --cookie-jar cookies.txt
```

### Search Images
```bash
curl -X POST http://localhost:5001/api/search \
  -H "Content-Type: application/json" \
  -H "Cookie: connect.sid=your-session-id" \
  -d '{"term": "nature"}' \
  --cookie-jar cookies.txt
```

### Get Top Searches
```bash
curl -X GET http://localhost:5001/api/top-searches
```

### Get Search History
```bash
curl -X GET http://localhost:5001/api/history \
  -H "Cookie: connect.sid=your-session-id" \
  --cookie-jar cookies.txt
```

### Logout
```bash
curl -X POST http://localhost:5001/api/auth/logout \
  -H "Cookie: connect.sid=your-session-id" \
  --cookie-jar cookies.txt
```

## Technologies Used

### Backend:
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Passport.js** - Authentication middleware
- **passport-google-oauth20** - Google OAuth strategy
- **express-session** - Session management
- **Axios** - HTTP client for Openverse API

### Frontend:
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **Axios** - HTTP client
- **React Router** - Routing (if needed)

## Features Implementation

### 1. Authentication
- OAuth integration with Google
- Session-based authentication
- Protected routes on backend

### 2. Top Searches Banner
- Aggregates search terms across all users
- Displays top 5 most frequent searches
- Clickable to perform new searches

### 3. Search Functionality
- Stores search history in MongoDB
- Fetches images from Openverse API (Creative Commons images)
- Displays results in a 4-column grid
- Shows search term and result count

### 4. Multi-Select Counter
- Client-side state management
- Visual checkbox overlay on images
- Dynamic counter display
- Click to toggle selection

### 5. User Search History
- Personal history for each authenticated user
- Displays search terms with timestamps
- Clickable to re-search
- Sidebar layout

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or Atlas connection string is correct
- Check firewall settings for Atlas

### OAuth Errors
- Verify redirect URI matches exactly: `http://localhost:5001/api/auth/google/callback`
- Check that Google Client ID and Secret are correct
- Ensure OAuth app is in development mode (for testing)

### Openverse API Errors
- Openverse API is free and requires no API key
- If you encounter rate limiting (429 errors), wait a few minutes and try again
- Ensure your User-Agent header is properly set (handled automatically by the app)

### CORS Issues
- Verify `CLIENT_URL` in `.env` matches your frontend URL
- Check that credentials are enabled in axios requests

## Deployment

### Backend Deployment (Render)

The backend is designed to be deployed on [Render](https://render.com/):

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Name:** `image-search-backend` (or your preferred name)
   - **Region:** Select your preferred region
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`

4. **Add Environment Variables** in Render dashboard:
   ```env
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   SESSION_SECRET=<generate-a-secure-random-string>
   GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-oauth-client-secret>
   CLIENT_URL=<your-vercel-frontend-url>
   PORT=5001
   ```

5. **Deploy** - Render will automatically deploy your backend

### Frontend Deployment (Vercel)

The frontend is designed to be deployed on [Vercel](https://vercel.com/):

1. **Import your GitHub repository** in Vercel
2. **Configure the project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

3. **Add Environment Variables** in Vercel dashboard:
   ```env
   VITE_API_URL=<your-render-backend-url>
   ```
   Example: `VITE_API_URL=https://your-app.onrender.com`

4. **Deploy** - Vercel will automatically deploy your frontend and handle SPA routing

### Google OAuth Configuration for Production

Update your Google OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/apis/credentials):

1. Go to your OAuth 2.0 Client ID
2. Add to **Authorized JavaScript origins**:
   ```
   https://your-frontend-url.vercel.app
   https://your-backend-url.onrender.com
   ```
3. Add to **Authorized redirect URIs**:
   ```
   https://your-backend-url.onrender.com/api/auth/google/callback
   ```

### MongoDB Atlas Setup for Production

1. Create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
2. Create a new cluster (free tier available)
3. Add database user with password
4. Whitelist IP addresses (allow access from anywhere for Render/Vercel: `0.0.0.0/0`)
5. Get connection string and add to environment variables

## License

This project is created for internship/learning purposes.

by MANYA SHUKLA 