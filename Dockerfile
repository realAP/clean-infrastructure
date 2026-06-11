# ---------------------------------------------------------------------------
# Dieses Dockerfile baut nichts – das ist Absicht.
#
# Das Artefakt (App-Code + Produktions-Dependencies) wird von der Pipeline
# gebaut (Job "deliver": npm ci --omit=dev). Hier wird es nur noch in ein
# schlankes Runtime-Image verpackt und gestartet. Dadurch gibt es keine
# doppelten Build-Schritte zwischen Pipeline und Dockerfile.
#
# Lokal nachstellen:
#   npm ci --omit=dev && docker build -t clean-infrastructure-demo .
# ---------------------------------------------------------------------------
FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /app

# Fertig gebautes Artefakt übernehmen – kein npm im Image-Build.
COPY package.json ./
COPY node_modules ./node_modules
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
