import { ClickHouseModule } from '@depyronick/nestjs-clickhouse';
import { Module } from '@nestjs/common';
import { ClickHouseConfigService } from './config';

@Module({
  controllers: [],
  imports: [ClickHouseModule.registerAsync(ClickHouseConfigService())],
})
export class AnalyticsModule {}
