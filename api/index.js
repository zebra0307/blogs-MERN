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
import path from 'path';

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

// CORS configuration - allow frontend to make requests
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});
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

app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client','build','index.html'));
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

app.listen(3000, () => {
    console.log('server is running on port 3000');
});