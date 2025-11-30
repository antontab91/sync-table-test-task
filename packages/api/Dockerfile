FROM node:20-alpine

WORKDIR /app
RUN corepack enable
RUN apk add --no-cache libc6-compat

# Корневые файлы монорепы
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./

# Код API
COPY packages/api ./packages/api

# Ставим зависимости только для API (включая devDependencies и typescript)
RUN pnpm install --filter api... --prod=false

WORKDIR /app/packages/api

# Сборка + копирование SQL в dist/db/sql
RUN pnpm build && mkdir -p dist/db && cp -r src/db/sql dist/db

EXPOSE 4000
CMD ["node", "dist/main.js"]
