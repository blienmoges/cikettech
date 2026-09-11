FROM node:22-alpine

WORKDIR /app

# Required for native packages such as better-sqlite3
RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production

EXPOSE 4000

CMD ["node", "server.js"]