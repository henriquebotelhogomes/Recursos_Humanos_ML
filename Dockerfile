FROM node:20-alpine AS base
WORKDIR /app

# ── Deps de produção ──────────────────────────
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY prisma ./prisma
RUN npx prisma generate && \
    cp -r node_modules /prod_node_modules

# ── Build (dev deps inclusos) ─────────────────
FROM base AS builder
COPY package.json package-lock.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN npm run build

# ── Runtime ────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    DATABASE_URL="file:./prisma/dev.db" \
    INFERENCE_BASE_URL="http://127.0.0.1:8000" \
    USE_ONLINE_INFERENCE="false"

WORKDIR /app

# Copia produção
COPY --from=deps /prod_node_modules ./node_modules

# Copia build standalone
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Dados para o seed (CSV, predições, métricas do modelo)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/data ./data
COPY --from=builder /app/analysis/models ./analysis/models
COPY --from=builder /app/analysis ./analysis
COPY --from=builder /app/scripts/start-all.sh ./scripts/start-all.sh

RUN apk add --no-cache python3 py3-pip
RUN pip3 install --no-cache-dir -r analysis/requirements.txt
RUN chmod +x scripts/start-all.sh

EXPOSE 3000

CMD ./scripts/start-all.sh
