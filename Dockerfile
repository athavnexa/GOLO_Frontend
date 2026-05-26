# ==============================
# Builder Stage
# ==============================
FROM node:20-bullseye-slim AS builder

ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app

# Install build dependencies for native packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    build-essential \
    git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application source
COPY . .

# Build Next.js app
RUN npm run build


# ==============================
# Production Stage
# ==============================
FROM node:20-bullseye-slim AS runner

ENV NODE_ENV=production
ENV PORT=3001

WORKDIR /app

# Install curl only for health checks
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r nextjs && useradd -r -g nextjs -d /app -s /usr/sbin/nologin nextjs

# Copy standalone build
COPY --from=builder /app/.next/standalone ./

# Copy Next static assets
COPY --from=builder /app/.next/static ./.next/static

# Copy public assets
COPY --from=builder /app/public ./public

# Set permissions
RUN chown -R nextjs:nextjs /app

# Switch to non-root user
USER nextjs

# Expose app port
EXPOSE 3001

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:3001/ || exit 1

# Start app
CMD ["node", "server.js"]