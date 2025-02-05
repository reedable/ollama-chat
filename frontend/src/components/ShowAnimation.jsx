import React, { useEffect, useRef } from 'react';

export default function ShowAnimation({ trigger, children, expand, collapse }) {
  const animationRef = useRef();

  const onAnimationEnd = () => {
    const el = animationRef.current;

    if (el) {
      if (el.classList.contains(collapse)) {
        el.hidden = true;
      }
    }
  };

  useEffect(() => {
    const el = animationRef.current;

    if (el) {
      if (trigger) {
        el.removeAttribute('hidden');
        el.classList.remove(collapse);
        el.classList.add(expand);
      } else {
        el.classList.remove(expand);
        el.classList.add(collapse);
        el.addEventListener('animationend', onAnimationEnd, { once: true });
      }
    }
  }, [trigger]);

  return (
    <div hidden ref={animationRef}>
      {children}
    </div>
  );
}
