import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { PromoCodeUpdatedEvent } from '../../../events';

@EventsHandler(PromoCodeUpdatedEvent)
export class PromoCodeUpdatedHandler implements IEventHandler<PromoCodeUpdatedEvent> {
  async handle(_event: PromoCodeUpdatedEvent): Promise<void> {
    try {
      // Promo codes are derived from usage analytics; no direct raw table in ClickHouse.
      console.log('[analytics] PromoCodeUpdatedEvent skipped (no raw table)');
    } catch (error) {
      console.error('[analytics] PromoCodeUpdatedEvent failed', error);
    }
  }
}
