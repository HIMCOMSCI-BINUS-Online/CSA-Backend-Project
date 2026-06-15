const { z } = require('zod');
const todoRepository = require('../repositories/todoRepository');

const todoSchema = z.object({
  title: z.string().min(1).max(150),
  description: z.string().max(1000).default(''),
  dueDate: z.string().date(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  status: z.enum(['pending', 'in_progress', 'completed']).default('pending'),
});

const statusSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed']),
});

const allowedSortFields = ['title', 'dueDate', 'priority', 'status', 'createdAt', 'updatedAt'];

const buildOrder = (sortBy = 'createdAt', order = 'DESC') => {
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const safeOrder = String(order).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  return [[safeSortBy, safeOrder]];
};

const createTodo = async (payload, user) => {
  const data = todoSchema.parse(payload);
  return todoRepository.createTodo({
    ...data,
    userId: user.id,
    createdBy: user.username,
    updatedBy: user.username,
  });
};

const getTodoDetail = async (id, userId) => {
  const todo = await todoRepository.findTodoById(id, userId);
  if (!todo || todo.isDeleted) {
    const error = new Error('Todo not found');
    error.statusCode = 404;
    throw error;
  }
  return todo;
};

const listTodos = async (query, userId, options = {}) => {
  const where = todoRepository.buildListQuery({
    userId,
    status: query.status,
    q: query.q,
    dueDateFrom: query.dueDateFrom,
    dueDateTo: query.dueDateTo,
    duePreset: options.duePreset || query.duePreset,
    deletedOnly: options.deletedOnly || false,
  });

  return todoRepository.listTodos({
    where,
    order: buildOrder(query.sortBy, query.order),
  });
};

const updateTodo = async (id, payload, user) => {
  const todo = await getTodoDetail(id, user.id);
  const data = todoSchema.parse(payload);

  return todoRepository.updateTodo(todo, {
    ...data,
    updatedBy: user.username,
  });
};

const changeStatus = async (id, payload, user) => {
  const todo = await getTodoDetail(id, user.id);
  const data = statusSchema.parse(payload);

  return todoRepository.updateTodo(todo, {
    status: data.status,
    updatedBy: user.username,
  });
};

const deleteTodo = async (id, user) => {
  const todo = await getTodoDetail(id, user.id);
  return todoRepository.updateTodo(todo, {
    isDeleted: true,
    deletedAt: new Date(),
    updatedBy: user.username,
  });
};

const restoreTodo = async (id, user) => {
  const todo = await todoRepository.findTodoById(id, user.id);
  if (!todo || !todo.isDeleted) {
    const error = new Error('Deleted todo not found');
    error.statusCode = 404;
    throw error;
  }

  return todoRepository.updateTodo(todo, {
    isDeleted: false,
    deletedAt: null,
    updatedBy: user.username,
  });
};

const getDashboardSummary = async (userId) => {
  const today = new Date().toISOString().slice(0, 10);

  const [allTasks, todayTasks, overdueTasks, completedTasks, deletedTasks] = await Promise.all([
    todoRepository.countTodos({ userId, isDeleted: false }),
    todoRepository.countTodos({ userId, isDeleted: false, dueDate: today }),
    todoRepository.countTodos({ userId, isDeleted: false, dueDate: { [require('sequelize').Op.lt]: today }, status: { [require('sequelize').Op.ne]: 'completed' } }),
    todoRepository.countTodos({ userId, isDeleted: false, status: 'completed' }),
    todoRepository.countTodos({ userId, isDeleted: true }),
  ]);

  return {
    allTasks,
    todayTasks,
    overdueTasks,
    completedTasks,
    deletedTasks,
  };
};

module.exports = {
  createTodo,
  getTodoDetail,
  listTodos,
  updateTodo,
  changeStatus,
  deleteTodo,
  restoreTodo,
  getDashboardSummary,
};
