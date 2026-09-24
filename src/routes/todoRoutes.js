const express = require('express')
const router = express.Router()
const sucessResponse = require('../../utils/response')
const failedResponse = require('../../utils/response');
const successResponse = require('../../utils/response');
const Todo = require('../models/todoModels');


// 1. get all
router.get('/', async (req, res) => {
    try {
        const { status } = req.query
        const filterCondition = {}
        // let result = todosDB;
        
        if(status) {
            // result = result.filter(item => item.status.toLowerCase() === status.toLowerCase());
            filterCondition.status = status
        }
    
        const todos = await Todo.findAll({
            where: filterCondition,
            order: [['createdAt', 'DESC']]
        })
    
        return res.json(sucessResponse("data retrieved successfully.", todos))
    } catch(error) {
        return res.json(failedResponse('ada issue', error.message))
    }
})

// get by id
router.get('/:id', async (req, res) => {
    try {
        const todo = await Todo.findByPk(req.params.id)

        if(!todo) {
            return res.status(404).json(failedResponse('no data found', null))
        }

        return res.status(200).json(successResponse('data retireved successfully', todo))
    } catch(error) {
        return res.status(500).json(failedResponse('error occured', error.message))
    }
})

// post (create new todo)
router.post('/', async (req, res) => {
    try {
        const { title, description, dueDate, priority, status } = req.body;
    
        if(!title || title.trim() === '') {
            return res.status(400).json(failedResponse('title required', null))
        }
        
        const newTodo = await Todo.create({
            title: title.trim(),
            description,
            dueDate,
            priority: priority || 'medium',
            status: status || 'pending'
        })
    
        return res.status(201).json(sucessResponse('data created successfully', newTodo))
    } catch(error) {
        return res.status(500).json(failedResponse('error occured', error.message))
    }
})

// update
router.put('/:id', async (req, res) => {
    try {
        const todo = await Todo.findByPk(req.params.id)

        if(!todo) {
            return res.status(404).json(failedResponse("id doesn't exists", null))
        }

        const { title, description, dueDate, priority, status } = req.body

        await todo.update({
            title: title !== undefined ? title.trim() : todo.title,
            description: description !== undefined ? description : todo.description,
            dueDate: dueDate !== undefined ? dueDate : todo.dueDate,
            priority: priority !== undefined ? priority : todo.priority,
            status: status !== undefined ? status : todo.status
        })

        return res.status(200).json(successResponse('data updated successfully', todo))
    } catch(error) {
        return res.status(500).json(failedResponse('error occured during data update', error.message))
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const todo = await Todo.findByPk(req.params.id)

        if(!todo) {
            return res.status(404).json(failedResponse('data not found', null))
        }

        await todo.destroy()

        return res.status(200).json(successResponse('data deleted successfully', todo))
    } catch(error) {
        return res.status(500).json(failedResponse('error occured', error.message))
    }
})

router.patch('/:id/status', async (req, res) => {
    try {
        const todo = await Todo.findByPk(req.params.id)

        if(!todo) {
            return res.status(404).json(failedResponse('data not found', null))
        }

        await todo.update({
            status: 'completed'
        })

        return res.status(200).json(successResponse('data updated', todo))
    } catch(error) {
        return res.status(500).json(failedResponse('error occured', null))
    }
})
module.exports = router