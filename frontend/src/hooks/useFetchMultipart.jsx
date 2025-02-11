import {
  createHeaderParserStream,
  createMultipartStream,
  createPartHandlerStream,
  createTextStream,
} from '../utils/TransformStreamFactory';

export default function useFetchMultipart() {
  async function fetchMultipart(url, request, ...callback) {
    const response = await fetch(url, request);

    if (!response.ok || !response.body) {
      throw response;
    }

    const boundary = getBoundary(response);
    const textStream = createTextStream();
    const multipartStream = createMultipartStream(boundary);
    const headerParserStream = createHeaderParserStream();
    const partHandlerStream = createPartHandlerStream(
      'application/json',
      JSON.parse,
    );

    const reader = response.body
      .pipeThrough(textStream)
      .pipeThrough(multipartStream)
      .pipeThrough(headerParserStream)
      .pipeThrough(partHandlerStream)
      .getReader();

    while (true) {
      const { done, value } = await reader.read();
      const [index, chunk] = value;
      if (done) break;

      if (typeof callback[index] === 'function') {
        callback[index](chunk);
      }
    }
  }

  return [fetchMultipart];
}

/**
 * @returns boundary string, or null if no boundaries are specified
 */
function getBoundary(response) {
  const contentType = response.headers.get('Content-Type');
  const boundaryMatch = contentType.match(/boundary=(.+)/);

  if (!boundaryMatch) {
    return null;
  }

  return `--${boundaryMatch[1]}`; // Prefix with "--"
}
