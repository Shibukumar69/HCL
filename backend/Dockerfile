# Production Dockerfile for Node.js Backend
FROM node:20-alpine

# Working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application source code
COPY . .

# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "index.js"]
