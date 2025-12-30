
FROM node:20-slim AS builder

# Install OpenSSL for Prisma
RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app
#Stage 1: build the application

# Define arguments for build
ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DATABASE_URL=${DATABASE_URL}
# # Stage 1: Install Dependencies

# # Copy source code
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma/ ./prisma
COPY prisma.config.ts ./
RUN npm install
COPY src/ ./src

# # Generate Prisma Client and build TypeScript
RUN npx prisma generate
RUN npm run build
COPY dist/ ./dist

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
COPY --from=builder /app/dist/ ./dist
COPY --from=builder /app/package*.json ./

# Copy Prisma files for migrations
COPY --from=builder /app/prisma/* ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
RUN ls -la dist 
RUN cat dist/server.js
# Set ownership to non-root user
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose application port
EXPOSE 3003

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD curl -f http://localhost:3003/api/v1/admin/department || exit 1

# Start application (with Prisma migration)

CMD ["sh", "-c", "npm run render:start"]