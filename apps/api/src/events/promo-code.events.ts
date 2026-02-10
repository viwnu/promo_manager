import { IEvent } from '@nestjs/cqrs';

export interface PromoCodeEventPayload {
  id: string;
  code: string;
  active?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export class PromoCodeCreatedEvent implements IEvent {
  constructor(public readonly payload: PromoCodeEventPayload) {}
}

export class PromoCodeUpdatedEvent implements IEvent {
  constructor(public readonly payload: PromoCodeEventPayload) {}
}
