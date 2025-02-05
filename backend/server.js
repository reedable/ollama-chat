import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import app from './src/app.js';

// Load and validate .env
dotenv.config();

const { PORT } = process.env;

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));

mongoose
  .connect('mongodb://localhost:27017/ollama-db')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection failure', error));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
