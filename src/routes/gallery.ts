import { Router, type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const createGallerySchema = z.object({
  email: z.string().email(),
  uri: z.string().url(),
  title: z.string().min(1),
  type: z.enum(['activity', 'session', 'event']),
  date: z.string().min(1)
});

export default function galleryRouter(prisma: PrismaClient) {
  const router = Router();

  // GET /gallery?email=...
  router.get('/', async (req: Request, res: Response) => {
    const { email } = req.query;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required as a query parameter' });
    }

    try {
      const items = await prisma.galleryItem.findMany({
        where: { email },
        orderBy: { createdAt: 'desc' }
      });
      res.json(items);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error fetching gallery' });
    }
  });

  // POST /gallery
  router.post('/', async (req: Request, res: Response) => {
    const parsed = createGallerySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    try {
      const newItem = await prisma.galleryItem.create({
        data: parsed.data
      });
      res.status(201).json(newItem);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error saving gallery item' });
    }
  });

  // DELETE /gallery/:id
  router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await prisma.galleryItem.delete({
        where: { id }
      });
      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(404).json({ error: 'Gallery item not found' });
    }
  });

  return router;
}
