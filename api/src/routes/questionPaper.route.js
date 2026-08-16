import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createPaper, getPapers, deletePaper } from '../controllers/questionPaper.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createPaper);
router.get('/getpapers', getPapers);
router.delete('/deletepaper/:paperId', verifyToken, deletePaper);

export default router;
