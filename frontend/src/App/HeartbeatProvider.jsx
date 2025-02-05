import useInterval from '@hooks/useInterval';
import React, { createContext, useEffect } from 'react';

export const HeartbeatContext = createContext();

export default function HeartbeatProvider({ children }) {
  const [tick, start, stop] = useInterval({ delay: 100, strict: true });

  useEffect(() => {
    start();
    return () => stop();
  }, []);

  return (
    <HeartbeatContext.Provider value={{ tick, start, stop }}>
      {children}
    </HeartbeatContext.Provider>
  );
}
