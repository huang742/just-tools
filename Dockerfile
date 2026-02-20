# syntax=docker/dockerfile:1

FROM nginx:1.27-alpine

WORKDIR /usr/share/nginx/html

# Replace the default server config with a static-file focused one
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy site assets
COPY index.html ./
COPY css ./css
COPY js ./js

EXPOSE 80

# Basic liveness probe
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://localhost/ || exit 1
