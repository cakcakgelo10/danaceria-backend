import { Router } from 'express';
import { registerUser, loginUser } from './auth.controller';

const router = Router();

// Definisikan route untuk registrasi
// POST /api/auth/register
router.post('/register', registerUser);

// Definisikan route untuk login
// POST /api/auth/login
router.post('/login', loginUser);

export default router;