# --- BUILD STAGE ---
# Using Debian Bookworm-Slim for updated package repositories and faster network mirrors
FROM node:20-bookworm-slim AS builder

ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /app

# Switch to standard mirrors, install minimal build requirements, and clean up
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set python path for node-gyp
ENV npm_config_python=/usr/bin/python3

COPY package.json package-lock.json ./

# Leverage Docker cache layers for Node modules
RUN npm ci

COPY . .
RUN npm run build

# --- PRODUCTION RUNTIME STAGE ---
FROM node:20-bookworm-slim AS runner

ENV NODE_ENV=production
WORKDIR /app

# Create unprivileged system user securely
RUN groupadd -r app && useradd -r -g app -s /sbin/nologin app

# Install only curl and certificates for runtime health checks
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy production assets directly from builder (avoids secondary npm ci download lag)
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/update-merchant-categories.js ./
COPY --from=builder /app/check-merchants.js ./

# Clean up devDependencies from the node_modules directory to keep the image slim
RUN npm prune --omit=dev && npm cache clean --force

# Adjust ownership to unprivileged user
RUN chown -R app:app /app
USER app

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD curl -f http://localhost:3002/ || exit 1

CMD ["node", "dist/main.js"]
