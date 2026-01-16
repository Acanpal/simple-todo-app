
export async function apiFetch(url, options = {}) {
  const { headers = {}, ...rest } = options;

  try {
    const res = await fetch(url, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });

    let result = null;
    try {
      result = await res.json();
    } catch (err) {
      // JSONでないレスポンスの場合はnullのまま
    }

    if (!res.ok) {
      throw new Error(result?.code || 'UNEXPECTED_RESPONSE');
    }

    return result;

  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error('NETWORK_ERROR');
    }
    throw err;
  }
}
