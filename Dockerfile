# Production Dockerfile for Coolify / VPS Deployment
FROM node:20-alpine AS builder

WORKDIR /app

# Install all dependencies including devDependencies for build
COPY package.json package-lock.json* bun.lock* ./
RUN npm install

# Copy source files and build client & server
COPY . .
RUN npm run build

# Runner stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package.json package-lock.json* bun.lock* ./
# Install only production dependencies
RUN npm install --omit=dev

# Copy compiled files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
