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

const sortMapping = {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  dueDate: 'due_date',
  title: 'title',
  priority: 'priority',
  status: 'status',
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
  const todo = await todoRepository.findById(id, userId);
  if (!todo || todo.isDeleted) {
    const error = new Error('Todo not found');
    error.statusCode = 404;
    throw error;
  }
  return todo;
};

const listTodos = async (query, userId, options = {}) => {
  const sortBy = sortMapping[query.sortBy] || 'created_at';

  return todoRepository.list({
    userId,
    status: query.status,
    search: query.q,
    dueDateFrom: query.dueDateFrom,
    dueDateTo: query.dueDateTo,
    duePreset: options.duePreset || query.duePreset,
    deletedOnly: options.deletedOnly || false,
    sortBy,
    sortDir: query.order,
  });
};

const updateTodo = async (id, payload, user) => {
  await getTodoDetail(id, user.id);
  const data = todoSchema.parse(payload);
  return todoRepository.updateTodo(id, user.id, {
    title: data.title,
    description: data.description,
    dueDate: data.dueDate,
    priority: data.priority,
    updatedBy: user.username,
  });
};

const changeStatus = async (id, payload, user) => {
  await getTodoDetail(id, user.id);
  const data = statusSchema.parse(payload);
  return todoRepository.changeStatus(id, user.id, {
    status: data.status,
    updatedBy: user.username,
  });
};

const deleteTodo = async (id, user) => {
  await getTodoDetail(id, user.id);
  return todoRepository.softDelete(id, user.id, {
    deletedAt: new Date(),
    updatedBy: user.username,
  });
};

const restoreTodo = async (id, user) => {
  const todo = await todoRepository.findById(id, user.id);
  if (!todo || !todo.isDeleted) {
    const error = new Error('Deleted todo not found');
    error.statusCode = 404;
    throw error;
  }
  return todoRepository.restore(id, user.id, {
    updatedBy: user.username,
  });
};

const getDashboardSummary = async (userId) => {
  const [allTasks, todayTasks, overdueTasks, completedTasks, deletedTasks] = await Promise.all([
    todoRepository.countActive(userId),
    todoRepository.countToday(userId),
    todoRepository.countOverdue(userId),
    todoRepository.countCompleted(userId),
    todoRepository.countDeleted(userId),
  ]);

  return { allTasks, todayTasks, overdueTasks, completedTasks, deletedTasks };
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
