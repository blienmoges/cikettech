# CIKETTECH backend — single-stage image (a plain Express/SQLite API has no
# build step of its own).
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN mkdir -p uploads backups

ENV NODE_ENV=production
EXPOSE 4000

# data.sqlite, uploads/, and backups/ should be mounted as a volume in
# production so content survives container restarts/redeploys — see
# docker-compose.yml at the repo root for an example.
CMD ["node", "server.js"]
