import { IEvent } from '@nestjs/cqrs';

export interface UserEventPayload {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  createdAt?: Date | string;
  active?: boolean;
}

export class UserCreatedEvent implements IEvent {
  constructor(public readonly payload: UserEventPayload) {}
}

export class UserUpdatedEvent implements IEvent {
  constructor(public readonly payload: UserEventPayload) {}
}
