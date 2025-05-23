import express from 'express';
import { sendMessage, getMessages } from '../controllers/messageController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

// Send message
router.post('/send', isAuthenticated, sendMessage);

// Get messages between users
router.get('/messages/:receiverId', isAuthenticated, getMessages);

export default router;
