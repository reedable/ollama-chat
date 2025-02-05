import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import DOM from '@utils/DOM';
import * as Styles from './Link.scss';
import * as ButtonStyles from '@components/Button.scss';

export default function Link({ className, children, href, onClick }) {
  return /^https:/.test(href) ? (
    <a
      className={DOM.classNames(Styles.Link, className)}
      href={href}
      onClick={onClick}
    >
      {children}
    </a>
  ) : (
    <RouterLink
      className={DOM.classNames(Styles.Link, className)}
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
    className: DOM.classNames(Styles.ButtonLink, className),
  });
}
