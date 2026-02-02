require('dotenv').config(); // 環境変数の読み込み
const express = require('express');
const cors = require('cors');
const todoRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/auth'); // 認証ルートの読み込み

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ルーティングの設定
// /api/auth から始まるURLは authRoutes で処理する
app.use('/api/auth', authRoutes);
// /api/todos から始まるURLは todoRoutes で処理する
app.use('/api/todos', todoRoutes);

// サーバーを起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
