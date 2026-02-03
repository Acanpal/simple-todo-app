const e = require('express');
const { check } = require('express-validator');

// 新規登録時のバリデーション
exports.checkRegister = [
  check('email').isEmail().withMessage('メールアドレスが正しくありません'),
  check('password').isLength({ min: 6 }).withMessage('パスワードは6文字以上でなければなりません'),
];

exports.checkLogin = [
  check('email').isEmail().withMessage('メールアドレスが正しくありません'),
  check('password').isLength({ min: 6 }).withMessage('パスワードは6文字以上でなければなりません'),
];