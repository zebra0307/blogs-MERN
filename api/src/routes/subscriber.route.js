import express from 'express';
import { subscribe, verifyEmail, unsubscribe } from '../controllers/subscriber.controller.js';

const router = express.Router();

router.post('/subscribe', subscribe);
router.get('/verify/:token', verifyEmail);
router.get('/unsubscribe/:token', unsubscribe);

export default router;
