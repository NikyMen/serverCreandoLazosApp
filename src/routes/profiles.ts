import { Router, type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const profileSchema = z.object({
  correo: z.string().email(),
  nombreApellido: z.string().min(1),
  cuilDni: z.string().min(1),
  obraSocial: z.string().min(1),
  diagnostico: z.string().min(1),
  servicio: z.string().min(1),
  cudNumero: z.string().min(1),
  cudVencimiento: z.string().min(1),
  cudAcompanante: z.string().min(1),
});

export default function profilesRouter(prisma: PrismaClient) {
  const router = Router();

  // GET /profiles?email=...&query=...
  router.get('/', async (req: Request, res: Response) => {
    const { email, query } = req.query;
    try {
      if (email && typeof email === 'string') {
        const profile = await prisma.profile.findUnique({
          where: { correo: email }
        });
        if (!profile) return res.status(404).json({ error: 'Perfil no encontrado' });
        return res.json(profile);
      }

      if (query && typeof query === 'string') {
        const q = query.toLowerCase();
        const profiles = await prisma.profile.findMany({
          where: {
            OR: [
              { nombreApellido: { contains: q, mode: 'insensitive' } },
              { correo: { contains: q, mode: 'insensitive' } },
              { cuilDni: { contains: q, mode: 'insensitive' } }
            ]
          },
          orderBy: { nombreApellido: 'asc' },
          take: 20
        });
        return res.json(profiles);
      }

      const profiles = await prisma.profile.findMany({
        orderBy: { nombreApellido: 'asc' }
      });
      res.json(profiles);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener perfiles' });
    }
  });

  // POST /profiles
  router.post('/', async (req: Request, res: Response) => {
    const parsed = profileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    try {
      const profile = await prisma.profile.upsert({
        where: { correo: parsed.data.correo },
        update: parsed.data,
        create: parsed.data,
      });
      res.json(profile);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al guardar el perfil' });
    }
  });

  return router;
}
