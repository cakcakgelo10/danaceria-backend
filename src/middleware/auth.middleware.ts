import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Menambahkan properti 'user' ke interface Request dari Express
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // 1. Ambil token dari header 'Authorization'
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  // 2. Jika tidak ada token, kirim error 401 (Unauthorized)
  if (token == null) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
  }

  // 3. Verifikasi token
  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    // Jika token tidak valid (error), kirim error 403 (Forbidden)
    if (err) {
      return res.status(403).json({ message: 'Token tidak valid.' });
    }

    // Jika token valid, simpan data user di request dan lanjutkan
    req.user = user;
    next(); // Lanjut ke controller berikutnya
  });
};