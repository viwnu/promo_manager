import { ClickHouseClient } from '@depyronick/nestjs-clickhouse';
import { BASE_TABLES_QUERIES, ClickHouseInitQuery } from './queries';
import { MV_TABLES_QUERIES } from './queries/views';
import * as dotenv from 'dotenv';

dotenv.config({
  path: `.env.api.${process.env.NODE_ENV.trim()}`,
});

export const CLICKHOUSE_INIT_QUERIES: ReadonlyArray<ClickHouseInitQuery> = [...BASE_TABLES_QUERIES, ...MV_TABLES_QUERIES];

export async function initAnalyticsTables(): Promise<void> {
  const client = new ClickHouseClient({
    host: process.env.CH_HOST,
    database: process.env.CH_DB,
    password: process.env.CH_PWD,
    username: process.env.CH_USERNAME,
  });

  for (const query of CLICKHOUSE_INIT_QUERIES) {
    const statements = query.sql
      .split(';')
      .map((stmt) => stmt.trim())
      .filter(Boolean);

    for (const statement of statements) {
      await client.queryPromise(statement);
    }

    console.log(`[clickhouse] created: ${query.name}`);
  }
}

initAnalyticsTables().catch((error) => {
  console.error('[clickhouse] init failed', error);
  process.exit(1);
});
