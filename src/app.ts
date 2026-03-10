import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';
import serveStatic from 'serve-static';
import authRouter from './routes/auth.js';
import studiesRouter from './routes/studies.js';
import usersRouter from './routes/users.js';
import profilesRouter from './routes/profiles.js';
import adminRouter from './routes/admin.js';
import galleryRouter from './routes/gallery.js';
import eventsRouter from './routes/events.js';

export function createApp() {
  const app = express();
  const prisma = new PrismaClient();

  app.use(cors({ origin: '*' }));
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ limit: '20mb', extended: true }));

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  app.use('/uploads', serveStatic(path.join(__dirname, '../uploads')));

  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  // Prefijo /api para todas las rutas
  const apiRouter = express.Router();
  app.use('/api', apiRouter);

  apiRouter.use('/auth', authRouter(prisma));
  apiRouter.use('/studies', studiesRouter(prisma));
  apiRouter.use('/users', usersRouter(prisma));
  apiRouter.use('/profiles', profilesRouter(prisma));
  apiRouter.use('/admin', adminRouter(prisma));
  apiRouter.use('/gallery', galleryRouter(prisma));
  apiRouter.use('/events', eventsRouter(prisma));

  return app;
}

const app = createApp();

export default app;
