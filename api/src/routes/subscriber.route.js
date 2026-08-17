import express from 'express';
import { subscribe, verifyEmail, unsubscribe, getSubscribers, deleteSubscriber, addSubscriberAdmin } from '../controllers/subscriber.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/subscribe', subscribe);
router.get('/verify/:token', verifyEmail);
router.get('/unsubscribe/:token', unsubscribe);
router.get('/getsubscribers', verifyToken, getSubscribers);
router.delete('/delete/:subscriberId', verifyToken, deleteSubscriber);
router.post('/add', verifyToken, addSubscriberAdmin);

export default router;
