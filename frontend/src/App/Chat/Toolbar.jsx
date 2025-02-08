import useContent from '@hooks/useContent.jsx';
import Clipboard from '@utils/Clipboard.js';
import Logger from '@utils/Logger.js';
import React from 'react';
import * as icons from 'react-bootstrap-icons';
import appContent from '../App.yaml';
import Charm from './Charm.jsx';
import * as styles from './Toolbar.scss';
import content from './Toolbar.yaml';

export default function Toolbar({ exchange, onDelete }) {
  const _logger = new Logger('Toolbar');
  const c = useContent(appContent, content);

  const handleCopy = async (domEvent) => {
    try {
      await Clipboard.copy(exchange.answer);
      domEvent.target.closest('button').focus();
    } catch (e) {
      _logger.error('Error while calling handleCopy', e);
    }
  };

  const handleLike = (domEvent) => {
    _logger.debug('LIKE', domEvent);
  };

  const handleDislike = (domEvent) => {
    _logger.debug('DISLIKE', domEvent);
  };

  const handleDelete = (domEvent) => {
    _logger.debug('DELETE', exchange.exchangeId);
    onDelete(exchange.exchangeId);
  };

  const handleDebug = (domEvent) => {
    _logger.debug('DEBUG', domEvent);
  };

  return (
    <div className={styles.Toolbar}>
      <Charm Icon={icons.Copy} label={c.copyLabel()} onClick={handleCopy} />
      <Charm
        Icon={icons.HandThumbsUp}
        label={c.likeLabel()}
        onClick={handleLike}
      />
      <Charm
        Icon={icons.HandThumbsDown}
        label={c.dislikeLabel()}
        onClick={handleDislike}
      />
      <Charm
        Icon={icons.XCircle}
        label={c.deleteLabel()}
        onClick={handleDelete}
      />
      <Charm Icon={icons.Bug} label={c.debugLabel()} onClick={handleDebug} />
      {exchange.endTs && (
        <span>
          {c.secondsLabel({
            ts: ((exchange.endTs - exchange.startTs) / 1000) | 0,
          })}
        </span>
      )}
    </div>
  );
}
