import { ConfigModule, ConfigService } from '@nestjs/config';

export const MongooseConfigService = () => ({
  useFactory: (configService: ConfigService) => ({
    uri: configService.get('MONGO_URI'),
  }),
  inject: [ConfigService],
  imports: [ConfigModule],
});
