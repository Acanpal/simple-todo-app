import { ApiError } from "./ApiError";

export async function apiFetch(url, options = {}) { // optionsはオプション引数(なにもなかったらからの配列返却)
  const { headers = {}, ...rest } = options;

  let res = null;
  try { // そもそもネットワーク接続できていない
    res = await fetch(url, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
  } catch (err) {
    throw new ApiError({
      code: 'NETWORK_ERROR',
      message: 'ネットワーク接続に失敗しました',
      status: null,
      cause: err,
    });
  }

  if (res.status === 204) { // 204はNo Content
    throw new ApiError({
      code: 'API_CONTRACT_VIOLATION',
      message: '204は受け入れません',
      status: 204,
      cause: null,
    });
  }

  let result = null;
  try { // なぜかjson以外が返ってきたら
    result = await res.json();
  } catch (err) {
    throw new ApiError({
      code: 'UNEXPECTED_RESPONSE',
      message: '予期せぬレスポンスを受信しました',
      status: res.status ?? null,
      cause: err,
    });
  }

  if (!res.ok) { //httpステータスコードが200番台でない
    throw new ApiError({
      code: result.code ?? 'UNKNOWN_ERROR',
      message: result.message ?? '予期せぬエラーが発生しました',
      status: res.status ?? null,
      cause: null,
    });
  }

  return result;
}
