const express = require('express');
const cors = require('cors'); // 追加
const app = express();
const PORT = 3000;

app.use(cors()); // CORSを許可
app.use(express.json()); // JSONを受け取れるようにする (必須！)


// モックデータ (サーバーのメモリにあるだけのデータ)
const todos = [
  { id: 1, title: "Reactを勉強する" },
  { id: 2, title: "部屋を掃除する" },
  { id: 3, title: "散歩に行く" }
];

// Todoリストを返す API
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// 新しいTodoを追加する API
app.post('/api/todos', (req, res) => {
  const newTodo = req.body; // 送られてきたデータ { title: "..." }
  // IDを現在時刻(ミリ秒)にする。これで重複しなくなる。
  // 注意: 本当は文字列にするのが安全ですが、今回は簡易的に数値のままでもOK
  newTodo.id = Date.now();
  todos.push(newTodo); // リストに追加
  res.json(todos); // 更新されたリストを返す
  console.log(todos);
});

// Todoの順序を更新する API (並べ替え機能用)
// 注意: "/:id" のルートより先に定義しないと、"reorder" が id として処理されてしまう可能性がある
app.put('/api/todos/reorder', (req, res) => {
  const newTodos = req.body.todos; // 並べ替え後の新しい配列を受け取る

  // 簡易的なバリデーション: 配列でなければエラー
  if (!Array.isArray(newTodos)) {
    return res.status(400).json({ message: "データ形式が正しくありません" });
  }

  // サーバーのデータを丸ごと入れ替える
  // (注意: `todos = newTodos` とすると const で宣言しているためエラーになるか、
  //  参照が変わってしまってうまく動作しない場合があるため、spliceで中身を入れ替える)
  todos.splice(0, todos.length, ...newTodos);

  res.json(todos);
});

// Todoを削除する API
// :id は「パスパラメータ」といって、URLの一部を変数として受け取れる
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id); // URLのid部分は文字列で来るので数値に変換

  // 指定されたID以外のものを残す = 指定されたIDを削除
  // filter は条件に合うものだけを残した新しい配列を作るメソッド
  const index = todos.findIndex((todo) => todo.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
    res.json(todos); // 削除後のリストを返す
    console.log(todos);
  } else {
    // 404 は "Not Found" (見つからない) という意味のステータスコード
    res.status(404).json({ message: "削除しようとしたタスクが見つかりませんでした" });
  }
});

// Todoを更新する API (編集機能用)
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id); // URLのidを数値に変換
  const { title } = req.body; // 送られてきた新しいタイトル

  // IDに一致するTodoを探す
  const todo = todos.find((t) => t.id === id);

  if (todo) {
    todo.title = title; // タイトルを更新 (参照渡しなので元の配列の中身も変わる)
    res.json(todos); // 更新後のリスト全体を返す
    console.log(todos);
  } else {
    res.status(404).json({ message: "更新しようとしたタスクが見つかりませんでした" });
  }
});

// サーバーを起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
