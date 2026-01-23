export function errorMessage(code) { // ApiErrorクラスのcodeを引数にフロント用のメッセージを返す
  switch (code) {
    case 'API_CONTRACT_VIOLATION':
      return '204は受け入れません';
    case 'UNEXPECTED_RESPONSE':
      return 'サーバーから予期せぬレスポンスを受信しました';
    case 'FAILED_TO_GET_DATA':
      return 'データの取得に失敗しました';
    case 'INVALID_TITLE': // 追加時 (サーバー側ではじかれたもの)
      return 'タイトルが不正です';
    case 'INVALID_TODO_DATA': // 更新時
      return 'タスクデータが不正です';
    case 'MISSING_TODO_ID':
      return 'タスクIDがありません';
    case 'TODO_CREATE_FAILED':
      return '新規タスクの作成に失敗しました';
    case 'TODO_REORDER_FAILED':
      return '並び替えに失敗しました';
    case 'TODO_UPDATE_FAILED':
      return 'タスクの更新に失敗しました';
    case 'TODO_DELETE_FAILED':
      return 'タスクの削除に失敗しました';
    case 'NETWORK_ERROR':
      return 'ネットワーク接続に失敗しました';
    case 'UNKNOWN_ERROR':
      return '予期せぬエラーが発生しました';
  }
}