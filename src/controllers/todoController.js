const todoService = require('../services/todoServices')
const { successResponse } = require('../utils/apiResponse')

const createTodo = async (req, res, next) => {
    try {
        const todo = await todoService.createTodo(req.body);
        return successResponse(res, 'Todo created', todo, 201);
    } catch(error) {
        next(error);
    }
}

const listTodos = async (req, res, next) => {
    try {
        const todos = await todoService.listTodos(req.query);
        return successResponse(res, 'Todo list', todos);
    } catch (error) {
        next(error)
    }
}

const getDetail = async (req, res, next) => {
    try {
        const todo = await todoService.getTodoDetail(req.params.id);
        return successResponse(res, 'Todo detail', todo);
    } catch (error) {
        next(error)
    }
}

const updateTodo = async (req, res, next) => {
    try {
        const todo = await todoService.updateTodo(req.params.id, req.body);
        return successResponse(res, 'Todo updated', todo);
    } catch (error) {
        next(error)
    }
}

const changeStatus = async (req, res, next) => {
    try {
        const todo = await todoService.changeStatus(req.params.id, req.body);
        return successResponse(res, 'Todo deleted', todo);
    } catch (error) {
        next(error)
    }
}

const deleteTodo = async (req, res, next) => {
    try {
        const todo = await todoService.deleteTodo(req.params.id);
        return successResponse(res, 'Todo deleted', todo);
    } catch (error) {
        next(error)
    }
}

module.exports = { createTodo, listTodos, getDetail, updateTodo, changeStatus, deleteTodo }