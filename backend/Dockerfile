FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY backend/package*.json backend/

RUN npm ci --ignore-scripts

COPY . .

RUN npm run build:backend

FROM node:22-alpine
WORKDIR /app

RUN addgroup --system --gid 1001 nexusauto && \
    adduser --system --uid 1001 nexusauto

COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/package*.json ./

RUN npm ci --omit=dev --ignore-scripts && \
    npm cache clean --force

RUN mkdir -p /app/data && chown -R nexusauto:nexusauto /app

USER nexusauto

ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/v1/health', r => { process.exit(r.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

EXPOSE 3000

CMD ["node", "dist/server.js"]
