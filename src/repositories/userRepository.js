const pool = require('../config/database');

const findByEmail = async (email) => {
  const [rows] = await pool.execute(
    `SELECT id, email, username, password,
            created_at AS createdAt, updated_at AS updatedAt
     FROM users WHERE email = ?`,
    [email]
  );
  return rows[0] || null;
};

const findByUsername = async (username) => {
  const [rows] = await pool.execute(
    `SELECT id, email, username, password,
            created_at AS createdAt, updated_at AS updatedAt
     FROM users WHERE username = ?`,
    [username]
  );
  return rows[0] || null;
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT id, email, username,
            created_at AS createdAt, updated_at AS updatedAt
     FROM users WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
};

const createUser = async (payload) => {
  const [result] = await pool.execute(
    'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
    [payload.email, payload.username, payload.password]
  );
  return findById(result.insertId);
};

module.exports = {
  findByEmail,
  findByUsername,
  findById,
  createUser,
};
