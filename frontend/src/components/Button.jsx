import DOM from '@utils/DOM.js';
import React, { useEffect, useRef } from 'react';
import * as Styles from './Button.scss';
import * as animation from '@styles/Animation.scss';

export default function Button({ className, children, onClick, href, type }) {
  const attr = DOM.attr(arguments[0]);
  const animationRef = useRef();

  if (href) {
    Object.assign(attr, { role: 'link' });
  }

  useEffect(() => {
    const node = animationRef.current;

    if (!node) {
      return;
    }

    const _onAnimationEnd = () => {
      node.classList.remove(animation.Bounce);
    };

    const _onClick = () => {
      node.classList.add(animation.Bounce);
    };

    node.addEventListener('animationend', _onAnimationEnd);
    node.addEventListener('click', _onClick);

    return () => {
      node.removeEventListener('animationend', _onAnimationEnd);
      node.removeEventListener('click', _onClick);
    };
  }, []);

  const _onClick = async (domEvent) => {
    if (href) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      window.location = href;
    } else {
      onClick && onClick(domEvent);
    }
  };

  return (
    <button
      ref={animationRef}
      className={DOM.classNames(className, Styles.Button)}
      type={type || 'button'}
      onClick={_onClick}
      {...attr}
    >
      {children}
    </button>
  );
}
