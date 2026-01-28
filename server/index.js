const express = require('express');
const cors = require('cors');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ルーティングの設定
// /api/todos から始まるURLは todoRoutes で処理する
app.use('/api/todos', todoRoutes);

// サーバーを起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
