import { v4 as uuidv4 } from 'uuid';
import { Conversation, Exchange } from '../models/Schema.js';
import ollama from '../services/ollama.js';
import { parse } from '../utils/Parser.js';

export async function postExchange(req, res) {
  const { MODEL_NAME } = process.env;
  const boundary = uuidv4();
  const exchangeId = req.exchange._id.toString();
  const logger = req.logger.child({ controller: 'postExchange', exchangeId });

  const _write = res.write;

  res.write = function () {
    logger.debug(arguments[0]);
    _write.apply(res, arguments);
  };

  res.setHeader(`Content-Type`, `multipart/mixed; boundary=${boundary}`);
  res.setHeader('Transfer-Encoding', 'chunked');

  // Acknowledge the receipt of the prompt with the new exchangeId

  try {
    res.write(`--${boundary}\r\n`);
    res.write('Content-Type: application/json\r\n');
    res.write('X-Content-Type: record/exchange\r\n');
    res.write('\r\n'); //end of headers
    res.write(`${JSON.stringify(req.exchange)}\r\n`);
  } catch (error) {
    logger.error({ error }, 'Error while sending exchange');
    res.status(500).end();
  }

  // Load the last 12 exchanges from the conversation
  try {
    await req.conversation.populate({
      path: 'exchanges',
      options: { sort: { _id: -1 }, limit: 12 },
    });
  } catch (error) {
    logger.error({ error }, 'Error while loading chat history');
    res.status(500).end();
  }

  // Query the LLM and stream AI assistant response

  try {
    const prompt = req.exchange.messages[0].content;
    const answer = req.exchange.messages[1];

    const messages = req.conversation.exchanges
      .reverse()
      .map((exchange) => exchange.messages)
      .flat()
      .map((message) => ({ role: message.role, content: message.content }))
      .concat({ role: 'user', content: prompt });

    const controller = new AbortController();
    const { signal } = controller;

    const onClose = () => {
      logger.debug('Response closed');
    };

    const onAbort = () => {
      // In certain scenarios, especially when computations are offloaded to
      // the CPU, the server might continue processing even after the client
      // has aborted the request. To manage the server’s request queue, you can
      // adjust the OLLAMA_MAX_QUEUE environment variable.
      logger.info('Request aborted');
      controller.abort();
    };

    const onFinish = () => {
      // Close after finish implies normal completion
      res.on('close', onClose);
      res.removeListener('close', onAbort);
    };

    // Close before finish implies aborted request
    res.on('close', onAbort);
    res.on('finish', onFinish);

    logger.debug('Calling ollama.chat');

    const stream = await ollama.chat({
      model: MODEL_NAME,
      messages,
      stream: true,
      signal,
    });

    let reasoningStarted = false;
    let contentStarted = false;

    const onReasoning = (reasoning) => {
      if (!reasoningStarted) {
        res.write(`--${boundary}\r\n`);
        res.write('Content-Type: text/plain\r\n');
        res.write('X-Content-Type: application/reasoning\r\n');
        res.write('\r\n'); //end of headers
        reasoningStarted = true;
      }

      answer.reasoning += reasoning;
      res.write(reasoning);
    };

    const onContent = (content) => {
      if (!contentStarted) {
        res.write(`--${boundary}\r\n`);
        res.write('Content-Type: text/plain\r\n');
        res.write('X-Content-Type: application/answer\r\n');
        res.write('\r\n'); //end of headers
        contentStarted = true;
      }

      answer.content += content;
      res.write(content);
    };

    await parse(stream, onContent, onReasoning);

    res.write('\r\n');
    logger.debug('Finished streaming response');
  } catch (error) {
    // TODO Flag the exchange as error
    logger.error({ error }, 'Error generating response');
    res.status(500).end();
  } finally {
    logger.debug('Saving exchange data');
    req.exchange.save();
  }

  res.write(`--${boundary}--`);
  res.end();
}

export async function deleteExchange(req, res) {
  const { exchangeId } = req.body;
  const logger = req.logger.child({ controller: 'deleteExchange', exchangeId });

  if (!exchangeId) {
    logger.info('Invalid request');
    return res.status(400).end();
  }

  const exchange = await Exchange.findOne({
    _id: exchangeId,
    conversationId: { $in: req.user.conversations },
  });

  if (!exchange) {
    logger.info('Record not found');
    return res.status(404).end();
  }

  logger.debug('Deleting exchange data');
  await Exchange.deleteOne({ _id: exchange._id });

  logger.debug('Updating conversation data');
  await Conversation.updateOne(
    { _id: exchange.conversationId },
    { $pull: { exchanges: exchange._id } },
  );

  return res.status(200).end();
}
