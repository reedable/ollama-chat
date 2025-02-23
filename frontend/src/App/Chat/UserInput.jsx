import Button from '@components/Button';
import useContent from '@hooks/useContent.jsx';
import useFetchMultipart from '@hooks/useFetchMultipart';
import Logger from '@utils/Logger.js';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChatStatus, useChatStatus } from '../../context/ChatStatusContext';
import * as styles from './UserInput.scss';
import content from './UserInput.yaml';

export default function UserInput({
  userInput,
  setUserInput,
  conversation,
  setConversation,
}) {
  const { REACT_APP_API_URL } = process.env;
  const _logger = new Logger('UserInput');
  const c = useContent(content);
  const textareaRef = useRef(null); // For auto-resizing
  const controllerRef = useRef(null);
  const [fetchMultipart] = useFetchMultipart();
  const { chatStatus, setChatStatus } = useChatStatus();
  const [networkStatus, setNetworkStatus] = useState(false);

  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;

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

    const lastHeight = textarea.style.height;
    textarea.style.height = 'auto';

    const scrollHeight = textarea.scrollHeight;
    const targetHeightPx = scrollHeight - padding;
    const targetHeightRem = targetHeightPx / rootFontSize;

    if (targetHeightRem) {
      textarea.style.height = `${targetHeightRem}rem`;
    }
  });

  useEffect(() => adjustTextareaHeight, [userInput]);

  useEffect(() => {
    if (!controllerRef.current) {
      controllerRef.current = new AbortController();
    }
  }, []);

  useEffect(() => {
    setNetworkStatus(
      [
        ChatStatus.Sending,
        ChatStatus.Posted,
        ChatStatus.Reasoning,
        ChatStatus.Answering,
      ].indexOf(chatStatus) !== -1,
    );
  }, [chatStatus]);

  useEffect(() => {
    if (chatStatus === ChatStatus.Done) {
      setChatStatus(ChatStatus.Idle);
    }
  }, [chatStatus]);

  useEffect(() => {
    if (!networkStatus) {
      textareaRef.current?.focus();
    }
  }, [networkStatus]);

  useEffect(() => {
    if (
      chatStatus === ChatStatus.Posted ||
      chatStatus === ChatStatus.Reasoning ||
      chatStatus === ChatStatus.Answering
    ) {
      setUserInput('');
    }
  }, [chatStatus]);

  const handleCancel = async (domEvent) => {
    domEvent.preventDefault();

    try {
      return controllerRef.current?.abort();
    } finally {
      controllerRef.current = new AbortController();
      setChatStatus(ChatStatus.Idle);
    }
  };

  const handleSubmit = async (domEvent) => {
    domEvent.preventDefault();
    const prompt = userInput; //FIXME Sanitize input?
    const exchange = { prompt, answer: '' };

    if (!prompt) {
      alert('Please enter a prompt.');
      return;
    }

    try {
      const startTs = Date.now();
      setChatStatus(ChatStatus.Sending);

      const signal = controllerRef.current?.signal;
      const result = await fetchMultipart(
        `${REACT_APP_API_URL}/api/user/conversation/exchange`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
          signal,
        },
        (response, header) => {
          //FIXME parse X-Content-Type if(/record\/exchange/.test(header)) {
          if (typeof response === 'object') {
            conversation.exchanges.push({
              exchangeId: response._id,
              prompt: response.messages[0].content,
              answer: response.messages[1].content,
              startTs,
            });

            setChatStatus(ChatStatus.Posted);
          } else {
            const index = conversation.exchanges.length - 1;
            const exchange = conversation.exchanges[index];

            exchange.endTs = Date.now();

            if (/application\/reasoning/.test(header)) {
              exchange.reasoning += response;
              setChatStatus(ChatStatus.Reasoning);
            } else {
              exchange.answer += response;
              setChatStatus(ChatStatus.Answering);
            }
          }

          setConversation({ ...conversation });
        },
      );
    } catch (e) {
      // TODO Implement better error handling
      exchange.error = e.t0 || e;
    } finally {
      setChatStatus(ChatStatus.Done);
    }
  };

  return (
    <form
      className={styles.UserInput}
      onSubmit={networkStatus ? handleCancel : handleSubmit}
    >
      {/* TODO Turn textarea into a component */}
      <textarea
        ref={textareaRef}
        rows="1"
        value={userInput}
        disabled={networkStatus}
        onChange={(domEvent) => setUserInput(domEvent.target.value)}
      ></textarea>
      <Button type="submit">
        {networkStatus ? c.cancelLabel() : c.submitLabel()}
      </Button>
    </form>
  );
}
