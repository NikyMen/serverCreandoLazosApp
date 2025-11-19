import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { createApp } from './app.js';
import path from 'path';
import { fileURLToPath } from 'url';
import serveStatic from 'serve-static';

const app = createApp();

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});