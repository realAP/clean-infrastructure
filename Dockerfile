# ---------------------------------------------------------------------------
# Stage 1: Dependencies installieren
# Nur package.json + Lockfile kopieren, damit Docker diesen Layer cachen kann,
# solange sich die Dependencies nicht ändern.
# ---------------------------------------------------------------------------
FROM node:22-alpine AS deps

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---------------------------------------------------------------------------
# Stage 2: Schlankes Runtime-Image
# Enthält nur Produktions-Dependencies und den App-Code – keine Build-Tools.
# ---------------------------------------------------------------------------
FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
COPY public ./public

# Build-Metadaten: werden von der Pipeline gesetzt und von der App
# unter /api/info angezeigt – so sieht man, welches Artefakt läuft.
ARG APP_VERSION=dev
ARG GIT_SHA=local
ARG BUILD_TIME=""
ENV APP_VERSION=$APP_VERSION \
    GIT_SHA=$GIT_SHA \
    BUILD_TIME=$BUILD_TIME

# Nicht als root laufen – der node-User ist im Basis-Image vorhanden.
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1:3000/healthz || exit 1

CMD ["node", "src/server.js"]
