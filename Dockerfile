# --- Stage 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package management files
COPY package.json package-lock.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy application source
COPY . .

# Run build process (includes Admin)
# Note: We use a placeholder for MEDUSA_ADMIN_BACKEND_URL during build
# which will be replaced at runtime by entrypoint.sh
ENV MEDUSA_ADMIN_BACKEND_URL=http://localhost:9000
RUN npm run build

# --- Stage 2: Production ---
FROM node:20-alpine AS runner

WORKDIR /app

# Install production dependencies only
RUN apk add --no-cache curl

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy built artifacts from the builder stage
COPY --from=builder /app/.medusa ./.medusa
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh

# Ensure entrypoint is executable
RUN chmod +x ./entrypoint.sh

# Expose the default Medusa port
EXPOSE 9000

# Set environment variables
ENV NODE_ENV=production

# Use the entrypoint script for runtime configuration and startup
ENTRYPOINT ["./entrypoint.sh"]
