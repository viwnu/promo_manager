import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { UserUpdatedEvent } from '../../../events';
import { BackfillService } from '../backfill.service';
import { RAW_USERS_TABLE_NAME } from '../initialization/queries/raw-users.query';

@EventsHandler(UserUpdatedEvent)
export class UserUpdatedHandler implements IEventHandler<UserUpdatedEvent> {
  constructor(private readonly backfillService: BackfillService) {}

  async handle(event: UserUpdatedEvent): Promise<void> {
    try {
      const { payload } = event;
      if (!payload?.id) {
        console.warn('[analytics] UserUpdatedEvent skipped: missing payload id');
        return;
      }

    const rows = this.backfillService.mapRawUsers([
        {
          id: payload.id,
          name: payload.name,
          phone: payload.phone,
          createdAt: payload.createdAt,
          userIdentity: payload.email ? { email: payload.email } : undefined,
        },
      ]);

      if (rows.length === 0) {
        console.warn('[analytics] UserUpdatedEvent produced no rows', { userId: payload.id });
        return;
      }
      await this.backfillService.insertBatched(RAW_USERS_TABLE_NAME, rows);
      console.log('[analytics] UserUpdatedEvent processed', { userId: payload.id });
    } catch (error) {
      console.error('[analytics] UserUpdatedEvent failed', error);
    }
  }
}
