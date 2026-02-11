FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock nest-cli.json tsconfig.json tsconfig.build.json ./
COPY apps/web/package.json apps/web/yarn.lock ./apps/web/

RUN yarn install --frozen-lockfile
RUN yarn --cwd apps/web install --frozen-lockfile

COPY apps ./apps
COPY libs ./libs
COPY .env.api.production ./.env.api.production

RUN yarn build:web
RUN yarn build:api

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable

COPY package.json yarn.lock nest-cli.json tsconfig.json tsconfig.build.json ./
RUN yarn install --frozen-lockfile

COPY apps ./apps
COPY libs ./libs
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/apps/web/dist ./apps/web/dist
COPY --from=builder /app/.env.api.production ./.env.api.production
COPY start.sh ./start.sh

RUN chmod +x ./start.sh

EXPOSE 3000
CMD ["./start.sh"]