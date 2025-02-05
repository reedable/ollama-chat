import GlobalContent from '@content/Global.yaml';
import useContent from '@hooks/useContent';
import DOM from '@utils/DOM';
import Logger from '@utils/Logger';
import React, { useState } from 'react';
import Card from './Card';
import * as Styles from './Chat.scss';
import ChatContent from './Chat.yaml';
import UserInput from './UserInput';

export default function Chat({ className }) {
  const _logger = new Logger('Chat');
  const { ChatScreenHeader } = useContent(GlobalContent, ChatContent);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');

  return (
    <div className={DOM.classNames(className, Styles.Chat)}>
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
