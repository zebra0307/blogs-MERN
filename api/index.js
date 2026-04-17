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

if (
    !process.env.FIREBASE_PROJECT_ID ||
    !process.env.FIREBASE_CLIENT_EMAIL ||
    !process.env.FIREBASE_PRIVATE_KEY
) {
    console.warn('WARNING: Firebase Admin env vars are incomplete. /api/auth/firebase will not work.');
} else {
    console.log('✓ Firebase Admin credentials are configured');
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

const parseCorsOrigins = (rawOrigins = '') => {
    const input = rawOrigins.trim();
    if (!input) {
        return [];
    }

    // Support JSON-array style values in env, e.g. ["https://a.com","https://b.com"].
    if (input.startsWith('[') && input.endsWith(']')) {
        try {
            const parsed = JSON.parse(input);
            if (Array.isArray(parsed)) {
                return parsed.map(origin => normalizeOrigin(String(origin))).filter(Boolean);
            }
        } catch {
            // Fall back to comma-separated parsing below.
        }
    }

    return input.split(',').map(normalizeOrigin).filter(Boolean);
};

const defaultCorsOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'https://z-blogs.vercel.app'
].map(normalizeOrigin);

const corsOrigins = parseCorsOrigins(process.env.CORS_ORIGINS || '');

// Always include safe defaults, then extend with custom env origins.
const allowedCorsOrigins = [...new Set([...defaultCorsOrigins, ...corsOrigins])];

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