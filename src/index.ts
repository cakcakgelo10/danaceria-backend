import dotenv from 'dotenv';
dotenv.config();

console.log('Nilai JWT_SECRET setelah config di index.ts:', process.env.JWT_SECRET);

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import pool from './config/database';
import authRouter from './api/auth/auth.routes'; 
import userRouter from './api/users/user.routes'; 

// Inisialisasi aplikasi Express
const app: Express = express();
const PORT: number = 3001; // Port untuk server backend

app.use(cors());

// Middleware untuk membaca JSON dari body request
app.use(express.json());

// Endpoint utama
app.get('/', (req: Request, res: Response) => {
  res.send('Selamat Datang di API DanaCeria 👋'); // Pesan bisa diubah
});

// Gunakan authRouter untuk semua request yang diawali '/api/auth'
app.use('/api/auth', authRouter); 
app.use('/api/users', userRouter);

// Fungsi untuk mengetes koneksi database (biarkan seperti ini)
const testDatabaseConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('🎉 Selamat! Koneksi ke database berhasil!');
    connection.release();
  } catch (error) {
    console.error('❌ Gagal terkoneksi ke database:', error);
  }
};

// Jalankan server (biarkan seperti ini)
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  testDatabaseConnection();
});