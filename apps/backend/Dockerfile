# Stage 1: build and test the application
FROM node:18-alpine AS builder
WORKDIR /app
# Copiamos archivos de dependencias y el script de setup
COPY package*.json ./
COPY setup.sh ./
# Instalamos dependencias de desarrollo y produccion
RUN npm run setup && npm rebuild bcrypt --update-binary
# Copiamos el resto del codigo
COPY . .
# Ejecutamos lint y tests para validar
RUN npm run lint && npm test

RUN npm run lint && npm test

RUN npm run build

# Stage 2: imagen liviana para produccion
FROM node:18-alpine AS production
WORKDIR /app
COPY package*.json ./
# Instalamos solo dependencias de produccion
RUN npm ci --omit=dev && npm rebuild bcrypt --update-binary
# Copiamos el artefacto compilado desde la etapa anterior
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
