import { Request, Response } from 'express';
import pool from '../../config/database';
import bcrypt from 'bcrypt';

export const registerUser = async (req: Request, res: Response) => {
  try {
    // 1. Ambil data dari body request
    const { username, email, password } = req.body;

    // 2. Validasi input (sederhana)
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    // 3. Hash password sebelum disimpan
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Simpan user ke database
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    // 5. Kirim respon sukses
    res.status(201).json({ message: 'Registrasi berhasil!', userId: (result as any).insertId });

  } catch (error: any) {
    // Tangani error jika email/username sudah terdaftar (error code 'ER_DUP_ENTRY')
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email atau Username sudah terdaftar.' });
    }
    // Tangani error lainnya
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};