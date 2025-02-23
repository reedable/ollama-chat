import useContent from '@hooks/useContent.jsx';
import * as animationStyles from '@styles/Animation.scss';
import Logger from '@utils/Logger.js';
import React, { useEffect, useRef, useState } from 'react';
import * as icons from 'react-bootstrap-icons';
import ReactMarkdown from 'react-markdown';
import animate from '../../utils/animate.js';
import appContent from '../App.yaml';
import { deleteExchange } from './Exchange.js';
import * as styles from './Exchange.scss';
import content from './Exchange.yaml';
import Toolbar from './Toolbar.jsx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // Import KaTeX styles

export default function Exchange({ exchange, onDelete }) {
  const _logger = new Logger('Exchange');
  const exchangeRef = useRef(null);
  const promptRef = useRef(null);
  const answerRef = useRef(null);
  const debugRef = useRef(null);
  const c = useContent(appContent, content);
  const [isDebug, setIsDebug] = useState(false);

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

  const handleDebug = async (isDebug) => {
    _logger.debug(`handleDebug isDebug=${isDebug}`);
    setIsDebug(isDebug);
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
          <div className={animationStyles.BounceLoop}>
            <icons.Eye />
          </div>
          <div>{c.waitingLabel()}</div>
        </div>
      )}

      {!exchange.error && exchange.reasoning && !exchange.answer && (
        <div className={styles.Status}>
          <div className={animationStyles.BounceLoop}>
            <icons.Lightbulb />
          </div>
          <div>{c.reasoningLabel()}</div>
        </div>
      )}

      {exchange.answer && (
        <>
          <div ref={answerRef} className={styles.Answer}>
            <ReactMarkdown
              children={exchange.answer}
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            ></ReactMarkdown>
          </div>
          {isDebug && (
            <div className={styles.Debug} ref={debugRef}>
              <div>
                <ReactMarkdown>{exchange.reasoning}</ReactMarkdown>
              </div>
            </div>
          )}
          <Toolbar
            exchange={exchange}
            onDelete={handleDelete}
            onCollapse={handleCollapse}
            onExpand={handleExpand}
            onDebug={handleDebug}
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
