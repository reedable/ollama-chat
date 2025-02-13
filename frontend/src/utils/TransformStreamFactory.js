export function createTextStream() {
  const textDecoder = new TextDecoder();

  return new TransformStream({
    transform(chunk, controller) {
      const text = textDecoder.decode(chunk, { stream: true });
      controller.enqueue(text);
    },
  });
}

/**
 * FIXME This needs a lot of work.
 * - chunk might contain a fragment of the boundary
 * - splitting the entire buffer every time is terribly inefficient
 */
export function createMultipartStream(boundary) {
  let _buffer = '';
  const _parts = [];

  return new TransformStream({
    transform(text, controller) {
      _buffer += text;
      const parts = _buffer.split(boundary);

      if (_buffer.includes(`${boundary}--`)) {
        // The end of response was detected. The very last part '--' is part
        // of the boundary. We can remove it.
        parts.length = parts.length - 1;
      }

      // Index 0 is before the first boundary. Ignore.
      for (let i = 1; i < parts.length; i++) {
        if (typeof _parts[i] === 'undefined') {
          // Previously unseen part should be sent in whole
          controller.enqueue([i - 1, parts[i]]);
        } else if (_parts[i] !== parts[i]) {
          // Incremental update
          const split = text.replace(`${boundary}--`, '').split(boundary);
          controller.enqueue([i - 1, split[split.length - 1]]);
        }

        _parts[i] = parts[i];
      }
    },
  });
}

// FIXME record/exchange is not coming through
export function createHeaderParserStream() {
  let _buffer = '';
  let _index = -1;
  let _header = null;

  return new TransformStream({
    transform([index, text], controller) {
      if (_index < index) {
        // Next part in multipart response
        _buffer = text;
        _index = index;
        _header = null;
      }

      if (_header === null && _buffer.includes('\r\n\r\n')) {
        // Previously undetected header found in the buffer
        const split = _buffer.split('\r\n\r\n');
        _header = split[0];

        if (split[1]) {
          controller.enqueue([index, split[1], _header]);
        }

        _buffer = null; // no need to store the header in the buffer
      } else if (_header) {
        controller.enqueue([index, text, _header]);
      } else {
        _buffer += text;
      }
    },
  });
}

export function createPartHandlerStream(contentType, marshaller) {
  let _buffer = '';
  let _index = null;

  return new TransformStream({
    transform([index, text, header], controller) {
      if (_index !== null && _index < index) {
        // We have the full payload for the content we are watching
        try {
          const object = marshaller(_buffer);
          controller.enqueue([_index, object, header]);
        } finally {
          _buffer = '';
          _index = null;
        }
      }

      if (header.includes(contentType)) {
        _buffer += text;
        _index = index;
      } else {
        controller.enqueue([index, text, header]);
      }
    },
  });
}
