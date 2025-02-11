import Button from '@components/Button';
import useContent from '@hooks/useContent.jsx';
import useFetchMultipart from '@hooks/useFetchMultipart';
import Logger from '@utils/Logger.js';
import React, { useEffect, useRef, useState } from 'react';
import * as styles from './UserInput.scss';
import content from './UserInput.yaml';
import { ChatStatus, useChatStatus } from '../../context/ChatStatusContext';

export default function UserInput({
  userInput,
  setUserInput,
  conversation,
  setConversation,
}) {
  const _logger = new Logger('UserInput');
  const c = useContent(content);
  const textareaRef = useRef(null); // For auto-resizing
  const controllerRef = useRef(null);
  const [fetchMultipart] = useFetchMultipart();
  const { chatStatus, setChatStatus } = useChatStatus();
  const [networkStatus, setNetworkStatus] = useState(false);

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

  useEffect(() => {
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

    textarea.style.height = 'auto';

    const scrollHeight = textarea.scrollHeight;
    const targetHeightPx = scrollHeight - padding;
    const targetHeightRem = targetHeightPx / rootFontSize;

    if (targetHeightRem) {
      textarea.style.height = `${targetHeightRem}rem`;
    }
  }, [userInput]);

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

          setConversation({ ...conversation });
          setChatStatus(ChatStatus.Posted);
        },
        (text) => {
          // FIXME DeepSeek reasoning
          const exchange =
            conversation.exchanges[conversation.exchanges.length - 1];
          exchange.answer += text;
          exchange.endTs = Date.now();

          setConversation({ ...conversation });
          setChatStatus(ChatStatus.Answering);
        },
        // FIXME DeepSeek answering
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
