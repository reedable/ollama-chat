import useContent from '@hooks/useContent.jsx';
import * as animation from '@styles/Animation.scss';
import Logger from '@utils/Logger.js';
import React, { useEffect, useRef } from 'react';
import * as icons from 'react-bootstrap-icons';
import ReactMarkdown from 'react-markdown';
import appContent from '../App.yaml';
import * as styles from './Exchange.scss';
import content from './Exchange.yaml';
import Toolbar from './Toolbar.jsx';
import { deleteExchange } from './Exchange.js';

export default function Exchange({ exchange, onDelete }) {
  const _logger = new Logger('Exchange');
  const exchangeRef = useRef(null);
  const promptRef = useRef(null);
  const c = useContent(appContent, content);

  useEffect(() => {
    promptRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [exchange.answer]);

  const handleDelete = async (exchangeId) => {
    try {
      // TODO Give visual indication that deletion is now in progress
      await deleteExchange(exchangeId);

      setTimeout(() =>
        exchangeRef.current?.addEventListener(
          'animationend',
          () => onDelete(exchangeId),
          { once: true },
        ),
      );

      exchangeRef.current?.classList.add(animation.Collapse);
    } catch (e) {
      _logger.error('Error while calling handleDelete', e);
    }
  };

  return (
    <div
      ref={exchangeRef}
      className={styles.Exchange}
      data-exchange-id={exchange.exchangeId}
    >
      <div ref={promptRef} className={`${styles.Bubble} ${styles.Prompt}`}>
        {exchange.prompt}
      </div>

      {!exchange.error && !exchange.reasoning && !exchange.answer && (
        <div className={styles.Status}>
          <div className={animation.BounceLoop}>
            <icons.Eye />
          </div>
          <div>{c.waitingLabel()}</div>
        </div>
      )}

      {!exchange.error && exchange.reasoning && !exchange.answer && (
        <div className={styles.Status}>
          <div className={animation.BounceLoop}>
            <icons.Lightbulb />
          </div>
          <div>{c.reasoningLabel()}</div>
        </div>
      )}

      {exchange.answer && (
        <>
          <div className={`${styles.Answer}`}>
            <ReactMarkdown>{exchange.answer}</ReactMarkdown>
          </div>
          <Toolbar exchange={exchange} onDelete={handleDelete} />
        </>
      )}

      {exchange.error && (
        <div className={styles.Status}>
          <div>
            <icons.ExclamationCircleFill />
          </div>
          <div>{c.errorLabel()}</div>
        </div>
      )}
    </div>
  );
}
