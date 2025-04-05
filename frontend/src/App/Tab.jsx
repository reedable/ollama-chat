import React, { createContext, useContext, useState, useEffect } from 'react';
import { app as teams } from '@microsoft/teams-js';

const TeamsContext = createContext(null);

export const TeamsProvider = ({ children }) => {
  const [context, setContext] = useState(null);

  useEffect(() => {
    (async () => {
      await teams.initialize();
      const context = await teams.getContext();
      setContext(context);
    })();
  }, []);

  return (
    <TeamsContext.Provider value={context}>{children}</TeamsContext.Provider>
  );
};

export const useTeamsContext = () => useContext(TeamsContext);

export default function Tab({ children }) {
  return <TeamsProvider>{children}</TeamsProvider>;
}
