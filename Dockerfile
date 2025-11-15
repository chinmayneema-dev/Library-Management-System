# Multi-stage build for full-stack application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json files
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install dependencies
RUN cd backend && npm ci --only=production
RUN cd frontend && npm ci

# Build frontend
WORKDIR /app/frontend
COPY frontend/ ./
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy backend dependencies and source
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY backend/ ./backend/

# Copy built frontend
COPY --from=builder /app/frontend/dist ./frontend/dist/

# Change to app user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "backend/src/server.js"]
