import pino from 'pino';

// TODO Define config in .env
const logger = pino({
  level: 'DEBUG',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true, singleLine: true },
  },
});

export default logger;
