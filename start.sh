#!/bin/sh
set -e

export NODE_ENV=production

yarn ts-node -r tsconfig-paths/register ./apps/api/src/db/seed/index.ts
yarn ts-node -r tsconfig-paths/register ./apps/api/src/features/analytics/initialization/index.ts
yarn start:prod