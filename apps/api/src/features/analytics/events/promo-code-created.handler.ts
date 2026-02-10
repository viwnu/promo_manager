import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { PromoCodeCreatedEvent } from '../../../events';

@EventsHandler(PromoCodeCreatedEvent)
export class PromoCodeCreatedHandler implements IEventHandler<PromoCodeCreatedEvent> {
  async handle(_event: PromoCodeCreatedEvent): Promise<void> {
    try {
      // Promo codes are derived from usage analytics; no direct raw table in ClickHouse.
      console.log('[analytics] PromoCodeCreatedEvent skipped (no raw table)');
    } catch (error) {
      console.error('[analytics] PromoCodeCreatedEvent failed', error);
    }
  }
}
