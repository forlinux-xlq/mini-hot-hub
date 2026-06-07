FROM node:20-alpine

WORKDIR /app

COPY server/package.json ./server/package.json
COPY server/package-lock.json ./server/package-lock.json

RUN cd server && npm ci --only=production

COPY server/src ./server/src
COPY server/services ./server/services
COPY server/utils ./server/utils

COPY index.js .
COPY package.json .

EXPOSE 80

ENV NODE_ENV=production
ENV PORT=80

CMD ["node", "index.js"]