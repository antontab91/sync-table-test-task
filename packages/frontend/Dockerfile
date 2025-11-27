FROM node:20-alpine

WORKDIR /app
RUN corepack enable

# Корневые файлы монорепы
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./

# Код фронтенда
COPY packages/frontend ./packages/frontend

# Ставим зависимости фронта (включая devDependencies и typescript)
RUN pnpm install --filter frontend... --prod=false

# Сборка фронта
WORKDIR /app/packages/frontend
RUN pnpm build

# Отдаём build через Vite preview как статический сервер
EXPOSE 5173
CMD ["pnpm", "preview", "--host", "0.0.0.0", "--port", "5173"]
