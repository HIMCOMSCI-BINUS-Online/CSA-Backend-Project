const express = require('express');
const todoController = require('../controllers/todoController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/dashboard/summary', todoController.dashboardSummary);
router.get('/deleted', todoController.deletedTodos);
router.get('/today', todoController.todayTodos);
router.get('/overdue', todoController.overdueTodos);
router.get('/completed', todoController.completedTodos);
router.get('/', todoController.listTodos);
router.get('/:id', todoController.getDetail);
router.post('/', todoController.createTodo);
router.put('/:id', todoController.updateTodo);
router.patch('/:id/status', todoController.changeStatus);
router.patch('/:id/restore', todoController.restoreTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
