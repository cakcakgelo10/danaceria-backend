import express, { Express, Request, Response } from 'express';
import pool from './config/database';

// Inisialisasi aplikasi Express
const app: Express = express();
const PORT: number = 3001; // Port untuk server backend

// Middleware untuk membaca JSON dari body request
app.use(express.json());

// Endpoint percobaan
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from DanaCeria Backend with TypeScript! 👋');
});

const testDatabaseConnection = async () => {
  try {
    const connection = await pool.getConnection(); // Mencoba mendapatkan koneksi dari pool
    console.log('🎉 Selamat! Koneksi ke database berhasil!');
    connection.release(); // Jangan lupa untuk melepaskan koneksi
  } catch (error) {
    console.error('❌ Gagal terkoneksi ke database:', error);
  }
};
// Jalankan server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  testDatabaseConnection();
});