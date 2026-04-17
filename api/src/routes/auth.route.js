import express from 'express';
import {
  firebaseAuth,
  google,
  signin,
  signup,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/firebase', firebaseAuth);
router.post('/google', google);

export default router;