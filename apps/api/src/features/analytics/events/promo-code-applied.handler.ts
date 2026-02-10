import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { PromoCodeAppliedEvent } from '../../../events';
import { BackfillService } from '../backfill.service';
import {
  PROMO_CODE_CODE_FIELD,
  PROMO_CODE_USAGE_FIELD_MAP,
  PROMO_CODE_USAGE_USER_FIELDS,
} from '../initialization/queries/raw-promo-code-usage.query';
import { RAW_PROMO_CODE_USAGE_TABLE_NAME } from '../initialization/queries/raw-promo-code-usage.query';

@EventsHandler(PromoCodeAppliedEvent)
export class PromoCodeAppliedHandler implements IEventHandler<PromoCodeAppliedEvent> {
  constructor(private readonly backfillService: BackfillService) {}

  async handle(event: PromoCodeAppliedEvent): Promise<void> {
    try {
      const payload = event.payload;
      if (!payload?.promoCodeId || !payload.userId || !payload.orderId) {
        console.warn('[analytics] PromoCodeAppliedEvent skipped: missing payload fields');
        return;
      }

      const rows = [
        {
          [PROMO_CODE_USAGE_FIELD_MAP.createdAt.key]: this.backfillService.formatDateTime(payload.usedAt),
          [PROMO_CODE_USAGE_FIELD_MAP.promoCodeId.key]: payload.promoCodeId,
          [PROMO_CODE_CODE_FIELD.key]: payload.code ?? '',
          [PROMO_CODE_USAGE_FIELD_MAP.userId.key]: payload.userId,
          [PROMO_CODE_USAGE_FIELD_MAP.orderId.key]: payload.orderId,
          [PROMO_CODE_USAGE_USER_FIELDS.email.key]: payload.email ?? '',
          [PROMO_CODE_USAGE_USER_FIELDS.name.key]: payload.name ?? '',
          [PROMO_CODE_USAGE_USER_FIELDS.phone.key]: payload.phone ?? '',
          [PROMO_CODE_USAGE_FIELD_MAP.orderAmount.key]: payload.orderAmount ?? 0,
          [PROMO_CODE_USAGE_FIELD_MAP.discountAmount.key]: payload.discountAmount ?? 0,
        },
      ];

      if (rows.length === 0) {
        console.warn('[analytics] PromoCodeAppliedEvent produced no rows');
        return;
      }
      await this.backfillService.insertBatched(RAW_PROMO_CODE_USAGE_TABLE_NAME, rows);
      console.log('[analytics] PromoCodeAppliedEvent processed', {
        promoCodeId: payload.promoCodeId,
        orderId: payload.orderId,
      });
    } catch (error) {
      console.error('[analytics] PromoCodeAppliedEvent failed', error);
    }
  }
}
