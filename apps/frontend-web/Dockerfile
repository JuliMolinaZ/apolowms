# Stage 1: Dependencias
FROM node:18-alpine AS deps
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig*.json ./

# Instalar dependencias con legacy-peer-deps
RUN npm install --legacy-peer-deps

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copiar dependencias del stage anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar el directorio frontend completo
COPY . .

# Construir la aplicación
RUN npm run build

# Verificar que el build se completó correctamente
RUN ls -la .next

# Stage 3: Producción
FROM node:18-alpine AS production
WORKDIR /app

# Copiar archivos necesarios para producción
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Verificar la estructura del directorio /app
RUN ls -la /app

# Exponer puerto
EXPOSE 3000

# Comando para iniciar en producción
CMD ["npm", "start"]
