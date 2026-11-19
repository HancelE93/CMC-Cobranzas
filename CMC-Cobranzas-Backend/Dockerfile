# Etapa 1: build
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma

ENV DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build"

RUN npm ci || npm install

COPY . .

RUN npm run build
RUN npm prune --omit=dev

# Etapa 2: runtime
FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/prisma ./prisma

USER node
EXPOSE 3000
CMD ["node", "dist/src/main"]

