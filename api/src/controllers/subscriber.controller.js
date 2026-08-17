import Subscriber from '../models/subscriber.model.js';
import { errorHandler } from '../utils/error.js';
import crypto from 'crypto';
import { sendVerificationEmail } from '../services/email.service.js';

export const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return next(errorHandler(400, 'Please provide a valid email address'));
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if subscriber exists
    let subscriber = await Subscriber.findOne({ email: normalizedEmail });

    if (subscriber) {
      if (subscriber.status === 'ACTIVE') {
        return res.status(200).json({ message: 'You are already subscribed!' });
      } else if (subscriber.status === 'PENDING') {
        // Resend verification email
        await sendVerificationEmail(subscriber.email, subscriber.verificationToken);
        return res.status(200).json({ message: 'Verification email resent. Please check your inbox.' });
      } else if (subscriber.status === 'UNSUBSCRIBED') {
        // Resubscribe them, send verification again
        const token = crypto.randomBytes(32).toString('hex');
        subscriber.status = 'PENDING';
        subscriber.verificationToken = token;
        await subscriber.save();
        await sendVerificationEmail(subscriber.email, token);
        return res.status(200).json({ message: 'Welcome back! Please check your email to verify your subscription.' });
      }
    }

    // New subscriber
    const token = crypto.randomBytes(32).toString('hex');
    subscriber = new Subscriber({
      email: normalizedEmail,
      verificationToken: token,
      status: 'PENDING',
    });

    await subscriber.save();
    
    // Send email without awaiting, to not block response if email API is slow
    sendVerificationEmail(subscriber.email, token).catch(err => console.error("Email send failed:", err));

    res.status(201).json({ message: 'Subscription successful! Please check your email to verify.' });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      return next(errorHandler(400, 'Invalid verification token'));
    }

    const subscriber = await Subscriber.findOne({ verificationToken: token });

    if (!subscriber) {
      return next(errorHandler(404, 'Invalid or expired verification token'));
    }

    if (subscriber.status === 'ACTIVE') {
      return res.status(200).json({ message: 'Email is already verified.' });
    }

    subscriber.status = 'ACTIVE';
    subscriber.verifiedAt = new Date();
    await subscriber.save();

    res.status(200).json({ message: 'Email verified successfully!' });
  } catch (error) {
    next(error);
  }
};

export const unsubscribe = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      return next(errorHandler(400, 'Invalid unsubscribe token'));
    }

    const subscriber = await Subscriber.findOne({ verificationToken: token });

    if (!subscriber) {
      return next(errorHandler(404, 'Invalid token or subscriber not found'));
    }

    if (subscriber.status === 'UNSUBSCRIBED') {
      return res.status(200).json({ message: 'You are already unsubscribed.' });
    }

    subscriber.status = 'UNSUBSCRIBED';
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.status(200).json({ message: 'You have been successfully unsubscribed.' });
  } catch (error) {
    next(error);
  }
};

export const getSubscribers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to see all subscribers'));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const subscribers = await Subscriber.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalSubscribers = await Subscriber.countDocuments();
    const activeSubscribers = await Subscriber.countDocuments({ status: 'ACTIVE' });

    res.status(200).json({
      subscribers,
      totalSubscribers,
      activeSubscribers,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubscriber = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to delete this subscriber'));
  }
  try {
    await Subscriber.findByIdAndDelete(req.params.subscriberId);
    res.status(200).json('Subscriber has been deleted');
  } catch (error) {
    next(error);
  }
};

export const addSubscriberAdmin = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to add subscribers manually'));
  }
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return next(errorHandler(400, 'Please provide a valid email address'));
    }

    const normalizedEmail = email.toLowerCase().trim();
    let subscriber = await Subscriber.findOne({ email: normalizedEmail });

    if (subscriber) {
      if (subscriber.status === 'ACTIVE') {
        return res.status(200).json({ message: 'Subscriber already exists and is active.' });
      }
      subscriber.status = 'ACTIVE';
      subscriber.verifiedAt = new Date();
      await subscriber.save();
      return res.status(200).json({ message: 'Existing subscriber status updated to ACTIVE.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    subscriber = new Subscriber({
      email: normalizedEmail,
      verificationToken: token,
      status: 'ACTIVE', // Automatically active if added by admin
      verifiedAt: new Date(),
    });

    await subscriber.save();
    res.status(201).json({ message: 'Subscriber successfully added.' });
  } catch (error) {
    next(error);
  }
};
