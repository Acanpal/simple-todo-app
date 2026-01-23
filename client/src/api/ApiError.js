export class ApiError extends Error {
  constructor({ code, message, status, cause }) {
    super(message); // エラーメッセージ(開発用)

    this.name = 'ApiError'; // エラー名
    this.code = code ?? 'UNKNOWN_ERROR'; // 判別用エラーコード
    this.status = status ?? null; // HTTPステータス
    this.cause = cause ?? null; // 元のエラー
  }
}