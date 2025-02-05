import DOM from '@utils/DOM';
import React, { useEffect, useRef } from 'react';
import * as Styles from './Button.scss';
import * as AnimationStyles from '@styles/Animation.scss';

export default function Button({ className, children, onClick, href, type }) {
  const attr = DOM.attr(arguments[0]);
  const animationRef = useRef();

  if (href) {
    Object.assign(attr, { role: 'link' });
  }

  useEffect(() => {
    const node = animationRef.current;

    const onAnimationEnd = () => {
      node.classList.remove(AnimationStyles.Bounce);
    };

    const onFocus = () => {
      node.classList.add(AnimationStyles.Bounce);
    };

    const onBlur = () => {
      node.classList.remove(AnimationStyles.Bounce);
    };

    node.addEventListener('animationend', onAnimationEnd);
    node.addEventListener('focus', onFocus);
    node.addEventListener('click', onFocus);
    node.addEventListener('blur', onBlur);

    return () => {
      node.removeEventListener('animationend', onAnimationEnd);
      node.removeEventListener('focus', onFocus);
      node.removeEventListener('click', onFocus);
      node.removeEventListener('blur', onBlur);
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
