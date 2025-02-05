import DOM from '@utils/DOM';
import React from 'react';
import * as Styles from './IconButton.scss';

export default function IconButton({ className, children, onClick }) {
  return (
    <div className={DOM.classNames(className, Styles.IconButton)}>
      <button type="button" onClick={onClick}>
        {children}
      </button>
    </div>
  );
}
