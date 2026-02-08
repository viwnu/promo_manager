import { INestApplication } from '@nestjs/common';
import { cookieParserSetup, pipesSetup, prefixSetup, swaggerSetup } from '.';

export const configApp = (app: INestApplication) => {
  pipesSetup(app);
  prefixSetup(app);
  swaggerSetup(app);
  cookieParserSetup(app);
  // corseSetup(app);
};
