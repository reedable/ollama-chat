import useContent from '@hooks/useContent.jsx';
import Logger from '@utils/Logger.js';
import React, { useEffect, useRef } from 'react';
import * as icons from 'react-bootstrap-icons';
import ReactMarkdown from 'react-markdown';
import animate from '../../utils/animate.js';
import appContent from '../App.yaml';
import { deleteExchange } from './Exchange.js';
import * as styles from './Exchange.scss';
import content from './Exchange.yaml';
import Toolbar from './Toolbar.jsx';

export default function Exchange({ exchange, onDelete }) {
  const _logger = new Logger('Exchange');
  const exchangeRef = useRef(null);
  const promptRef = useRef(null);
  const answerRef = useRef(null);
  const c = useContent(appContent, content);

  useEffect(() => {
    promptRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [exchange.answer]);

  const handleCollapse = async (domEvent) => {
    const el = answerRef.current;

    if (el) {
      const clientHeight = answerRef.current?.clientHeight;

      await animate(el)
        .from({
          maxHeight: `${clientHeight}px`,
          overflow: 'hidden',
          transformOrigin: 'top',
        })
        .to({ maxHeight: '2rem' });
    }
  };

  const handleExpand = async (domEvent) => {
    const el = answerRef.current;

    if (el) {
      const clientHeight = el.clientHeight;
      const scrollHeight = el.scrollHeight;

      await animate(el)
        .from({ maxHeight: `${clientHeight}px` })
        .to({ maxHeight: `${scrollHeight}px` });
    }
  };

  const handleDelete = async (exchangeId) => {
    try {
      const el = exchangeRef.current;

      if (el) {
        const clientHeight = el.clientHeight;

        deleteExchange(exchangeId);

        await animate(el)
          .from({
            maxHeight: `${clientHeight}px`,
            opacity: '1',
            transform: 'scaleY(1)',
            transformOrigin: 'top',
          })
          .to({
            maxHeight: '0',
            opacity: '0',
            transform: 'scaleY(0)',
          });
      }

      onDelete(exchangeId);
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
          <div className={animate.BounceLoop}>
            <icons.Eye />
          </div>
          <div>{c.waitingLabel()}</div>
        </div>
      )}

      {!exchange.error && exchange.reasoning && !exchange.answer && (
        <div className={styles.Status}>
          <div className={animate.BounceLoop}>
            <icons.Lightbulb />
          </div>
          <div>{c.reasoningLabel()}</div>
        </div>
      )}

      {exchange.answer && (
        <>
          <div ref={answerRef} className={`${styles.Answer}`}>
            <ReactMarkdown>{exchange.answer}</ReactMarkdown>
          </div>
          <Toolbar
            exchange={exchange}
            onDelete={handleDelete}
            onCollapse={handleCollapse}
            onExpand={handleExpand}
          />
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
