const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client'); // PrismaClientを読み込み

const app = express();
const prisma = new PrismaClient(); // Prismaクライアントを初期化 (これでDBと繋がる！)
const PORT = 3000;

app.use(cors());
app.use(express.json());



// Todoリストを返す API
// DBから全てのTodoを取得して返します
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: {
        order: 'asc', // orderの順(昇順)で取得
      },
    });
    res.json(todos);
  } catch (error) {
    console.error("取得に失敗しました", error);
    res.status(500).json({ error: "データの取得に失敗しました" });
  }
});

// 新しいTodoを追加する API
app.post('/api/todos', async (req, res) => {
  const { title } = req.body;

  // バリデーションチェック
  if (!title || typeof title !== 'string' || !title.trim()) {
    console.error("INVALID_TITLE"); // サーバー側表示用(エラーオブジェクト無し)
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
        order: count, // 0, 1, 2... と続くようになる
      },
    });

    const todos = await prisma.todo.findMany({
      orderBy: { order: 'asc' },
    });
    res.json(todos);
    console.log("DBに保存成功、新規タスクを返しました");

  } catch (error) {
    console.error("TODO_CREATE_FAILED", error); // サーバー側表示用
    res.status(500).json({ // クライアント側に返却用
      code: "TODO_CREATE_FAILED",
      message: "タスクの保存に失敗しました"
    });
  }
});

// Todoの順序を更新する API (並べ替え機能用)
app.put('/api/todos/reorder', async (req, res) => {
  const newTodos = req.body.todos;

  if (!Array.isArray(newTodos)) {
    return res.status(400).json({ message: "データ形式が正しくありません" });
  }

  try {
    // トランザクションで一括更新
    // mapで「更新命令のリスト」を作り、$transactionで一度に実行します
    const updatePromises = newTodos.map((todo, index) => {
      return prisma.todo.update({
        where: { id: todo.id },
        data: { order: index }, // 配列の順番(0, 1, 2...)をそのまま保存
      });
    });

    await prisma.$transaction(updatePromises);

    res.json(newTodos);
    console.log("並び順を保存しました");
  } catch (error) {
    console.error("並び順の保存に失敗しました", error);
    res.status(500).json({ error: "並び順の保存に失敗しました" });
  }
});

// Todoを削除する API
app.delete('/api/todos/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    // 削除実行
    await prisma.todo.delete({
      where: { id: id },
    });

    // 削除後の最新リストを取得して返す
    const todos = await prisma.todo.findMany({
      orderBy: { order: 'asc' },
    });
    res.json(todos);
    console.log(`ID: ${id} を削除しました`);

  } catch (error) {
    console.error("削除に失敗しました", error); // IDが存在しない場合など
    res.status(500).json({ error: "削除に失敗しました" });
  }
});

// Todoを更新する API (編集機能用)
app.put('/api/todos/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { title } = req.body;

  try {
    await prisma.todo.update({
      where: { id: id },
      data: { title: title },
    });

    // 最新のリストを返す
    const todos = await prisma.todo.findMany({
      orderBy: { order: 'asc' },
    });
    res.json(todos);
  } catch (error) {
    console.error("更新に失敗しました", error);
    res.status(500).json({ error: "更新に失敗しました" });
  }
});

// サーバーを起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
