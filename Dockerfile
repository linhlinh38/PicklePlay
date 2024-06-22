FROM node:latest AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:latest

WORKDIR /app

COPY --from=builder /app/build . 
EXPOSE 3000 

COPY package*.json ./
RUN npm ci --production

CMD [ "npm", "run dev" ]