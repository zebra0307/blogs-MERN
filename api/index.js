import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
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

mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log('MongoDb is connected');
    })
    .catch(err => {
        console.log(err);
    });

const app = express();

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});
app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

app.get('/test', (req, res) => {
    res.json({ message: 'API is working!' });
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