export async function deleteExchange(exchangeId) {
  const response = await fetch(
    'http://localhost:3000/api/user/conversation/exchange',
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
