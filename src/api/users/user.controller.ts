import { Request, Response } from 'express';
import pool from '../../config/database';

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    // Ambil userId dari request yang sudah ditambahkan oleh middleware
    const userId = req.user.userId;

    const [rows]: any[] = await pool.query(
      // Ambil data spesifik, jangan ambil password!
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan.' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};