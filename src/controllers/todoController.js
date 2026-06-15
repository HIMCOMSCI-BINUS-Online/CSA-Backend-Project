const todoService = require('../services/todoService');
const { successResponse } = require('../utils/apiResponse');

const createTodo = async (req, res, next) => {
  try {
    const todo = await todoService.createTodo(req.body, req.user);
    return successResponse(res, 'Todo created', todo, 201);
  } catch (error) {
    next(error);
  }
};

const listTodos = async (req, res, next) => {
  try {
    const todos = await todoService.listTodos(req.query, req.user.id);
    return successResponse(res, 'Todo list', todos);
  } catch (error) {
    next(error);
  }
};

const getDetail = async (req, res, next) => {
  try {
    const todo = await todoService.getTodoDetail(req.params.id, req.user.id);
    return successResponse(res, 'Todo detail', todo);
  } catch (error) {
    next(error);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    const todo = await todoService.updateTodo(req.params.id, req.body, req.user);
    return successResponse(res, 'Todo updated', todo);
  } catch (error) {
    next(error);
  }
};

const changeStatus = async (req, res, next) => {
  try {
    const todo = await todoService.changeStatus(req.params.id, req.body, req.user);
    return successResponse(res, 'Todo status updated', todo);
  } catch (error) {
    next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const todo = await todoService.deleteTodo(req.params.id, req.user);
    return successResponse(res, 'Todo deleted', todo);
  } catch (error) {
    next(error);
  }
};

const restoreTodo = async (req, res, next) => {
  try {
    const todo = await todoService.restoreTodo(req.params.id, req.user);
    return successResponse(res, 'Todo restored', todo);
  } catch (error) {
    next(error);
  }
};

const deletedTodos = async (req, res, next) => {
  try {
    const todos = await todoService.listTodos(req.query, req.user.id, { deletedOnly: true });
    return successResponse(res, 'Deleted todo list', todos);
  } catch (error) {
    next(error);
  }
};

const todayTodos = async (req, res, next) => {
  try {
    const todos = await todoService.listTodos(req.query, req.user.id, { duePreset: 'today' });
    return successResponse(res, 'Today todo list', todos);
  } catch (error) {
    next(error);
  }
};

const overdueTodos = async (req, res, next) => {
  try {
    const todos = await todoService.listTodos(req.query, req.user.id, { duePreset: 'overdue' });
    return successResponse(res, 'Overdue todo list', todos);
  } catch (error) {
    next(error);
  }
};

const completedTodos = async (req, res, next) => {
  try {
    const todos = await todoService.listTodos({ ...req.query, status: 'completed' }, req.user.id);
    return successResponse(res, 'Completed todo list', todos);
  } catch (error) {
    next(error);
  }
};

const dashboardSummary = async (req, res, next) => {
  try {
    const summary = await todoService.getDashboardSummary(req.user.id);
    return successResponse(res, 'Dashboard summary', summary);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTodo,
  listTodos,
  getDetail,
  updateTodo,
  changeStatus,
  deleteTodo,
  restoreTodo,
  deletedTodos,
  todayTodos,
  overdueTodos,
  completedTodos,
  dashboardSummary,
};
