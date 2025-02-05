import * as animation from '@styles/Animation.scss';
import Logger from '@utils/Logger';
import React, { useEffect, useRef } from 'react';
import { ExclamationCircleFill, Eye, Lightbulb } from 'react-bootstrap-icons';
import ReactMarkdown from 'react-markdown';
import * as styles from './Card.scss';

export default function Card({ className, card }) {
  const _logger = new Logger('Card');
  const promptRef = useRef(null);

  useEffect(() => {
    promptRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className={styles.Card}>
      <div ref={promptRef} className={`${styles.Bubble} ${styles.Prompt}`}>
        {card.prompt}
      </div>
      {!card.error && !card.think && !card.response && (
        <div class={styles.Status}>
          <div className={animation.BounceLoop}>
            <Eye />
          </div>
          <div>Reading...</div>
        </div>
      )}
      {!card.error && card.think && !card.response && (
        <div class={styles.Status}>
          <div class={animation.BounceLoop}>
            <Lightbulb />
          </div>
          <div>Thinking...</div>
        </div>
      )}
      <div className={`${styles.Answer}`}>
        <ReactMarkdown>{card.response}</ReactMarkdown>
      </div>
      {card.error && (
        <div class={styles.Status}>
          <div>
            <ExclamationCircleFill />
          </div>
          <div>Error</div>
        </div>
      )}
    </div>
  );
}
