FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json frontend/

RUN npm ci --ignore-scripts

COPY . .

RUN npm run build:frontend

FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

RUN rm -rf ./* && \
    addgroup -g 1001 -S frontend && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G frontend frontend

COPY frontend/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/frontend/dist .

RUN chown -R frontend:frontend /usr/share/nginx/html && \
    chown -R frontend:frontend /var/cache/nginx && \
    chown -R frontend:frontend /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R frontend:frontend /var/run/nginx.pid

USER frontend

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/ || exit 1

EXPOSE 8080
