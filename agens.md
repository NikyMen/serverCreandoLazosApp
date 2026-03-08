# Agens

## Resumen
Este proyecto es un servidor API en Node.js/TypeScript para autenticación y gestión de estudios (PDF) que se almacenan en Cloudinary y se registran en una base PostgreSQL mediante Prisma.

## Estructura principal
- `src/index.ts`: punto de entrada del servidor HTTP.
- `src/app.ts`: configuración de Express, middlewares, rutas y estáticos.
- `src/routes/auth.ts`: registro e inicio de sesión.
- `src/routes/studies.ts`: CRUD básico de estudios con subida a Cloudinary.
- `prisma/schema.prisma`: modelos de datos.
- `prisma/seed.ts`: creación/actualización de usuarios iniciales.
- `scripts/copy-prisma.js`: copia del cliente Prisma generado a `dist/`.
- `api/index.ts`: adaptador para despliegue en Vercel.
- `render.yaml` / `vercel.json`: configuración de despliegue.

## Flujo de la API
1. `src/index.ts` carga variables de entorno y arranca el servidor.
2. `src/app.ts` crea la app, añade CORS, JSON, static `/uploads` y expone rutas.
3. Rutas:
   - `/auth`: autenticación con JWT.
   - `/studies`: lista, consulta, crea y elimina estudios.

## Endpoints
### Auth
- `POST /auth/register`: crea usuario (email, password, role).
- `POST /auth/login`: valida credenciales y devuelve JWT.

### Studies
- `GET /studies`: lista estudios, opcionalmente filtrado por `forEmail`.
- `GET /studies/:id`: devuelve un estudio por id.
- `POST /studies`: sube PDF a Cloudinary y crea registro.
- `DELETE /studies/:id`: elimina en Cloudinary y en base de datos.

## Base de datos
Modelos en Prisma:
- `User`: usuarios con hash de contraseña y rol.
- `Study`: estudios con URL y metadata.

## Variables de entorno
- `DATABASE_URL`: conexión PostgreSQL.
- `JWT_SECRET`: firma de tokens.
- `CLOUDINARY_URL`: credenciales de Cloudinary.
- `PORT`: puerto del servidor.
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `PATIENT_EMAIL`, `PATIENT_PASSWORD`: seed.

## Scripts
En `package.json`:
- `dev`: servidor en modo watch con TSX.
- `build`: compila TypeScript.
- `postbuild`: copia Prisma generado a `dist`.
- `prisma:*`: migraciones, generate y seed.

## Deploy
Se proveen configuraciones para Render (`render.yaml`) y Vercel (`vercel.json`).
