import express from 'express';
import api from './routers/api.js';
import cors from 'cors';

const app = express();
app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);
app.use(express.json());
app.use('/api', api);

export default app;
