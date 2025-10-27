# Backend Setup for Recognition System

This document explains how to set up and run the backend API that handles saving recognition data to JSON files.

## Quick Start

1. **Install backend dependencies:**
   ```bash
   npm run setup:backend
   ```

2. **Start the backend server:**
   ```bash
   npm run backend:start
   ```
   
   The backend will run on `http://localhost:3001`

3. **Start the frontend (in a new terminal):**
   ```bash
   npm start
   ```

## What the Backend Does

The backend API provides the following endpoints:

- `GET /api/recognitions` - Get all recognitions
- `POST /api/recognitions` - Save a new recognition to `public/data/recognition.json`
- `GET /api/users` - Get all users
- `PUT /api/users/:userId/badges` - Update user badge counts in `public/data/users.json`
- `PUT /api/recognitions/:recognitionId/like` - Update like status in `public/data/recognition.json`

## How It Works

1. **When a recognition is created:**
   - Frontend sends the recognition data to `POST /api/recognitions`
   - Backend appends the new recognition to `public/data/recognition.json`
   - Backend updates user badge counts via `PUT /api/users/:userId/badges`

2. **When a like is toggled:**
   - Frontend sends the like request to `PUT /api/recognitions/:recognitionId/like`
   - Backend updates the like status in `public/data/recognition.json`

3. **Data persistence:**
   - All changes are immediately written to the JSON files
   - Data persists across server restarts
   - No database required - uses simple JSON file storage

## Development Mode

For development with auto-restart:
```bash
npm run backend:dev
```

## Fallback Behavior

If the backend is not running, the frontend will:
- Fall back to localStorage for temporary storage
- Log warnings about backend connectivity
- Still function but data won't persist to JSON files

## File Structure

```
├── server.js                 # Backend server
├── public/data/
│   ├── recognition.json     # Recognition data (updated by backend)
│   ├── users.json          # User data (updated by backend)
│   └── campaign.json       # Campaign data (read-only)
└── BACKEND_SETUP.md        # This file
```

## Troubleshooting

1. **Backend won't start:**
   - Make sure port 3001 is not in use
   - Check that all dependencies are installed: `npm run setup:backend`

2. **Frontend can't connect to backend:**
   - Ensure backend is running on `http://localhost:3001`
   - Check browser console for CORS errors
   - Verify the API endpoints are accessible

3. **Data not persisting:**
   - Check that the backend has write permissions to `public/data/`
   - Verify the JSON files are not corrupted
   - Check backend console for error messages
