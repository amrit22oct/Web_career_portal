import express from 'express';
import { sendNotification } from '../controllers/notificationController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

// Send notification
router.post('/send', isAuthenticated, sendNotification);

export default router;
