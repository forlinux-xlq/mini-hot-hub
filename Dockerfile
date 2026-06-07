FROM node:20-alpine

WORKDIR /app

COPY server/package*.json ./server/
RUN cd server && npm install --production

COPY server/ ./server/

COPY index.js .
COPY package.json .

EXPOSE 3001

CMD ["node", "index.js"]
