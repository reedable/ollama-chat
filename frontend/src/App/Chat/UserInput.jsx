import Button from '@components/Button';
import useContent from '@hooks/useContent.jsx';
import useFetchStream from '@hooks/useFetchStream';
import Logger from '@utils/Logger.js';
import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
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
  const [fetchStream] = useFetchStream();
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
    const exchangeId = uuidv4();
    const prompt = userInput; //FIXME Sanitize input?
    const exchange = { exchangeId, prompt, answer: '' };

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

    setConversation([...conversation, exchange]);
    setInProgress(true);

    try {
      const startTs = Date.now();
      const signal = controllerRef.current?.signal;
      const result = await fetchStream(
        'http://localhost:3000/api/chat',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ exchangeId, prompt }),
          signal,
        },
        (reasoning, answer) => {
          exchange.reasoning += reasoning;
          exchange.answer += answer;
          exchange.startTs = startTs;
          exchange.endTs = Date.now();

          setConversation((prevExchanges) =>
            prevExchanges.map((e) =>
              e.exchangeId === exchange.exchangeId ? exchange : e,
            ),
          );
        },
      );

      setInProgress(false);
      setUserInput('');
      console.debug(result);
    } catch (e) {
      // TODO Implement better error handling
      exchange.error = e.t0 || e;

      setConversation((prevItems) =>
        prevItems.map((e) =>
          e.exchangeId === exchange.exchangeId ? exchange : e,
        ),
      );
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
