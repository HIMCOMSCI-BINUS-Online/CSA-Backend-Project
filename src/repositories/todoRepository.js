const { Op, where } = require('sequelize')
const Todo = require('../models/todoModels');

const createTodo = (payload) =>  Todo.create(payload);

const findTodoById = (id) => Todo.findOne({
    where: ({ id }),
})

const updateTodo = async (todo, payload) => todo.update(payload);

const listTodos = ({ where, order }) => Todo.findAll({ where, order });

const buildListQuery = ({status, q, dueDateFrom, dueDateTo, duePreset}) => {
    const where = {}

    if (status) {
        where.status = status;
    }

    if (q) {
        where.title = { [Op.like]: `%${q}%`};
    }

    if (dueDateFrom || dueDateTo) {
        where.dueDate = {};
        if (dueDateFrom) where.dueDate[Op.gte] = dueDateFrom;
        if (dueDateTo) where.dueDate[Op.lte] = dueDateTo;
    }

    if(duePreset === 'today') {
        const today = new Date().toISOString().slice(0, 10);
        where.dueDate = today;
    }

    if (duePreset === 'overdue') {
        const today = new Date().toISOString().slice(0, 10);
        where.dueDate = { [Op.lt]: today };
        where.status = { [Op.ne]: 'completed'};
    }

    if (duePreset === 'mtd') {
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth(), 1).toDateString().slice(0, 10)
        const end = now.toDateString().slice(0, 10);
        where.dueDate = { [Op.between]: [start, end]}
    }

    return where;
}

module.exports = {createTodo, findTodoById, updateTodo, listTodos, buildListQuery}