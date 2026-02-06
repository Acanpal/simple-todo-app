const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validation = require('../middleware/validation');

// POST /api/auth/register (ヴァリデーションチェックをミドルウェアで)
router.post('/register', validation.checkRegister, authController.register);

// GET /api/auth/register (既存ユーザーチェック,デバッグ用)
router.get('/register', authController.checkUser);

// POST /api/auth/login (ヴァリデーションチェックをミドルウェアで)
router.post('/login', validation.checkLogin, authController.login);

module.exports = router;
