import logger from '../services/logger.js';

// TODO Send x-request-id from UI side
export default function prepareLogger(req, res, next) {
  req.logger = logger.child({
    requestId: req.headers['x-request-id'] || Date.now().toString(36),
  });
  next();
}
