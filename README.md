# ApoloWMS Monorepo

This repository is managed with [Nx](https://nx.dev) and contains multiple applications and shared libraries.

## Project layout

```
apps/
  backend/         NestJS REST/Socket API (Node.js)
  frontend-web/    Next.js + Electron web client
  frontend-mobile/ Expo React Native mobile client
libs/
  shared/          Shared utilities and types
packages/          External packages (currently empty)
```

The `docker-compose.yml.example` file provides a development stack with MySQL, the backend API and the web frontend.

## Running with Docker Compose

1. Copy the example compose file:

   ```bash
   cp docker-compose.yml.example docker-compose.yml
   ```
2. Edit `docker-compose.yml` to set the desired database name and password.
3. Start the services:

   ```bash
   docker-compose up -d
   ```

This will build the backend and frontend images and start MySQL. The backend container exposes port `3000` and the web frontend runs on port `3001`.

## Seeding the database

After the containers are running, seed the database from inside the backend container:

```bash
docker-compose exec backend npx prisma db seed
```

You can also run the same command locally from the `apps/backend` folder if you
are not using Docker.

This script populates the MySQL database with initial demo data used by the applications.

## Running apps locally

You can also run the projects without Docker. Install dependencies at the repo root and within each app (requires Node 18+ and npm):

```bash
npm install
cd apps/backend && npm install
cd ../frontend-web && npm install
cd ../frontend-mobile && npm install
```

### Backend

```bash
cd apps/backend
npm run start:dev
```

### Web frontend

```bash
cd apps/frontend-web
npm run dev
```

### Mobile app

```bash
cd apps/frontend-mobile
npm run start
```

The mobile project uses Expo so you can open it with the Expo client on a device or emulator.

