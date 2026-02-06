require('dotenv').config();
const express = require('express');
const cors = require('cors');
const todoRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// /api/auth から始まるURLは authRoutes で処理する
app.use('/api/auth', authRoutes);
// /api/todos から始まるURLは authMiddleware でチェックしてから todoRoutes で処理する
app.use('/api/todos', authMiddleware, todoRoutes);

// サーバーを起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
