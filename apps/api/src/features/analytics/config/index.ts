import { ClickHouseClientOptions } from '@depyronick/nestjs-clickhouse';
import { ConfigService } from '@nestjs/config';

export const ClickHouseConfigService = () => ({
  useFactory: (config: ConfigService): ClickHouseClientOptions => ({
    host: config.get('CH_HOST'),
    database: config.get('CH_DB'),
    password: config.get('CH_PWD'),
    username: config.get('CH_USERNAME'),
  }),
  inject: [ConfigService],
});
