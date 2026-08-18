import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createResource, getResources, deleteResource } from '../controllers/resource.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createResource);
router.get('/getresources', getResources);
router.delete('/deleteresource/:resourceId', verifyToken, deleteResource);

export default router;
