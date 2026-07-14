# Stage 1: Build
FROM node:26-slim AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest-11 --activate

RUN apt-get update && apt-get install -y python3 make g++

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
ENV COREPACK_NPM_TIMEOUT=60000
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Stage 2: Runtime
FROM node:26-slim AS runtime
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV PORT=4321
ENV HOST=0.0.0.0

EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
