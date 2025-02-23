import express from 'express';
import api from './routers/api.js';
import cors from 'cors';
import helmet from 'helmet';
import setTeamsHeaders from './middlewares/setTeamsHeaders.js';

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: 'https://localhost:8080',
    credentials: true,
  }),
);

app.use(express.json());
app.use(setTeamsHeaders);
app.use('/api', api);

export default app;
