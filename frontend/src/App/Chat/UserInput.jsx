import Button from '@components/Button';
import useContent from '@hooks/useContent.jsx';
import useFetchMultipart from '@hooks/useFetchMultipart';
import Logger from '@utils/Logger.js';
import React, { useEffect, useRef, useState } from 'react';
import * as styles from './UserInput.scss';
import content from './UserInput.yaml';

export default function UserInput({
  userInput,
  setUserInput,
  conversation,
  setConversation,
}) {
  const _logger = new Logger('UserInput');
  const [inProgress, setInProgress] = useState(false);
  const userInputRef = useRef(null); // For auto-resizing
  const controllerRef = useRef(null);
  const [fetchMultipart] = useFetchMultipart();
  const c = useContent(content);

  useEffect(() => {
    if (!controllerRef.current) {
      controllerRef.current = new AbortController();
    }
  }, []);

  useEffect(() => {
    if (inProgress === false) {
      userInputRef.current?.focus();
    }
  }, [inProgress]);

  useEffect(() => {
    const textarea = userInputRef.current;

    if (!textarea) {
      return;
    }

    const rootFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    );

    const styles = getComputedStyle(textarea);
    const paddingTop = parseFloat(styles.paddingTop);
    const paddingBottom = parseFloat(styles.paddingBottom);
    const padding = paddingTop + paddingBottom;

    textarea.style.height = 'auto';

    const scrollHeight = textarea.scrollHeight;
    const targetHeightPx = scrollHeight - padding;
    const targetHeightRem = targetHeightPx / rootFontSize;

    if (targetHeightRem) {
      textarea.style.height = `${targetHeightRem}rem`;
    }
  }, [userInput]);

  const handleSubmit = async (domEvent) => {
    domEvent.preventDefault();
    const prompt = userInput; //FIXME Sanitize input?
    const exchange = { prompt, answer: '' };

    if (inProgress) {
      try {
        return controllerRef.current?.abort();
      } finally {
        controllerRef.current = new AbortController();
        setInProgress(false);
      }
    }

    if (!prompt) {
      alert('Please enter a prompt.');
      return;
    }

    try {
      const startTs = Date.now();
      setInProgress(true);

      const signal = controllerRef.current?.signal;
      const result = await fetchMultipart(
        'http://localhost:3000/api/user/conversation/exchange',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
          signal,
        },
        (response) => {
          conversation.exchanges.push({
            exchangeId: response._id,
            prompt: response.messages[0].content,
            answer: response.messages[1].content,
            startTs,
          });

          setConversation({
            ...conversation,
          });

          setUserInput('');
        },
        (text) => {
          const exchange =
            conversation.exchanges[conversation.exchanges.length - 1];
          exchange.answer += text;
          exchange.endTs = Date.now();

          setConversation({
            ...conversation,
          });
        },
        (text) => {
          // TODO DeepSeek answer
          _logger.log('callback[2]', text);
        },
      );

      console.debug(result);
    } catch (e) {
      // TODO Implement better error handling
      exchange.error = e.t0 || e;
    } finally {
      setInProgress(false);
    }
  };

  return (
    <form className={styles.UserInput} onSubmit={handleSubmit}>
      {/* TODO Turn textarea into a component */}
      <textarea
        ref={userInputRef}
        rows="1"
        value={userInput}
        disabled={inProgress}
        onChange={(domEvent) => setUserInput(domEvent.target.value)}
      ></textarea>
      <Button type="submit">
        {inProgress ? c.abortLabel() : c.submitLabel()}
      </Button>
    </form>
  );
}
