import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CLICKHOUSE_ASYNC_INSTANCE_TOKEN, ClickHouseClient } from '@depyronick/nestjs-clickhouse';

@Injectable()
export class AnalyticsService implements OnModuleInit {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(@Inject(CLICKHOUSE_ASYNC_INSTANCE_TOKEN) private readonly clickhouse: ClickHouseClient) {}

  async onModuleInit(): Promise<void> {
    try {
      const result = await this.clickhouse.queryPromise<{ ok: number }>('SELECT 1 AS ok');
      this.logger.log({ result });
    } catch (error) {
      this.logger.error('ClickHouse query failed', error as Error);
    }
  }
}
