import React, { createContext, useContext, useState } from 'react';

export const ChatStatus = Object.freeze({
  Idle: Symbol('Idle'),
  Typing: Symbol('Typing'),
  Paused: Symbol('Paused'),
  Sending: Symbol('Sending'),
  Posted: Symbol('Posted'), //--> ExchangeStatus
  Reasoning: Symbol('Reasoning'), //--> ExchangeStatus
  Answering: Symbol('Answering'), //--> ExchangeStatus
  Done: Symbol('Done'), //--> ExchangeStatus
  Error: Symbol('Error'), //--> ExchangeStatus
});

const ChatStatusContext = createContext();

export function ChatStatusProvider({ children }) {
  const [chatStatus, setChatStatus] = useState(ChatStatus.Idle);

  return (
    <ChatStatusContext.Provider value={{ chatStatus, setChatStatus }}>
      {children}
    </ChatStatusContext.Provider>
  );
}

export function useChatStatus() {
  return useContext(ChatStatusContext);
}
