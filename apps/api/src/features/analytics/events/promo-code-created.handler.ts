import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { PromoCodeCreatedEvent } from '../../../events';
import { BackfillService } from '../backfill.service';
import {
  PROMO_CODE_CODE_FIELD,
  PROMO_CODE_USAGE_FIELD_MAP,
  PROMO_CODE_USAGE_USER_FIELDS,
  RAW_PROMO_CODE_USAGE_TABLE_NAME,
} from '../initialization/queries/raw-promo-code-usage.query';

@EventsHandler(PromoCodeCreatedEvent)
export class PromoCodeCreatedHandler implements IEventHandler<PromoCodeCreatedEvent> {
  constructor(private readonly backfillService: BackfillService) {}

  async handle(event: PromoCodeCreatedEvent): Promise<void> {
    try {
      const payload = event.payload;
      if (!payload?.id) {
        console.warn('[analytics] PromoCodeCreatedEvent skipped: missing payload id');
        return;
      }

      const rows = [
        {
          [PROMO_CODE_USAGE_FIELD_MAP.createdAt.key]: this.backfillService.formatDateTime(payload.createdAt ?? new Date()),
          [PROMO_CODE_USAGE_FIELD_MAP.promoCodeId.key]: payload.id,
          [PROMO_CODE_CODE_FIELD.key]: payload.code ?? '',
          [PROMO_CODE_USAGE_FIELD_MAP.userId.key]: '',
          [PROMO_CODE_USAGE_FIELD_MAP.orderId.key]: '',
          [PROMO_CODE_USAGE_USER_FIELDS.email.key]: '',
          [PROMO_CODE_USAGE_USER_FIELDS.name.key]: '',
          [PROMO_CODE_USAGE_USER_FIELDS.phone.key]: '',
          [PROMO_CODE_USAGE_FIELD_MAP.orderAmount.key]: 0,
          [PROMO_CODE_USAGE_FIELD_MAP.discountAmount.key]: 0,
        },
      ];

      await this.backfillService.insertBatched(RAW_PROMO_CODE_USAGE_TABLE_NAME, rows);
      console.log('[analytics] PromoCodeCreatedEvent processed', { promoCodeId: payload.id });
    } catch (error) {
      console.error('[analytics] PromoCodeCreatedEvent failed', error);
    }
  }
}
