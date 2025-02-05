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
      let think = '';
      let answer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });

          buffer += chunk;

          const startThink = buffer.indexOf('<think>');
          const endThink = buffer.indexOf('</think>');
          const split = chunk.replace('<think>').split('</think>');

          if (startThink !== -1 && endThink == -1) {
            think = split[0];
          }

          if (endThink !== -1) {
            answer = split[1] || split[0];
          }

          callback({ think, answer });
        }

        resolve(buffer);
      } catch (e) {
        reject(e);
      }
    });
  }

  return [fetchStream];
}
