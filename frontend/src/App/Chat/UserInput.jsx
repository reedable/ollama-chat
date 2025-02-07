import Button from '@components/Button';
import useFetchStream from '@hooks/useFetchStream';
import Logger from '@utils/Logger';
import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function UserInput({
  className,
  userInput,
  setUserInput,
  chatHistory,
  setChatHistory,
}) {
  const _logger = new Logger('UserInput');
  const [inProgress, setInProgress] = useState(false);
  const userInputRef = useRef(null); // For auto-resizing
  const controllerRef = useRef(null);
  const [fetchStream] = useFetchStream();

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
    const id = uuidv4();
    const prompt = userInput; //FIXME Sanitize input?
    const exchange = { id, prompt, answer: '' };

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

    setChatHistory([...chatHistory, exchange]);
    setInProgress(true);

    try {
      const signal = controllerRef.current?.signal;
      const result = await fetchStream(
        'http://localhost:3000/api/chat',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: prompt }),
          signal,
        },
        (reasoning, answer) => {
          exchange.reasoning += reasoning;
          exchange.answer += answer;

          setChatHistory((prevExchanges) =>
            prevExchanges.map((e) => (e.id === exchange.id ? exchange : e)),
          );
        },
      );

      setInProgress(false);
      setUserInput('');
      console.debug(result);
    } catch (e) {
      // TODO Implement better error handling
      exchange.error = e.t0 || e;

      setChatHistory((prevItems) =>
        prevItems.map((prevItem) =>
          prevItem.id === exchange.id ? exchange : prevItem,
        ),
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        ref={userInputRef}
        rows="1"
        value={userInput}
        disabled={inProgress}
        onChange={(domEvent) => setUserInput(domEvent.target.value)}
      ></textarea>
      <Button type="submit">{inProgress ? <>Stop</> : <>Send</>}</Button>
    </form>
  );
}
