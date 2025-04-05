# Use official Node.js LTS as base image
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --only=production
COPY . .
COPY .env.docker ./.env

# Expose the port your application will run on
EXPOSE 3000

# Define environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", "server.js"]
