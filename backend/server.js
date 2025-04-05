import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import https from 'https';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './src/app.js';
import logger from './src/services/logger.js';

// Load and validate .env
dotenv.config();

const { PORT, HTTPS, SSL_KEY_FILESPEC, SSL_CERT_FILESPEC, MONGO_URI } =
  process.env;

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up HTTPS
const opts = {};

if (HTTPS) {
  const key = fs.readFileSync(SSL_KEY_FILESPEC);
  const cert = fs.readFileSync(SSL_CERT_FILESPEC);
  Object.assign(opts, { key, cert });
}

// Serve static frontend files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));

mongoose
  .connect(MONGO_URI) // 'mongodb://localhost:27017/ollama-db'
  .then(() => logger.info('Connected to MongoDB'))
  .catch((error) => logger.error({ error }, 'MongoDB connection failure'));

// Start HTTPS server
if (HTTPS) {
  https.createServer(opts, app).listen(PORT, () => {
    logger.info(`[backend] Server running on https://localhost:${PORT}`);
  });
} else {
  // Start HTTP server
  app.listen(PORT, () => {
    logger.info(`[backend] Server running on http://localhost:${PORT}`);
  });
}
