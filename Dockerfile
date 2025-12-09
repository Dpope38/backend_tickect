FROM node:20-slim

# Install OpenSSL for Prisma
RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma

# Copy application source code
COPY . .

# Generate Prisma Client and run build
RUN npm run cloud:build

# Expose port
EXPOSE 3003

# Start the application
CMD ["npm", "run", "render:start"]