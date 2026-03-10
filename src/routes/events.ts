import { Router, type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const eventSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  date: z.string().min(1),
  type: z.string().optional(),
});

export default function eventsRouter(prisma: PrismaClient) {
  const router = Router();

  // GET /events
  router.get('/', async (_req: Request, res: Response) => {
    try {
      const events = await prisma.event.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.json(events);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener eventos' });
    }
  });

  // POST /events
  router.post('/', async (req: Request, res: Response) => {
    const parsed = eventSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    try {
      const event = await prisma.event.create({
        data: parsed.data
      });
      res.status(201).json(event);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al crear evento' });
    }
  });

  // PUT /events/:id
  router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const parsed = eventSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    try {
      const event = await prisma.event.update({
        where: { id },
        data: parsed.data
      });
      res.json(event);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al actualizar evento' });
    }
  });

  // DELETE /events/:id
  router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await prisma.event.delete({
        where: { id }
      });
      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(404).json({ error: 'Evento no encontrado' });
    }
  });

  return router;
}
