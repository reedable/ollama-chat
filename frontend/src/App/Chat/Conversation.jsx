import useContent from '@hooks/useContent.jsx';
import Logger from '@utils/Logger.js';
import React, { useEffect, useState } from 'react';
import appContent from '../App.yaml';
import { messagesToConversation } from './Conversation.js';
import * as styles from './Conversation.scss';
import content from './Conversation.yaml';
import Exchange from './Exchange.jsx';
import UserInput from './UserInput.jsx';

export default function Conversation() {
  const _logger = new Logger('Conversation');
  const { ConversationHeader } = useContent(appContent, content);
  const [conversation, setConversation] = useState([]);
  const [userInput, setUserInput] = useState('');

  // TODO Manage conversation state so we can show intro screen
  //      - conversation === null
  //        Loading conversation from the server
  //        Show progress bar
  //      - conversation.length === 0
  //        Loaded conversation from the server, and it's empty
  //        Show intro screen
  //      - conversation.length > 0
  //        Loaded conversation from the server

  useEffect(() => {
    (async function getData() {
      const response = await fetch('http://localhost:3000/api/conversation', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const json = await response.json();
      const conversation = messagesToConversation(json.messages);
      setConversation(conversation);
    })();
  }, []);

  const handleDeleteExchange = async (exchangeId) => {
    setConversation(conversation.filter((e) => e.exchangeId !== exchangeId));
  };

  return (
    <div className={styles.Conversation}>
      <h1>{ConversationHeader()}</h1>

      <ul>
        {conversation.map((exchange) => (
          <li key={exchange.exchangeId}>
            <Exchange
              exchange={exchange}
              onDelete={handleDeleteExchange}
            ></Exchange>
          </li>
        ))}
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
