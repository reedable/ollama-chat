export async function parse(stream, onContent, onReasoning) {
  let startReasoning = false;
  let endReasoning = false;

  for await (const chunk of stream) {
    let { content } = chunk.message;

    if (!startReasoning) {
      if (content.includes('<think>')) {
        startReasoning = true;
        content = content.replace('<think>', '');
      }
    }

    if (startReasoning && !endReasoning) {
      if (content.includes('</think>')) {
        endReasoning = true;
        const split = content.split('</think>');
        if (split[0]) onReasoning(split[0]);
        if (split[1]) onContent(split[1]);
        continue;
      }
    }

    if (!content) {
      continue;
    }

    if (startReasoning && !endReasoning) {
      onReasoning(content);
    } else {
      onContent(content);
    }
  }
}
