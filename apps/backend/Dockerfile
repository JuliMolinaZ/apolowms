# Stage 1: build the application
FROM node:18-alpine AS builder
WORKDIR /app

# Instalar NestJS CLI globalmente
RUN npm install -g @nestjs/cli

# Copiamos el package.json y el tsconfig (y la carpeta prisma) para instalar dependencias
COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma/

# Instalamos dependencias (sin omitir dev, para que se genere el cliente Prisma)
RUN npm install

# Copiamos el resto del código
COPY . .

# Regeneramos el cliente Prisma
RUN npx prisma generate

# Ejecutamos el build de NestJS
RUN nest build

# Stage 2: producción
FROM node:18-alpine AS production
WORKDIR /app

# Copiar archivos necesarios
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Verificar que la estructura de dist es correcta
RUN ls -la dist/src

# Exponer puerto
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "run", "start:prod"]
