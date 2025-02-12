import { parse } from './Parser.js';

function wrap(content) {
  return { message: { content } };
}

describe('Parser', () => {
  describe('parse', () => {
    test('1', async () => {
      const stream = ['<think>', 'foo', '</think>', 'bar']
        .map(wrap)
        .map((e) => Promise.resolve(e));

      let reasoning = '';
      let content = '';
      const onReasoning = (text) => (reasoning += text);
      const onContent = (text) => (content += text);

      await parse(stream, onContent, onReasoning);
      expect(reasoning).toEqual('foo');
      expect(content).toEqual('bar');
    });

    test('2', async () => {
      const stream = ['<think>', '\r\n', '</think>', 'bar']
        .map(wrap)
        .map((e) => Promise.resolve(e));

      let reasoning = '';
      let content = '';
      const onReasoning = (text) => (reasoning += text);
      const onContent = (text) => (content += text);

      await parse(stream, onContent, onReasoning);
      expect(reasoning).toEqual('\r\n');
      expect(content).toEqual('bar');
    });

    test('3', async () => {
      const stream = ['<think>', '</think>', 'bar']
        .map(wrap)
        .map((e) => Promise.resolve(e));

      let reasoning = '';
      let content = '';
      const onReasoning = (text) => (reasoning += text);
      const onContent = (text) => (content += text);

      await parse(stream, onContent, onReasoning);
      expect(reasoning).toEqual('');
      expect(content).toEqual('bar');
    });

    test('4', async () => {
      const stream = ['<think>foo</think>', 'bar']
        .map(wrap)
        .map((e) => Promise.resolve(e));

      let reasoning = '';
      let content = '';
      const onReasoning = (text) => (reasoning += text);
      const onContent = (text) => (content += text);

      await parse(stream, onContent, onReasoning);
      expect(reasoning).toEqual('foo');
      expect(content).toEqual('bar');
    });

    test('5', async () => {
      const stream = ['<think>foo', '</think>bar']
        .map(wrap)
        .map((e) => Promise.resolve(e));

      let reasoning = '';
      let content = '';
      const onReasoning = (text) => (reasoning += text);
      const onContent = (text) => (content += text);

      await parse(stream, onContent, onReasoning);
      expect(reasoning).toEqual('foo');
      expect(content).toEqual('bar');
    });

    test('6', async () => {
      const stream = ['<think>', 'foo</think>bar']
        .map(wrap)
        .map((e) => Promise.resolve(e));

      let reasoning = '';
      let content = '';
      const onReasoning = (text) => (reasoning += text);
      const onContent = (text) => (content += text);

      await parse(stream, onContent, onReasoning);
      expect(reasoning).toEqual('foo');
      expect(content).toEqual('bar');
    });

    test('7', async () => {
      const stream = ['<think>f', 'oo</think>bar']
        .map(wrap)
        .map((e) => Promise.resolve(e));

      let reasoning = '';
      let content = '';
      const onReasoning = (text) => (reasoning += text);
      const onContent = (text) => (content += text);

      await parse(stream, onContent, onReasoning);
      expect(reasoning).toEqual('foo');
      expect(content).toEqual('bar');
    });

    test('8', async () => {
      const stream = ['<think>foo</think>', 'bar']
        .map(wrap)
        .map((e) => Promise.resolve(e));

      let reasoning = '';
      let content = '';
      const onReasoning = (text) => (reasoning += text);
      const onContent = (text) => (content += text);

      await parse(stream, onContent, onReasoning);
      expect(reasoning).toEqual('foo');
      expect(content).toEqual('bar');
    });

    test('9', async () => {
      const stream = ['<think>', 'foo', '</think>', 'bar <think>']
        .map(wrap)
        .map((e) => Promise.resolve(e));

      let reasoning = '';
      let content = '';
      const onReasoning = (text) => (reasoning += text);
      const onContent = (text) => (content += text);

      await parse(stream, onContent, onReasoning);
      expect(reasoning).toEqual('foo');
      expect(content).toEqual('bar <think>');
    });
  }); //end of parse
}); //end of Parser
