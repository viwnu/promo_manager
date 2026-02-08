import { INestApplication, ValidationPipe } from '@nestjs/common';

export const pipesSetup = (app: INestApplication) => {
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, disableErrorMessages: false }));
};
