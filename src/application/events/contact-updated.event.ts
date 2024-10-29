import { Injectable } from '@nestjs/common';

@Injectable()
export class ContactUpdatedEvent {
  constructor(
    public readonly _id: string,
    public readonly name: string,
    public readonly lastname: string,
  ) {}
}
