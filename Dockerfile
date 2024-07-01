FROM node:latest AS builder

WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . .

RUN npm run build

FROM node:latest

ENV NODE_ENV production
USER node

WORKDIR /app

COPY package*.json ./
RUN npm i 

COPY --from=builder /app/build ./build
EXPOSE 3000 

CMD [ "node", "build/index.js" ]