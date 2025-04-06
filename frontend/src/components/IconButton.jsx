import { getClassNames } from '@utils/DOM.js';
import React from 'react';
import * as Styles from './IconButton.scss';

export default function IconButton({ className, children, onClick }) {
  return (
    <div className={getClassNames(className, Styles.IconButton)}>
      <button type="button" onClick={onClick}>
        {children}
      </button>
    </div>
  );
}
