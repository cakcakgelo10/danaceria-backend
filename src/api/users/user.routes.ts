import { Router } from 'express';
import { getUserProfile } from './user.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

// Route ini akan diproteksi oleh middleware authenticateToken
router.get('/profile', authenticateToken, getUserProfile);
//                   ^^^^^^^^^^^^^^^^^^
// Middleware diletakkan di antara path dan controller

export default router;