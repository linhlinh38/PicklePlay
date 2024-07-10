FROM node:latest AS builder

WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . .

RUN npm run build
RUN chmod -R 755 /app/build

FROM node:latest

ENV NODE_ENV production
USER node

WORKDIR /app

COPY package*.json ./
RUN npm i 

COPY --from=builder /app/build ./build
EXPOSE 3004

CMD [ "npm", "start" ]