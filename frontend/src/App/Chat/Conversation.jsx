import SrOnly from '@components/SrOnly.jsx';
import useContent from '@hooks/useContent.jsx';
import * as animationStyles from '@styles/Animation.scss';
import Logger from '@utils/Logger.js';
import React, { useEffect, useRef, useState } from 'react';
import * as icons from 'react-bootstrap-icons';
import { ChatStatus, useChatStatus } from '../../context/ChatStatusContext.jsx';
import appContent from '../App.yaml';
import { transformConversation } from './Conversation.js';
import * as styles from './Conversation.scss';
import content from './Conversation.yaml';
import Exchange from './Exchange.jsx';
import UserInput from './UserInput.jsx';

export default function Conversation() {
  const { REACT_APP_API_URL } = process.env;
  const _logger = new Logger('Conversation');
  const c = useContent(appContent, content);
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
        `${REACT_APP_API_URL}/api/user/conversation`,
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
      userInputFeedbackRef.current?.scrollTo(0, 32); //FIXME calculate px from rem
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
        <h1>{c.ConversationHeader()}</h1>
      </SrOnly>

      {conversation.exchanges?.length > 0 && (
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
            <li>
              <div ref={userInputFeedbackRef} className={styles.Status}>
                <div className={styles.Fill}></div>
                <div className={animationStyles.BounceLoop}>
                  <icons.Send />
                </div>
                <div>{c.sendingLabel()}</div>
              </div>
            </li>
          )}
        </ul>
      )}

      <UserInput
        userInput={userInput}
        setUserInput={setUserInput}
        conversation={conversation}
        setConversation={setConversation}
      ></UserInput>
    </div>
  );
}
