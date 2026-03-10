import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, type AuthRequest } from '../middlewares/auth.js';

export default function adminRouter(prisma: PrismaClient) {
  const router = Router();

  router.get('/profile', authMiddleware(['ADMIN']), async (req: AuthRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, email: true, role: true },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error fetching profile' });
    }
  });

  return router;
}
