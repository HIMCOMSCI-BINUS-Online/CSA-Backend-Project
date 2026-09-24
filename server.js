// 1. Impor pustaka Express
const express = require('express');

// 2. Inisialisasi aplikasi Express
const app = express();
const PORT = 3000;

// 3. Daftarkan rute GET pertama
// req = request
// res = response
app.get('/', (req, res) => {
  res.send('Halo! Server Express pertama saya berhasil berjalan 🚀');
});

// 4. Rute contoh API mengembalikan data JSON
app.get('/api/v1/ping', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Pong! Server aktif dan siap digunakan.',
    timestamp: new Date().toISOString()
  });
});

// 5. Jalankan server dan dengarkan koneksi pada port 3000
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  console.log(`=========================================`);
});