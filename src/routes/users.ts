import { Router, type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';

export default function usersRouter(prisma: PrismaClient) {
  const router = Router();

  // GET /users
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
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  });

  // GET /users/list
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
      res.status(500).json({ error: 'Error al obtener lista de usuarios' });
    }
  });

  return router;
}
