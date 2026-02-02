const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// JWTの秘密鍵 (本来は .env に書くべきですが、学習用としてここに記載するか、.env利用を推奨)
// .envが使える場合は process.env.JWT_SECRET を使用
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_for_dev';

// 新規登録
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // バリデーション: 入力が空でないか
    if (!email || !password) {
      return res.status(400).json({ error: 'メールアドレスとパスワードは必須です' });
    }

    // 既存ユーザーチェック
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(409).json({ error: 'このメールアドレスは既に登録されています' });
    }

    // パスワードのハッシュ化 (セキュリティ対策)
    const hashedPassword = await bcrypt.hash(password, 10);

    // ユーザー作成
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: 'ユーザー登録が完了しました', userId: user.id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      code: 'REGISTRATION_ERROR',
      error: 'ユーザー登録中にエラーが発生しました',
      details: error.message
    });
  }
};

// ログイン
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ユーザー検索
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({ error: 'メールアドレスまたはパスワードが間違っています' });
    }

    // パスワード検証 (ハッシュ同士を比較)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'メールアドレスまたはパスワードが間違っています' });
    }

    // トークン (JWT) の発行
    // 誰か？(userId) と、いつまで有効か？(expiresIn) を含める
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '1h', // 1時間で期限切れ
    });

    res.json({ message: 'ログイン成功', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      code: 'LOGIN_ERROR',
      error: 'ログイン中にエラーが発生しました',
      details: error.message
    });
  }
};
