import * as animationStyles from '@styles/Animation.scss';
import React, { useEffect, useRef } from 'react';
import * as styles from './Charm.scss';

export default function Charm({ Icon, label, onClick }) {
  const animationRef = useRef(null);

  const handleClick = (domEvent) => {
    animationRef.current.addEventListener(
      'animationend',
      () => onClick(domEvent),
      { once: true },
    );
  };

  useEffect(() => {
    const node = animationRef.current;

    if (!node) {
      return;
    }

    const _onClick = () => {
      node.classList.add(animationStyles.Bounce);
    };

    const _onAnimationEnd = () => {
      node.classList.remove(animationStyles.Bounce);
    };

    node.addEventListener('animationend', _onAnimationEnd);
    node.addEventListener('click', _onClick);

    return () => {
      node.removeEventListener('animationend', _onAnimationEnd);
      node.removeEventListener('click', _onClick);
    };
  }, []);

  return (
    <button
      ref={animationRef}
      onClick={handleClick}
      className={styles.Charm}
      aria-label={label}
    >
      <Icon />
    </button>
  );
}
