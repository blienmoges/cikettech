FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN mkdir -p uploads backups

ENV NODE_ENV=production

EXPOSE 4000

CMD ["node", "server.js"]