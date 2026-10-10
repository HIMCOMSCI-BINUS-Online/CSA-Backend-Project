const { z } = require('zod')
const todoRepository = require('../repositories/todoRepository')

const todoSchema = z.object({
    title: z.string().min(1).max(150),
    description: z.string().max(1000).default(''),
    dueDate: z.string().date(),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
    status: z.enum(['pending', 'in_progress', 'completed']).default('pending'),
})

const statusSchema = z.object({
    status: z.enum(['pending', 'in_progress', 'completed']),
})

const allowedSortFields = ['title', 'dueDate', 'priority', 'status', 'createdAt', 'updatedAt'];

const buildOrder = (sortBy = 'createdAt', order = 'DESC') => {
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const safeOrder = String(order).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    return [[safeSortBy, safeOrder]]
}

const createTodo = async (payload) => {
    const data = todoSchema.parse(payload)
    return todoRepository.createTodo({...data})
}

const getTodoDetail = async (id) => {
    const todo = await todoRepository.findTodoById(id)
    if (!todo) {
        const error = new Error('Todo not found');
        error.statusCode = 404;
        throw error;
    }
    return todo
}

const listTodos = async (query, option = {}) => {
    const where = todoRepository.buildListQuery({
        status: query.status,
        q: query.q,
        dueDateFrom: query.dueDateFrom,
        dueDateTo: query.dueDateTo,
        duePreset: option.duePreset || query.duePreset
    })

    return todoRepository.listTodos({
        where,
        order: buildOrder(query.SortBy, query.Order)
    })
}

const updateTodo = async (id, payload) => {
    const todo = await getTodoDetail(id);
    const data = todoSchema.parse(payload);

    return todoRepository.updateTodo(todo, {
        ...data,
    })
}

const changeStatus = async (id, payload) => {
    const todo = await getTodoDetail(id)
    const data = todoSchema.parse(payload)

    return todoRepository.updateTodo(todo, {
        status: data.status
    })
}

const deleteTodo = async (id) => {
    const todo = await getTodoDetail(id);

    return todoRepository.updateTodo(todo, {
        isDeleted: true,
        deletedAt: new Date(),
    })
}

module.exports = {createTodo, getTodoDetail, listTodos, updateTodo, changeStatus, deleteTodo}