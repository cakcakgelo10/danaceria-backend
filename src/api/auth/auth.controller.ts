import { Request, Response } from 'express';
import pool from '../../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // <-- Pastikan import ini ada

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
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email atau Username sudah terdaftar.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// vvvvvvv  TAMBAHKAN KODE BARU DI BAWAH INI vvvvvvv

export const loginUser = async (req: Request, res: Response) => {
  try {
    // 1. Ambil data dari body
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi' });
    }

    // 2. Cari user di database berdasarkan email
    const [rows]: any[] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Email tidak ditemukan' });
    }
    const user = rows[0];

    // 3. Bandingkan password yang dikirim dengan hash di database
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Password salah' });
    }

    // 4. Buat JSON Web Token (JWT)
    const token = jwt.sign(
      { userId: user.id, email: user.email }, // Data yang ingin disimpan di token
      process.env.JWT_SECRET as string,       // Kunci rahasia dari .env
      { expiresIn: '1h' }                     // Token akan kadaluarsa dalam 1 jam
    );

    // 5. Kirim token sebagai respon
    res.status(200).json({ message: 'Login berhasil!', token: token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};