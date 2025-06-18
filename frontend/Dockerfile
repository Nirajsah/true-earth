# -----------------------------
# Base image
FROM node:20-alpine AS base

WORKDIR /app

# -----------------------------
# Dependencies layer
FROM base AS deps

# Sometimes libc6-compat is needed for native bindings on alpine
RUN apk add --no-cache libc6-compat

COPY package.json bun.lockb* ./
RUN npm install --frozen-lockfile

# -----------------------------
# Builder layer
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Optional: disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# -----------------------------
# Runner layer (production image)
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public and standalone output
COPY --from=builder /app/public ./public

# Needed for ISR cache
RUN mkdir .next && chown nextjs:nodejs .next

# Copy only standalone production build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# ✅ OPTIONAL: If your server-side code needs BACKEND_URL at runtime
# (not needed for client side — already embedded!)

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
