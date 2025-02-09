export default function useFetchStream() {
  async function fetchStream(url, request, callback) {
    const response = await fetch(url, request);

    if (!response.ok || !response.body) {
      throw response;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    return new Promise(async (resolve, reject) => {
      let buffer = '';
      let reasoning = '';
      let answer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });

          buffer += chunk;

          const startReasoning = buffer.indexOf('<think>');
          const endReasoning = buffer.indexOf('</think>');
          const split = chunk.replace('<think>').split('</think>');

          if (startReasoning !== -1 && endReasoning == -1) {
            reasoning = split[0];
          } else {
            answer = split[1] || split[0];
          }

          callback(reasoning, answer);
        }

        resolve(buffer);
      } catch (e) {
        reject(e);
      }
    });
  }

  return [fetchStream];
}
