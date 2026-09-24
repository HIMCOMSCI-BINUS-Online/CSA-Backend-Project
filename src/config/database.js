const { Sequelize } = require('sequelize');
require('dotenv').config();

// Inisialisasi Sequelize dengan dialect SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_STORAGE || './db/database.sqlite',
  logging: false // Ubah ke console.log jika ingin melihat query SQL yang dijalankan di background
});

module.exports = sequelize;