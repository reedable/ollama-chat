import globalContent from '@content/Global.yaml';
import useContent from '@hooks/useContent';
import DOM from '@utils/DOM';
import Logger from '@utils/Logger';
import React, { useEffect, useState } from 'react';
import Card from './Card';
import * as styles from './Conversation.scss';
import content from './Conversation.yaml';
import UserInput from './UserInput';

// TODO Rename this to Conversation

export default function Conversation({ className }) {
  const _logger = new Logger('Chat');
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
      json.messages.reduce((cards, message) => {
        if (message.role === 'user') {
          cards.push({ prompt: message.content });
        } else {
          const lastCard = cards[cards.length - 1];
          const matches = message.content.match(
            /(<think>[\s\S]*<\/think>)([\s\S]*)/,
          );

          lastCard.think = matches[1];
          lastCard.answer = matches[2];
        }

        return cards;
      }, []),
    );
  }, []);

  return (
    <div className={DOM.classNames(className, styles.Chat)}>
      <h1>{ChatScreenHeader()}</h1>

      <ul>
        {conversation.map((item) => (
          <li key={item.id}>
            <Card card={item}></Card>
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
