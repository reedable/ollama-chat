import { useLocalStorage } from '@hooks/useStorage';
import useZoom from '@hooks/useZoom';
import Logger from '@utils/Logger';
import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Styles from './App.scss';
import HeartbeatProvider from './HeartbeatProvider';

export default function App({ children }) {
  const _logger = new Logger('App');
  const location = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef();
  const [pathname, setPathname] = useLocalStorage('BL.App.pathname');

  void useZoom();

  useEffect(() => {
    if (pathname !== null && pathname !== location.pathname) {
      _logger.log(`navigate to ${pathname}`);
      navigate(pathname);
    }
  }, []);

  useEffect(() => {
    _logger.log(location);
    setPathname(location.pathname);
  }, [location]);

  useEffect(() => {
    const contentDiv = contentRef.current;

    if (contentDiv) {
      const h1 = contentDiv.querySelector('h1[tabindex]');

      if (h1) {
        h1.focus();
      }
    }
  }, [location]);

  useEffect(() => {
    const contentDiv = contentRef.current;

    if (contentDiv) {
      const rem = parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      );

      const viewportHeight = window.innerHeight - 4.75 * rem;
      const contentHeight = contentDiv.offsetHeight;

      if (viewportHeight < contentHeight) {
        contentDiv.classList.add(Styles.Bottom);
      }
    }
  }, []);

  return (
    <HeartbeatProvider>
      <div className={Styles.App} ref={contentRef}>
        {children}
      </div>
    </HeartbeatProvider>
  );
}
