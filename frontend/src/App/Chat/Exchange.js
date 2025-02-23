export async function deleteExchange(exchangeId) {
  const { REACT_APP_API_URL } = process.env;

  const response = await fetch(
    `${REACT_APP_API_URL}/api/user/conversation/exchange`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exchangeId }),
    },
  );

  if (!response.ok) {
    throw response;
  }

  return response;
}
