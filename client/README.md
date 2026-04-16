# Blogs MERN - Frontend

Frontend for the Blogs MERN application, built with React + Vite.

## Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build production assets to `dist/`
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Environment Variables

Copy `client/.env.example` to `client/.env` and fill values.

Required:

- `VITE_BACKEND_URL` - Backend base URL (example: `https://your-api-domain.com`)
- Firebase keys used in `client/src/firebase.js`

## Local Development

From project root:

1. `npm install`
2. `npm install --prefix client`
3. Configure `api/.env` and `client/.env`
4. Start backend: `npm run dev`
5. Start frontend: `npm run dev --prefix client`

## Separate Deployment (Frontend + Backend on Different Hosts)

### Backend service

- Build command: `npm install`
- Start command: `npm start`
- Required env:
	- `MONGO`
	- `JWT_SECRET`
	- `NODE_ENV=production`
	- `CORS_ORIGINS=https://your-frontend-domain.com`
	- `SERVE_CLIENT=false`

### Frontend service

- Root directory: `client`
- Build command: `npm install && npm run build`
- Output directory: `dist`
- Required env:
	- `VITE_BACKEND_URL=https://your-backend-domain.com`

## Notes

- Use HTTPS for both frontend and backend in production to allow secure cross-site auth cookies.
- For multiple frontend domains, set `CORS_ORIGINS` as a comma-separated list.
