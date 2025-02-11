import React from 'react';
import * as styles from './Chat.scss';
import Conversation from './Conversation.jsx';

export default function Chat() {
  return (
    <div className={styles.Chat}>
      <Conversation />
    </div>
  );
}
