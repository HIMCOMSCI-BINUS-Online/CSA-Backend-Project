const pool = require('../config/database');
const { today, monthStart } = require('../utils/date');

const SELECT_TODO = `
  id, title, description, due_date AS dueDate,
  priority, status,
  is_deleted AS isDeleted, deleted_at AS deletedAt,
  created_by AS createdBy, updated_by AS updatedBy,
  user_id AS userId, created_at AS createdAt, updated_at AS updatedAt
`;

const createTodo = async ({ title, description, dueDate, priority, status, userId, createdBy, updatedBy }) => {
  const [result] = await pool.execute(
    `INSERT INTO todos (title, description, due_date, priority, status, user_id, created_by, updated_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, description, dueDate, priority, status, userId, createdBy, updatedBy]
  );
  const [rows] = await pool.execute(`SELECT ${SELECT_TODO} FROM todos WHERE id = ?`, [result.insertId]);
  return rows[0];
};

const findById = async (id, userId) => {
  const [rows] = await pool.execute(
    `SELECT ${SELECT_TODO} FROM todos WHERE id = ? AND user_id = ?`,
    [id, userId]
  );
  return rows[0] || null;
};

const updateTodo = async (id, userId, { title, description, dueDate, priority, updatedBy }) => {
  await pool.execute(
    `UPDATE todos SET title = ?, description = ?, due_date = ?, priority = ?, updated_by = ?
     WHERE id = ? AND user_id = ?`,
    [title, description, dueDate, priority, updatedBy, id, userId]
  );
  const [rows] = await pool.execute(`SELECT ${SELECT_TODO} FROM todos WHERE id = ?`, [id]);
  return rows[0];
};

const changeStatus = async (id, userId, { status, updatedBy }) => {
  await pool.execute(
    `UPDATE todos SET status = ?, updated_by = ? WHERE id = ? AND user_id = ?`,
    [status, updatedBy, id, userId]
  );
  const [rows] = await pool.execute(`SELECT ${SELECT_TODO} FROM todos WHERE id = ?`, [id]);
  return rows[0];
};

const softDelete = async (id, userId, { deletedAt, updatedBy }) => {
  await pool.execute(
    `UPDATE todos SET is_deleted = 1, deleted_at = ?, updated_by = ? WHERE id = ? AND user_id = ?`,
    [deletedAt, updatedBy, id, userId]
  );
  const [rows] = await pool.execute(`SELECT ${SELECT_TODO} FROM todos WHERE id = ?`, [id]);
  return rows[0];
};

const restore = async (id, userId, { updatedBy }) => {
  await pool.execute(
    `UPDATE todos SET is_deleted = 0, deleted_at = NULL, updated_by = ? WHERE id = ? AND user_id = ?`,
    [updatedBy, id, userId]
  );
  const [rows] = await pool.execute(`SELECT ${SELECT_TODO} FROM todos WHERE id = ?`, [id]);
  return rows[0];
};

const list = async ({
  userId, status, search, dueDateFrom, dueDateTo,
  duePreset, deletedOnly = false, sortBy = 'created_at', sortDir = 'DESC',
}) => {
  let sql = `SELECT ${SELECT_TODO} FROM todos WHERE user_id = ?`;
  const params = [userId];

  sql += deletedOnly ? ' AND is_deleted = 1' : ' AND is_deleted = 0';

  if (!deletedOnly && status) {
    sql += ' AND status = ?';
    params.push(status);
  }

  if (search) {
    sql += ' AND title LIKE ?';
    params.push(`%${search}%`);
  }

  if (duePreset === 'today') {
    sql += ' AND due_date = ?';
    params.push(today());
  } else if (duePreset === 'overdue') {
    sql += ' AND due_date < ? AND status != ?';
    params.push(today(), 'completed');
  } else if (duePreset === 'mtd') {
    sql += ' AND due_date BETWEEN ? AND ?';
    params.push(monthStart(), today());
  } else {
    if (dueDateFrom) {
      sql += ' AND due_date >= ?';
      params.push(dueDateFrom);
    }
    if (dueDateTo) {
      sql += ' AND due_date <= ?';
      params.push(dueDateTo);
    }
  }

  const allowedSort = ['title', 'due_date', 'priority', 'status', 'created_at', 'updated_at'];
  const sort = allowedSort.includes(sortBy) ? sortBy : 'created_at';
  const dir = sortDir.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  sql += ` ORDER BY ${sort} ${dir}`;

  const [rows] = await pool.execute(sql, params);
  return rows;
};

const countActive = async (userId) => {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) AS count FROM todos WHERE user_id = ? AND is_deleted = 0',
    [userId]
  );
  return rows[0].count;
};

const countToday = async (userId) => {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) AS count FROM todos WHERE user_id = ? AND is_deleted = 0 AND due_date = ?',
    [userId, today()]
  );
  return rows[0].count;
};

const countOverdue = async (userId) => {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) AS count FROM todos WHERE user_id = ? AND is_deleted = 0 AND due_date < ? AND status != ?',
    [userId, today(), 'completed']
  );
  return rows[0].count;
};

const countCompleted = async (userId) => {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) AS count FROM todos WHERE user_id = ? AND is_deleted = 0 AND status = ?',
    [userId, 'completed']
  );
  return rows[0].count;
};

const countDeleted = async (userId) => {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) AS count FROM todos WHERE user_id = ? AND is_deleted = 1',
    [userId]
  );
  return rows[0].count;
};

module.exports = {
  createTodo,
  findById,
  updateTodo,
  changeStatus,
  softDelete,
  restore,
  list,
  countActive,
  countToday,
  countOverdue,
  countCompleted,
  countDeleted,
};
