# Stage 1: build and test the Next.js app
FROM node:18-alpine AS builder
WORKDIR /app
# Copiamos dependencias y script de setup
COPY package*.json ./
COPY setup.sh ./
# Instalamos dependencias de desarrollo y produccion
RUN npm run setup
# Copiamos el resto del codigo
COPY . .
# Ejecutamos lint y pruebas antes de compilar
RUN npm run lint && npm test


RUN npm run lint && npm test

RUN npm run build

# Stage 2: contenedor liviano para producción
FROM node:18-alpine AS production
WORKDIR /app
COPY package*.json ./
# Instalamos solo dependencias de produccion
RUN npm ci --omit=dev
# Copiamos la app compilada desde la etapa anterior
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
EXPOSE 3000
CMD ["npm", "start"]
