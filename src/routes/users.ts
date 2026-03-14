import { Router, type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';

export default function usersRouter(prisma: PrismaClient) {
  const router = Router();

  // GET /users
  router.get('/', async (req: Request, res: Response) => {
    const { query } = req.query;
    try {
      if (query && typeof query === 'string') {
        const q = query.toLowerCase();
        const users = await prisma.user.findMany({
          where: {
            OR: [
              { email: { contains: q, mode: 'insensitive' } },
              { name: { contains: q, mode: 'insensitive' } },
              { dni: { contains: q, mode: 'insensitive' } }
            ]
          },
          select: {
            id: true,
            name: true,
            dni: true,
            email: true,
            role: true,
          },
          take: 20
        });
        return res.json(users);
      }

      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          dni: true,
          email: true,
          role: true,
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
          id: true,
          name: true,
          dni: true,
          email: true,
          role: true,
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
