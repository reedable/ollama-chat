import useContent from '@hooks/useContent';
import DOM from '@utils/DOM';
import Logger from '@utils/Logger';
import React, { useEffect, useState } from 'react';
import appContent from '../App.yaml';
import * as styles from './Conversation.scss';
import content from './Conversation.yaml';
import Exchange from './Exchange';
import UserInput from './UserInput';

// TODO Rename this to Conversation

export default function Conversation({ className }) {
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

  useEffect(async () => {
    const response = await fetch('http://localhost:3000/api/conversation', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const json = await response.json();

    setConversation(
      json.messages
        .reduce((exchange, message) => {
          if (message.role === 'user') {
            exchange.push({ prompt: message.content });
          } else {
            const lastCard = exchange[exchange.length - 1];
            lastCard.answer = message.content;
          }

          return exchange;
        }, [])
        .filter((e) => e.answer),
    );
  }, []);

  return (
    <div className={DOM.classNames(className, styles.Chat)}>
      <h1>{ConversationHeader()}</h1>

      <ul>
        {conversation.map((exchange) => (
          <li key={exchange.exchangeId}>
            <Exchange exchange={exchange}></Exchange>
          </li>
        ))}
      </ul>

      <UserInput
        userInput={userInput}
        setUserInput={setUserInput}
        chatHistory={conversation}
        setChatHistory={setConversation}
      ></UserInput>
    </div>
  );
}
