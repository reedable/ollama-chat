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
// import { deleteExchange } from './Exchange.js';

export default function Exchange({ exchange, onDelete }) {
  const _logger = new Logger('Exchange');
  const promptRef = useRef(null);
  const c = useContent(appContent, content);

  useEffect(() => {
    promptRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [exchange.answer]);

  const handleDelete = (exchangeId) => {
    try {
      // await deleteExchange(exchangeId);
      // TODO Collapse the panel and call onDelete on animationend
      onDelete(exchangeId);
    } catch (e) {
      _logger.error('Error while calling handleDelete', e);
    }
  };

  return (
    <div className={styles.Exchange} data-exchange-id={exchange.exchangeId}>
      <div ref={promptRef} className={`${styles.Bubble} ${styles.Prompt}`}>
        {exchange.prompt}
      </div>

      {!exchange.error && !exchange.reasoning && !exchange.answer && (
        <div class={styles.Status}>
          <div className={animation.BounceLoop}>
            <icons.Eye />
          </div>
          <div>{c.waitingLabel()}</div>
        </div>
      )}

      {!exchange.error && exchange.reasoning && !exchange.answer && (
        <div class={styles.Status}>
          <div class={animation.BounceLoop}>
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
        <div class={styles.Status}>
          <div>
            <icons.ExclamationCircleFill />
          </div>
          <div>{c.errorLabel()}</div>
        </div>
      )}
    </div>
  );
}
