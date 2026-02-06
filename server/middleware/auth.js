const jwt = require('jsonwebtoken');

// .envが使える場合は process.env.JWT_SECRET を使用
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  // 1. ヘッダーからトークンを取得 (Authorization: Bearer <token>)
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: '認証トークンがありません' });
  }

  // "Bearer " の後ろのトークン部分を取り出す
  const token = authHeader.split(' ')[1];

  if (!token) { // そもそも形式
    return res.status(401).json({ message: '認証トークンの形式が正しくありません' });
  }

  try {
    // 2. トークンを検証
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3. 解読できたデータ(userId)をreqオブジェクトにくっつける
    req.user = decoded; // { userId: 1, iat: ..., exp: ... }

    // 4. 次の処理へ進む
    next();
  } catch (error) { // トークンが改ざんされている、期限切れなど
    return res.status(401).json({ message: '無効なトークンです' });
  }
};
