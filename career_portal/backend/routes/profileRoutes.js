import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/profile', isAuthenticated, getProfile);
router.put('/profile', isAuthenticated, updateProfile);
export default router;
