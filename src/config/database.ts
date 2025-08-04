import mysql from 'mysql2/promise';

// Membuat connection pool untuk efisiensi koneksi
const pool = mysql.createPool({
  host: 'localhost',            // Alamat server database Anda
  user: 'root',                 // Nama pengguna database (default biasanya 'root')
  password: '',    // Ganti dengan password database Anda
  database: 'dana_ceria',     // Nama database yang akan kita gunakan
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Pesan konfirmasi jika pool berhasil dibuat (opsional)
pool.getConnection()
    .then(connection => {
        console.log('Pool koneksi database berhasil dibuat.');
        connection.release(); // Melepas koneksi kembali ke pool
    })
    .catch(err => {
        console.error('Gagal membuat pool koneksi database:', err);
    });

export default pool;