import globalContent from '@content/Global.yaml';
import useContent from '@hooks/useContent';
import DOM from '@utils/DOM';
import Logger from '@utils/Logger';
import React, { useEffect, useState } from 'react';
import Exchange from './Exchange';
import * as styles from './Conversation.scss';
import content from './Conversation.yaml';
import UserInput from './UserInput';

// TODO Rename this to Conversation

export default function Conversation({ className }) {
  const _logger = new Logger('Conversation');
  const { ChatScreenHeader } = useContent(globalContent, content);
  const [conversation, setConversation] = useState([]);
  const [userInput, setUserInput] = useState('');

  useEffect(async () => {
    const response = await fetch('http://localhost:3000/api/conversation', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const json = await response.json();

    setConversation(
      json.messages.reduce((exchange, message) => {
        if (message.role === 'user') {
          exchange.push({ prompt: message.content });
        } else {
          const lastCard = exchange[exchange.length - 1];
          const matches = message.content.match(
            /(<think>[\s\S]*<\/think>)([\s\S]*)/,
          );

          lastCard.reasoning = matches[1];
          lastCard.answer = matches[2];
        }

        return exchange;
      }, []),
    );
  }, []);

  return (
    <div className={DOM.classNames(className, styles.Chat)}>
      <h1>{ChatScreenHeader()}</h1>

      <ul>
        {conversation.map((exchange) => (
          <li key={exchange.id}>
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
