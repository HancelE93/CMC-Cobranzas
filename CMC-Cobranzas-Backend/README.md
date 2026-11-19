# CMC Cobranzas — Backend API

Backend del sistema integral de cobranzas, conciliación bancaria y trazabilidad de CMC Cobranzas. Desarrollado con **NestJS 11**, **Prisma 7** (driver adapters PostgreSQL), **TypeScript** y arquitectura hexagonal / por capas.

---

## 1. Requisitos previos

- **Node.js**: v22 LTS o superior (v24 compatible)
- **Gestor de paquetes**: `npm` o `pnpm`
- **Docker**: para la base de datos PostgreSQL local

---

## 2. Configuración inicial

1. **Instalar dependencias:**
   ```bash
   npm install
   # o si prefieres pnpm:
   # pnpm install
   ```

2. **Variables de entorno:**
   Copia el archivo de ejemplo y ajusta credenciales si es necesario:
   ```bash
   cp .env.example .env
   ```

3. **Levantar PostgreSQL con Docker:**
   ```bash
   docker compose up -d
   ```

4. **Sincronizar y generar cliente de Prisma:**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

---

## 3. Comandos de desarrollo

```bash
# Iniciar en modo desarrollo con watch/recarga en caliente
npm run start:dev

# Compilar el proyecto TypeScript a JavaScript
npm run build

# Iniciar en modo producción
npm run start:prod

# Abrir Prisma Studio para inspeccionar la base de datos
npm run prisma:studio

# Ejecutar pruebas unitarias
npm run test
```

---

## 4. Documentación de la API (Swagger)

Una vez iniciado el servidor (`npm run start:dev` o `npm run start:prod`), la documentación interactiva Swagger está disponible en:

- URL: **`http://localhost:3000/api/docs`**

Endpoints disponibles inicialmente:
- `GET /health` (Estado de salud del backend)
- `POST /auth/register` (Registro de usuario con rol y hash bcrypt)
- `POST /auth/login` (Inicio de sesión, entrega access token en body y refresh token en cookie httpOnly)
- `POST /auth/refresh` (Rotación segura de tokens mediante cookie)
- `POST /auth/logout` (Cierre de sesión y limpieza de cookies)
- `GET /auth/me` (Consulta de perfil de usuario autenticado)

---

## 5. Arquitectura del Proyecto

Arquitectura por capas dentro de cada módulo (`src/modules/<feature>/`):

```
src/
  main.ts                     # Bootstrap, Swagger, CORS, ValidationPipe
  app.module.ts               # Módulo raíz, guards y filtros globales
  context/
    config/                   # Configuración y validación class-validator de .env
    database/                 # PrismaService y PrismaModule con PostgreSQL adapter
  common/                     # Decoradores (@Public, @CurrentUser), guards, filtros
  modules/
    health/                   # Health check endpoint
    auth/                     # Autenticación, JWT, rotación de cookies y bcrypt
```

Consulta las directrices de código limpio en [`CLEANCODE.md`](./CLEANCODE.md).

