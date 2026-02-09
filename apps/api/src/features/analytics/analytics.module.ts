import { ClickHouseModule } from '@depyronick/nestjs-clickhouse';
import { Module } from '@nestjs/common';
import { ClickHouseConfigService } from './config';
import { AnalyticsService } from './analytics.service';

@Module({
  controllers: [],
  providers: [AnalyticsService],
  imports: [ClickHouseModule.registerAsync(ClickHouseConfigService())],
})
export class AnalyticsModule {}
