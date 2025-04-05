import '@styles/Color.scss';
import '@styles/Typography.scss';
import Logger from '@utils/Logger.js';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'reset-css';
import App from './App/App';
import Chat from './App/Chat/Chat.jsx';
import './index.css';
import Tab from './App/Tab.jsx';

const BASENAME = '/';
const _logger = new Logger('index');
const $root = document.querySelector('#root');
const root = createRoot($root);

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <App>
          <Chat />
        </App>
      ),
    },
    {
      path: '/tab',
      element: (
        <Tab>
          <App>
            <Chat />
          </App>
        </Tab>
      ),
    },
  ],
  { basename: BASENAME },
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

window.root = root;
