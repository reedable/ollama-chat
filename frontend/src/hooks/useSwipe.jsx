import { useEffect, useRef, useState } from 'react';

const DEFAULT_MIN_SWIPE_DISTANCE = 60;
const DEFAULT_RELATIVE_SWIPE_DIRECTION = 3;

export default function useSwipe(
  minSwipeDistance = DEFAULT_MIN_SWIPE_DISTANCE,
) {
  const [swipe, setSwipe] = useState(null);
  const [start, setStart] = useState({});
  const [end, setEnd] = useState({});
  const ref = useRef(null);

  function onTouchStart(domEvent) {
    const { pageX, pageY } = domEvent.changedTouches[0];
    setStart({ pageX, pageY });
  }

  function onTouchEnd(domEvent) {
    const { pageX, pageY } = domEvent.changedTouches[0];
    setEnd({ pageX, pageY });
  }

  function reset(value = null) {
    setSwipe(value);
  }

  useEffect(() => {
    const x = end.pageX - start.pageX;
    const y = end.pageY - start.pageY;
    const absX = Math.abs(x);
    const absY = Math.abs(y);

    if (
      absX / absY > DEFAULT_RELATIVE_SWIPE_DIRECTION &&
      absX > minSwipeDistance
    ) {
      if (x < 0) {
        setSwipe('left');
      } else {
        setSwipe('right');
      }
    } else if (
      absY / absX > DEFAULT_RELATIVE_SWIPE_DIRECTION &&
      absY > minSwipeDistance
    ) {
      if (y < 0) {
        setSwipe('up');
      } else {
        setSwipe('down');
      }
    }
  }, [end]);

  useEffect(() => {
    const el = ref.current;

    if (el) {
      el.addEventListener('touchstart', onTouchStart, { passive: true });
      el.addEventListener('touchend', onTouchEnd, { passive: true });
    }

    return () => {
      if (el) {
        el.removeEventListener('touchstart', onTouchStart);
        el.removeEventListener('touchend', onTouchEnd);
      }
    };
  }, []);

  return [ref, swipe, reset];
}
