const { Op } = require('sequelize');
const { Todo } = require('../models');

const createTodo = (payload) => Todo.create(payload);

const findTodoById = (id, userId) => Todo.findOne({
  where: { id, userId },
});

const updateTodo = async (todo, payload) => todo.update(payload);

const listTodos = ({ where, order }) => Todo.findAll({ where, order });

const countTodos = (where) => Todo.count({ where });

const buildListQuery = ({ userId, status, q, dueDateFrom, dueDateTo, duePreset, deletedOnly = false }) => {
  const where = {
    userId,
    isDeleted: deletedOnly,
  };

  if (!deletedOnly && status) {
    where.status = status;
  }

  if (q) {
    where.title = { [Op.like]: `%${q}%` };
  }

  if (dueDateFrom || dueDateTo) {
    where.dueDate = {};
    if (dueDateFrom) where.dueDate[Op.gte] = dueDateFrom;
    if (dueDateTo) where.dueDate[Op.lte] = dueDateTo;
  }

  if (duePreset === 'today') {
    const today = new Date().toISOString().slice(0, 10);
    where.dueDate = today;
  }

  if (duePreset === 'overdue') {
    const today = new Date().toISOString().slice(0, 10);
    where.dueDate = { [Op.lt]: today };
    where.status = { [Op.ne]: 'completed' };
  }

  if (duePreset === 'mtd') {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
    const end = now.toISOString().slice(0, 10);
    where.dueDate = { [Op.between]: [start, end] };
  }

  return where;
};

module.exports = {
  createTodo,
  findTodoById,
  updateTodo,
  listTodos,
  countTodos,
  buildListQuery,
};
