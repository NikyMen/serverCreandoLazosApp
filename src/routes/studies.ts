import { Router, type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  url: process.env.CLOUDINARY_URL,
  secure: true,
});

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  base64: z.string().min(10),
  type: z.string().optional(),
  date: z.string().optional(),
});

export default function studiesRouter(prisma: PrismaClient) {
  const router = Router();

  router.get('/', async (req: Request, res: Response) => {
    const email = typeof req.query.email === 'string' ? req.query.email : undefined;
    const studies = await prisma.study.findMany({
      ...(email ? { where: { forEmail: email } } : {}),
      orderBy: { createdAt: 'desc' },
    });
    res.json(studies);
  });

  router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const study = await prisma.study.findUnique({ where: { id } });
    if (!study) return res.status(404).json({ error: 'Not found' });
    res.json(study);
  });

  router.post('/', async (req: Request, res: Response) => {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const { name, email, base64, type, date } = parsed.data;
    try {
      const id = cryptoRandomId();
      // Assume PDF if not specified, or extract from base64 if possible
      const mimeType = 'application/pdf'; 
      const dataUri = `data:${mimeType};base64,${base64}`;
      const uploaded = await cloudinary.uploader.upload(dataUri, {
        folder: 'studies',
        resource_type: 'raw',
        public_id: id,
        overwrite: true,
      });
      const fileUrl = uploaded.secure_url;
      const cloudinaryId = uploaded.public_id;
      const created = await prisma.study.create({
        data: { 
          id, 
          name, 
          mimeType, 
          forEmail: email, 
          fileUrl, 
          cloudinaryId,
          type,
          date
        },
      });
      res.status(201).json(created);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo guardar el archivo' });
    }
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const study = await prisma.study.findUnique({ where: { id } });
    if (!study) return res.status(404).json({ error: 'Not found' });
    try {
      await cloudinary.uploader.destroy(study.id, { resource_type: 'raw' });
    } catch {}
    await prisma.study.delete({ where: { id } });
    res.status(204).end();
  });

  return router;
}

function cryptoRandomId() {
  try {
    // @ts-ignore
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  } catch {}
  return `st_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}