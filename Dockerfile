# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:20

# Create and change to the app directory.
WORKDIR /app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

RUN npm run build
# Run the web service on container startup.
CMD [ "npm", "run", "start" ]

# Expose the port the app runs on
EXPOSE 3004