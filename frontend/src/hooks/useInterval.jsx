import Logger from '@utils/Logger';
import { useRef, useState } from 'react';

export default function useInterval({ delay = 1000, strict = false } = {}) {
  const _logger = new Logger('useInterval');
  const tidRef = useRef();
  const lastRef = useRef();
  const [tick, setTick] = useState(false);

  const next = () => {
    const now = Date.now();
    const elapsed = now - lastRef.current || delay;
    const lag = elapsed - delay;

    try {
      setTick((x) => !x);

      if (strict && lag > 0) {
        tidRef.current = setTimeout(next, delay - lag);
      } else {
        tidRef.current = setTimeout(next, delay);
      }
    } finally {
      lastRef.current = now;
    }
  };

  const stop = () => {
    clearTimeout(tidRef.current);
    tidRef.current = 0;
  };

  const start = () => {
    stop();
    next();
  };

  return [tick, start, stop];
}
