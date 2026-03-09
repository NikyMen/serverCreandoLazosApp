import { Router, type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';

export default function profilesRouter(prisma: PrismaClient) {
  const router = Router();

  // GET /profiles
  router.get('/', async (_req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          email: true,
        },
      });
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener perfiles' });
    }
  });

  // GET /profiles/list
  router.get('/list', async (_req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          email: true,
        },
      });
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener lista de perfiles' });
    }
  });

  return router;
}
