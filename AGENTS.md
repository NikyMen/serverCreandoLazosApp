# AGENTS.md

## Proyecto
Backend API de Creando Lazos construido con Node.js, Express, TypeScript y Prisma. Expone endpoints REST bajo `/api`, usa PostgreSQL como base de datos y Cloudinary para almacenar archivos de estudios.

## Stack principal
- Node.js 18+
- Express 4
- TypeScript
- Prisma
- PostgreSQL
- Cloudinary
- JWT para autenticacion
- Zod para validacion

## Estructura relevante
- `src/index.ts`: arranque del servidor y carga de entorno.
- `src/app.ts`: crea la app Express, registra middlewares y monta rutas bajo `/api`.
- `src/middlewares/auth.ts`: validacion de JWT y control de roles.
- `src/routes/auth.ts`: registro e inicio de sesion.
- `src/routes/admin.ts`: perfil del admin autenticado.
- `src/routes/users.ts`: listado y busqueda de usuarios.
- `src/routes/profiles.ts`: lectura y upsert de perfiles.
- `src/routes/studies.ts`: CRUD de estudios y subida/borrado en Cloudinary.
- `src/routes/gallery.ts`: listado, alta y borrado de elementos de galeria.
- `src/routes/events.ts`: CRUD de eventos.
- `prisma/schema.prisma`: modelos `User`, `Study`, `GalleryItem`, `Profile`, `Event`.
- `prisma/seed.ts`: carga de usuarios iniciales.
- `api/index.ts`: adaptador para despliegue serverless.
- `scripts/copy-prisma.js`: copia artefactos de Prisma al build final.

## Comandos utiles
- `npm run dev`: servidor en modo desarrollo con `tsx watch`.
- `npm run build`: compila TypeScript a `dist/`.
- `npm run start`: ejecuta el build compilado.
- `npm run prisma:generate`: genera cliente Prisma usando `../.env`.
- `npm run prisma:migrate`: corre migraciones en desarrollo.
- `npm run prisma:seed`: ejecuta el seed.
- `npm run prisma:deploy`: aplica migraciones en despliegue.

## Variables de entorno esperadas
- `DATABASE_URL`
- `JWT_SECRET`
- `CLOUDINARY_URL`
- `PORT`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `PATIENT_EMAIL`
- `PATIENT_PASSWORD`

## Convenciones para trabajar aqui
- Mantener todas las rutas de API bajo prefijo `/api`.
- Reutilizar el `PrismaClient` que se inyecta desde `src/app.ts` a cada router.
- Validar payloads con Zod antes de tocar base de datos o servicios externos.
- Respetar el estilo actual del proyecto: handlers simples por archivo, sin capas extra salvo que sea necesario.
- No editar `src/generated/prisma` manualmente; se regenera.
- Si se cambia el esquema Prisma, actualizar migracion o documentar si solo corresponde `prisma db push`.
- En endpoints que tocan archivos de estudios, considerar siempre el alta y borrado en Cloudinary ademas del registro en DB.

## Notas practicas
- El repositorio contiene un archivo previo llamado `agens.md`; el archivo correcto para instrucciones de agentes es este `AGENTS.md`.
- Hay configuracion de despliegue en `vercel.json`; validar compatibilidad serverless si se cambian puntos de entrada o dependencias de sistema.
- Puede haber cambios locales no relacionados en el arbol de trabajo; no revertirlos sin pedido explicito.
