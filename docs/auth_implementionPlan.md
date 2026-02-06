# 認証機能の実装(no AI)
## バックエンド
- 新規登録(controller/authController.js) 
  ### PUT api/auth/register
  - バリデーションチェック(middleware/validation.js)
    - express-validatorの導入
  - 既存ユーザーチェック
  - パスワードハッシュ化
  - ユーザー登録
  - そのままログイン状態を維持(トークンを送る)
- ログイン
  ### PUT api/auth/login
  - バリデーションチェック
  - ユーザー検索
  - パスワード検証
  - トークン発行
- 認証チェック
  ### GET api/todos/
  - トークン検証(middleware/auth.js)
  
## フロントエンド
- ログイン
  ### PUT /login
  - emailとpasswordを入力
  - トークンが返ってきたら(エラー処理いる？)
  - トークンを保存(localStorage)
  - ログインページから未完了タスクページへ遷移()
- データ表示
  ### GET /uncompleted
  - トークン検証
    - トークンが有効ならトークンに含まれるuserIdでTodoを取得 (middleware/auth.js)
    - トークンが無効ならログインページへ遷移
  ### GET /completed
  - トークン検証
    - トークンが有効ならトークンに含まれるuserIdでTodoを取得 (middleware/auth.js)
    - トークンが無効ならログインページへ遷移
- ログアウト
  - トークン削除
  - ログインページへ遷移


/login → <LoginPage> → / → <ProtectedRoute> → <Layout> → /uncompleted → <UncompletedPage> の流れ