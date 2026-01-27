const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

// GET /api/todos/
router.get('/', todoController.getTodos);

// POST /api/todos/
router.post('/', todoController.createTodo);

// PUT /api/todos/reorder (順序変更)
// 重要: :id を受け取るルートより先に定義する必要があります
// なぜなら、/reorder も /:id も /api/todos/ で始まるため、
// :id が優先されてしまうと、/reorder が :id として解釈されてしまうから。
router.put('/reorder', todoController.reorderTodos);

// PUT /api/todos/:id (更新)
router.put('/:id', todoController.updateTodo);

// DELETE /api/todos/:id (削除)
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
