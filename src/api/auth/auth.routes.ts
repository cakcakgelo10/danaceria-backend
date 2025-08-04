import { Router } from 'express';
import { registerUser } from './auth.controller';

const router = Router();

// Definisikan route untuk registrasi
// POST /api/auth/register
router.post('/register', registerUser);

export default router;