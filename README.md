# Blogs MERN

Full-stack MERN blog platform with authentication, OTP-based flows, admin dashboard features, posts, and comments.

## Project Structure

```
blog-MERN/
├─ api/         # Express + MongoDB backend
├─ client/      # React + Vite frontend
├─ package.json # Root scripts (backend + helper build)
└─ .gitignore
```

## Tech Stack

- Frontend: React, Vite, Redux Toolkit, Flowbite React, Firebase
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, Cookie-based auth
- Email/OTP: Brevo

## Prerequisites

- Node.js 18+ recommended
- npm 9+ recommended
- MongoDB connection string (Atlas or local)
- Firebase project config (for Google auth and Firebase features)

## Environment Setup

Create these files:

- `api/.env` from `api/.env.example`
- `client/.env` from `client/.env.example`

### Backend Environment Variables (`api/.env`)

Required:

- `MONGO` - MongoDB URI
- `JWT_SECRET` - JWT signing secret

Recommended / optional:

- `PORT` - Defaults to `3000`
- `NODE_ENV` - Use `production` in production deployments
- `CORS_ORIGINS` - Comma-separated frontend origins for CORS
- `SERVE_CLIENT` - `true` if backend should serve `client/dist`; `false` for API-only mode
- `BREVO_API_KEY` - Required for OTP/email features
- `BREVO_FROM_EMAIL` - Required for OTP/email features
- `BREVO_FROM_NAME` - Sender display name for email

Example:

```env
MONGO=mongodb+srv://username:password@cluster.mongodb.net/database_name
JWT_SECRET=replace_with_a_strong_secret
PORT=3000
NODE_ENV=production
CORS_ORIGINS=https://your-frontend-domain.com
SERVE_CLIENT=false
BREVO_API_KEY=your_brevo_key
BREVO_FROM_EMAIL=your_verified_email@example.com
BREVO_FROM_NAME=Blogs MERN
```

### Frontend Environment Variables (`client/.env`)

Required for API calls:

- `VITE_BACKEND_URL` - Backend base URL

Firebase variables used by the app:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

Example:

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Install Dependencies

From project root:

```bash
npm install
npm install --prefix client
```

## Run Locally

Terminal 1 (backend):

```bash
npm run dev
```

Terminal 2 (frontend):

```bash
npm run dev --prefix client
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Health check: `http://localhost:3000/test`

## Available Scripts

### Root Scripts

- `npm start` - Start backend (`node api/index.js`)
- `npm run dev` - Start backend with nodemon
- `npm run build` - Installs dependencies and builds frontend (`client/dist`)

### Client Scripts

- `npm run dev --prefix client`
- `npm run build --prefix client`
- `npm run preview --prefix client`
- `npm run lint --prefix client`

## Deployment Guide

### Option A: Combined Deployment (Backend serves frontend)

Use this if deploying as one service.

1. Set backend env:
   - `SERVE_CLIENT=true`
   - `NODE_ENV=production`
2. Build command:

```bash
npm run build
```

3. Start command:

```bash
npm start
```

4. `VITE_BACKEND_URL` can be empty when frontend and API share the same origin.

### Option B: Separate Deployment (Frontend and backend on different hosts)

Use this if frontend and backend are deployed independently.

Backend service:

- Build command: `npm install`
- Start command: `npm start`
- Required env:
  - `MONGO`
  - `JWT_SECRET`
  - `NODE_ENV=production`
  - `CORS_ORIGINS=https://your-frontend-domain.com`
  - `SERVE_CLIENT=false`

Frontend service:

- Root directory: `client`
- Build command: `npm install && npm run build`
- Output directory: `dist`
- Required env:
  - `VITE_BACKEND_URL=https://your-backend-domain.com`

Important for auth cookies across domains:

- Use HTTPS on both frontend and backend in production.
- Keep frontend requests with `credentials: 'include'`.
- Keep backend CORS `credentials: true` and allow exact frontend origin.

## Troubleshooting

- CORS errors:
  - Ensure `CORS_ORIGINS` includes the exact frontend URL (including `https://`).
- Login works but session does not persist:
  - Confirm HTTPS and production cookie settings (`sameSite=none`, `secure=true`).
- OTP emails not sending:
  - Check `BREVO_API_KEY` and `BREVO_FROM_EMAIL`.
- Frontend calls wrong API:
  - Verify `VITE_BACKEND_URL` in `client/.env` and rebuild frontend.

## License

ISC