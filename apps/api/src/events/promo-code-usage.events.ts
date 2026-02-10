import { IEvent } from '@nestjs/cqrs';

export interface PromoCodeUsageEventPayload {
  usedAt: Date | string;
  promoCodeId: string;
  code: string;
  userId: string;
  orderId: string;
  email?: string;
  name?: string;
  phone?: string;
  orderAmount: number;
  discountAmount: number;
}

export class PromoCodeAppliedEvent implements IEvent {
  constructor(public readonly payload: PromoCodeUsageEventPayload) {}
}
