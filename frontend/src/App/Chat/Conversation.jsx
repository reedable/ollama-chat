import globalContent from '@content/Global.yaml';
import useContent from '@hooks/useContent';
import DOM from '@utils/DOM';
import Logger from '@utils/Logger';
import React, { useState } from 'react';
import Card from './Card';
import * as styles from './Conversation.scss';
import content from './Conversation.yaml';
import UserInput from './UserInput';

// TODO Rename this to Conversation

export default function Conversation({ className }) {
  const _logger = new Logger('Chat');
  const { ChatScreenHeader } = useContent(globalContent, content);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');

  return (
    <div className={DOM.classNames(className, styles.Chat)}>
      <h1>{ChatScreenHeader()}</h1>

      <ul>
        {chatHistory.map((item) => (
          <li key={item.id}>
            <Card card={item}></Card>
          </li>
        ))}
      </ul>

      <UserInput
        userInput={userInput}
        setUserInput={setUserInput}
        chatHistory={chatHistory}
        setChatHistory={setChatHistory}
      ></UserInput>
    </div>
  );
}
