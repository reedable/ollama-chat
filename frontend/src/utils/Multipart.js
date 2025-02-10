export async function parseMultipart(boundary, reader, callback) {
  let buffer = '';
  const parts = [];

  while (true) {
    const { done, value: chunk } = await reader.read();
    if (done) break;

    buffer += chunk;
    const split = buffer.split(boundary);

    for (let i = 0; i < split.length; i++) {
      if (typeof parts[i] === 'undefined') {
        callback(i, split[i]);
      } else if (parts[i] !== split[i]) {
        callback(i, chunk);
      }

      parts[i] = split[i];
    }
  }

  return parts;
}
