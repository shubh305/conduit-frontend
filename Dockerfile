# Stage 1: Dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Builder
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Injected via docker-compose build args (needed for client-side env vars)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ARG NEXT_PUBLIC_DEFAULT_TENANT_ID
ENV NEXT_PUBLIC_DEFAULT_TENANT_ID=$NEXT_PUBLIC_DEFAULT_TENANT_ID

ARG NEXT_PUBLIC_STORAGE_URL
ENV NEXT_PUBLIC_STORAGE_URL=$NEXT_PUBLIC_STORAGE_URL

ARG NEXT_PUBLIC_BASE_DOMAIN
ENV NEXT_PUBLIC_BASE_DOMAIN=$NEXT_PUBLIC_BASE_DOMAIN

ARG NEXT_PUBLIC_PWA_VERSION
ENV NEXT_PUBLIC_PWA_VERSION=$NEXT_PUBLIC_PWA_VERSION

RUN npm run build

# Stage 3: Runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3001
ENV PORT=3001
ENV CONDUIT_INTERNAL_API_URL=$CONDUIT_INTERNAL_API_URL
CMD ["node", "server.js"]
