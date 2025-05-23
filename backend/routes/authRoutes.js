import express from 'express';
import { loginUser, registerUser, logoutUser } from '../controllers/authController.js';
import { validateSignup, validateLogin } from '../utils/validation.js'; // Import validation

const router = express.Router();

// Register route with validation
router.post('/register', validateSignup, registerUser);

// Login route with validation
router.post('/login', validateLogin, loginUser);

// Logout route
router.post('/logout', logoutUser);

export default router;
