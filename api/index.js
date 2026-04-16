import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoutes from './src/routes/user.route.js';
import authRoutes from './src/routes/auth.route.js';
import postRoutes from './src/routes/post.route.js';
import commentRoutes from './src/routes/comment.route.js';
import otpRoutes from './src/routes/otp.route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

// Validate required environment variables
if (!process.env.JWT_SECRET) {
    console.error('ERROR: JWT_SECRET is not defined in .env file');
    console.log('Please add JWT_SECRET=your_secret_key to your .env file');
}

if (!process.env.MONGO) {
    console.error('ERROR: MONGO is not defined in .env file');
}

if (!process.env.BREVO_API_KEY) {
    console.warn('WARNING: BREVO_API_KEY is not defined. Email features will not work.');
} else {
    console.log('✓ BREVO_API_KEY is configured');
}

if (!process.env.BREVO_FROM_EMAIL) {
    console.warn('WARNING: BREVO_FROM_EMAIL is not defined. Email features will not work.');
} else {
    console.log('✓ BREVO_FROM_EMAIL is configured:', process.env.BREVO_FROM_EMAIL);
}

mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log('MongoDb is connected');
    })
    .catch(err => {
        console.log(err);
    });

const app = express();

const normalizeOrigin = (origin = '') =>
    origin.trim().replace(/^['"]|['"]$/g, '').replace(/\/$/, '');

const defaultCorsOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
    'https://blogs-mern-hhov.onrender.com',
    'https://z-blogs.vercel.app'
].map(normalizeOrigin);

const corsOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean);

const allowedCorsOrigins = corsOrigins.length > 0 ? corsOrigins : defaultCorsOrigins;

const corsOptions = {
    origin: (origin, callback) => {
        // Allow non-browser clients and same-origin requests.
        if (!origin) {
            return callback(null, true);
        }

        const requestOrigin = normalizeOrigin(origin);
        const isAllowed = allowedCorsOrigins.includes(requestOrigin);
        return callback(null, isAllowed ? requestOrigin : false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// CORS configuration - supports separate frontend/backend deployment.
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

if (corsOrigins.length > 0) {
    console.log('✓ CORS_ORIGINS loaded from environment');
} else {
    console.log('Using default CORS origins (set CORS_ORIGINS to override)');
}

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/otp', otpRoutes);

app.get('/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

const shouldServeClient = process.env.SERVE_CLIENT === 'true';

if (shouldServeClient) {
    const clientDistPath = path.join(__dirname, '../client/dist');

    // Serve static files from the React app (Vite builds to 'dist').
    app.use(express.static(clientDistPath));

    // Handle React routing for non-API routes.
    app.use((req, res, next) => {
        if (req.path.startsWith('/api')) {
            return next();
        }
        res.sendFile(path.join(clientDistPath, 'index.html'));
    });
} else {
    // API-only mode for separate frontend hosting.
    app.get('/', (req, res) => {
        res.json({ message: 'API is running' });
    });
}

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});