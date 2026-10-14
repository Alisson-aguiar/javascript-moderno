# ============================================
# Estágio 1: Builder
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .

RUN npm run sitemap
RUN node scripts/build-search-index.mjs

# ============================================
# Estágio 2: Runtime
# ============================================
FROM nginx:1.27-alpine AS runtime

RUN apk add --no-cache curl

RUN rm -rf /usr/share/nginx/html/* \
    && rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/index.html            /usr/share/nginx/html/
COPY --from=builder /app/tutorial.html         /usr/share/nginx/html/
COPY --from=builder /app/manifest.webmanifest  /usr/share/nginx/html/
COPY --from=builder /app/sw.js                 /usr/share/nginx/html/
COPY --from=builder /app/robots.txt            /usr/share/nginx/html/
COPY --from=builder /app/sitemap.xml           /usr/share/nginx/html/
COPY --from=builder /app/content               /usr/share/nginx/html/content
COPY --from=builder /app/assets                /usr/share/nginx/html/assets

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]