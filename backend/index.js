import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log('MongoDb is connected');
    })
    .catch(err => {
        console.log(err);
    });

const app=express();

app.listen(3000, () => {
    console.log('server is running on port 3000');
});

app.get('/test', (req, res) =>{
    res.json({message: 'API is working!'});
});