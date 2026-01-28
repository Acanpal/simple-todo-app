const { PrismaClient } = require('@prisma/client');

// PrismaClientのインスタンスを作成 (DB接続の管理者)
const prisma = new PrismaClient();

module.exports = prisma;
