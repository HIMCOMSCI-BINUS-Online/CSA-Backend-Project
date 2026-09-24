const express = require('express');
const todoRoutes = require('./routes/todoRoutes')
const dotenv = require('dotenv')
const sequelize = require('./config/database');


dotenv.config()

const app = express()
const PORT = process.env.PORT

// Middleware wajib agar Express bisa membaca JSON dari request body
app.use(express.json());

// Health Check Endpoint
app.get('/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'API Todo berjalan dengan baik!'
  });
});

// daftarkan todoRoutes.js agar terbaca oleh app.js
app.use('/todos', todoRoutes)

app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "route not found"
    })
})

sequelize.sync({
  alter: true
}).then(() => {
  console.log('Database SQLite berhasil tersambung dan tersinkronisasi')
  app.listen(PORT, () => {
      console.log(`Service API jalan di port ${PORT}`)
  })
}).catch((err) => {
  console.error('Gagal terhubung ke SQLite', err.message)
})
