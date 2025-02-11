import SrOnly from '@components/SrOnly.jsx';
import useContent from '@hooks/useContent.jsx';
import Logger from '@utils/Logger.js';
import React, { useEffect, useRef, useState } from 'react';
import appContent from '../App.yaml';
import { transformConversation } from './Conversation.js';
import * as styles from './Conversation.scss';
import content from './Conversation.yaml';
import Exchange from './Exchange.jsx';
import UserInput from './UserInput.jsx';
import { ChatStatus, useChatStatus } from '../../context/ChatStatusContext.jsx';

export default function Conversation() {
  const _logger = new Logger('Conversation');
  const { ConversationHeader } = useContent(appContent, content);
  const [conversation, setConversation] = useState([]);
  const [userInput, setUserInput] = useState('');
  const { chatStatus } = useChatStatus();
  const userInputFeedbackRef = useRef(null);

  // TODO Manage conversation state so we can show intro screen
  //      - conversation === null
  //        Loading conversation from the server
  //        Show progress bar
  //      - conversation.exchanges.length === 0
  //        Loaded conversation from the server, and it's empty
  //        Show intro screen
  //      - conversation.exchanges.length > 0
  //        Loaded conversation from the server

  useEffect(() => {
    (async function getData() {
      const response = await fetch(
        'http://localhost:3000/api/user/conversation',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const json = await response.json();
      const conversation = transformConversation(json);
      setConversation(conversation);
    })();
  }, []);

  useEffect(() => {
    _logger.log(`chatStatus ${chatStatus.description}`);

    if (chatStatus === ChatStatus.Sending) {
      userInputFeedbackRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatStatus]);

  const handleDeleteExchange = async (exchangeId) => {
    conversation.exchanges = conversation.exchanges.filter(
      (e) => e.exchangeId !== exchangeId,
    );
    setConversation({ ...conversation });
  };

  return (
    <div className={styles.Conversation}>
      <SrOnly>
        <h1>{ConversationHeader()}</h1>
      </SrOnly>

      <ul>
        {conversation.exchanges?.map((exchange) => (
          <li key={exchange.exchangeId}>
            <Exchange
              exchange={exchange}
              onDelete={handleDeleteExchange}
            ></Exchange>
          </li>
        ))}
        {chatStatus === ChatStatus.Sending && (
          <li ref={userInputFeedbackRef}>Sending...</li>
        )}
      </ul>

      <UserInput
        userInput={userInput}
        setUserInput={setUserInput}
        conversation={conversation}
        setConversation={setConversation}
      ></UserInput>
    </div>
  );
}
