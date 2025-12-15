
FROM node:20-slim AS builder

# Install OpenSSL for Prisma
RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app
#Stage 1: build the application

# Define arguments for build
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
# # Stage 1: Install Dependencies

# # Copy source code
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY src ./src

# # Generate Prisma Client and build TypeScript
RUN npm run cloud:build

# Stage 2: Production Dependencies


# Stage 4: Production Runtime
FROM node:20-slim AS production

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
# Install OpenSSL for Prisma runtime
RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

# Copy production dependencies
COPY --from=builder /app/node_modules ./node_modules

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Copy Prisma files for migrations
COPY --from=builder /app/prisma ./prisma
# COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
# Set ownership to non-root user
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose application port
EXPOSE 3003

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3003/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Start application (with Prisma migration)
# CMD ["sh", "-c", "npm run render:start"]
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]