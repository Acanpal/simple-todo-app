const prisma = require('../config/db');

// Todoリストを取得する
// GET /api/todos
exports.getTodos = async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: {
        order: 'asc',
      },
    });
    res.json(todos);
  } catch (error) {
    console.error("DBからデータの取得に失敗しました", error);
    res.status(500).json({
      code: "FAILED_TO_GET_DATA",
      message: "DBからデータの取得に失敗しました"
    });
  }
};

// 新しいTodoを追加する
// POST /api/todos
exports.createTodo = async (req, res) => {
  const { title } = req.body;

  // バリデーションチェック
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({
      code: "INVALID_TITLE",
      message: "タイトルが不正です"
    });
  }

  try {
    const count = await prisma.todo.count();
    await prisma.todo.create({
      data: {
        title: title,
        order: count,
      },
    });

    // 最新のリストを返す
    const todos = await prisma.todo.findMany({
      orderBy: { order: 'asc' },
    });
    res.json(todos);
    console.log("DBに保存成功、新規タスクを返しました");

  } catch (error) {
    console.error("TODO_CREATE_FAILED", error);
    res.status(500).json({
      code: "TODO_CREATE_FAILED",
      message: "新規タスクの保存に失敗しました"
    });
  }
};

// Todoの順序を更新する
// PUT /api/todos/reorder
exports.reorderTodos = async (req, res) => {
  const newTodos = req.body.todos;

  if (!Array.isArray(newTodos)) {
    return res.status(400).json({
      code: "INVALID_DATA",
      message: "データ形式が正しくありません",
    });
  }

  try {
    const updatePromises = newTodos.map((todo, index) => {
      if (!todo.id) {
        throw new Error("MISSING_TODO_ID");
      }
      return prisma.todo.update({
        where: { id: todo.id },
        data: { order: index },
      });
    });
    await prisma.$transaction(updatePromises);

    res.json(newTodos);

  } catch (error) {
    console.error("並び順の保存に失敗しました", error);

    if (error.message === "MISSING_TODO_ID") {
      return res.status(400).json({
        code: "MISSING_TODO_ID",
        message: "TODOデータが不正です"
      });
    }
    res.status(500).json({
      code: "TODO_REORDER_FAILED",
      message: "並び順の保存に失敗しました"
    });
  }
};

// Todoを更新する (完了状態やタイトルの変更)
// PUT /api/todos/:id
exports.updateTodo = async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, completed } = req.body;

  const data = {};
  if (title !== undefined) data.title = title;
  if (completed !== undefined) data.completed = completed;

  try {
    await prisma.todo.update({
      where: { id: id },
      data: data,
    });

    const todos = await prisma.todo.findMany({
      orderBy: { order: 'asc' },
    });
    res.json(todos);
  } catch (error) {
    console.error("更新に失敗しました", error);
    res.status(500).json({
      code: "TODO_UPDATE_FAILED",
      message: "タスクの更新に失敗しました"
    });
  }
};

// Todoを削除する
// DELETE /api/todos/:id
exports.deleteTodo = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.todo.delete({
      where: { id: id },
    });

    const todos = await prisma.todo.findMany({
      orderBy: { order: 'asc' },
    });
    res.json(todos);
    console.log(`ID: ${id} を削除しました`);

  } catch (error) {
    console.error("削除に失敗しました", error);
    res.status(500).json({
      code: "TODO_DELETE_FAILED",
      message: "タスクの削除に失敗しました"
    });
  }
};
