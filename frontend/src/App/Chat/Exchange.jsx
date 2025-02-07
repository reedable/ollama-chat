import * as animation from '@styles/Animation.scss';
import Logger from '@utils/Logger';
import React, { useEffect, useRef } from 'react';
import {
  Copy,
  ExclamationCircleFill,
  Eye,
  HandThumbsDown,
  HandThumbsUp,
  Lightbulb,
  XCircle,
} from 'react-bootstrap-icons';
import ReactMarkdown from 'react-markdown';
import * as styles from './Exchange.scss';

export default function Exchange({ className, exchange }) {
  const _logger = new Logger('Exchange');
  const promptRef = useRef(null);

  useEffect(() => {
    promptRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className={styles.Exchange}>
      <div ref={promptRef} className={`${styles.Bubble} ${styles.Prompt}`}>
        {exchange.prompt}
      </div>
      {!exchange.error && !exchange.reasoning && !exchange.answer && (
        <div class={styles.Status}>
          <div className={animation.BounceLoop}>
            <Eye />
          </div>
          <div>Reading...</div>
        </div>
      )}
      {!exchange.error && exchange.reasoning && !exchange.answer && (
        <div class={styles.Status}>
          <div class={animation.BounceLoop}>
            <Lightbulb />
          </div>
          <div>Thinking...</div>
        </div>
      )}
      {exchange.answer && (
        <>
          <div className={`${styles.Answer}`}>
            <ReactMarkdown>{exchange.answer}</ReactMarkdown>
          </div>
          {/*TODO Show the toolbar only when the response is done*/}
          <div>
            <Copy /> <HandThumbsUp /> <HandThumbsDown /> <Lightbulb />{' '}
            <XCircle />
          </div>
        </>
      )}
      {exchange.error && (
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
