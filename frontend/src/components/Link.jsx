import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getClassNames } from '@utils/DOM.js';
import * as Styles from './Link.scss';
import * as ButtonStyles from '@components/Button.scss';

export default function Link({ className, children, href, onClick }) {
  return /^https:/.test(href) ? (
    <a
      className={getClassNames(Styles.Link, className)}
      href={href}
      onClick={onClick}
    >
      {children}
    </a>
  ) : (
    <RouterLink
      className={getClassNames(Styles.Link, className)}
      to={href}
      onClick={onClick}
    >
      {children}
    </RouterLink>
  );
}

export function ButtonLink({ className }) {
  return Link({
    ...arguments[0],
    className: getClassNames(Styles.ButtonLink, className),
  });
}
