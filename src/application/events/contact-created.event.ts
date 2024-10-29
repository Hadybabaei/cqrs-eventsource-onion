import { Injectable } from '@nestjs/common';
import { Contact } from 'src/domain/contact.entity';

@Injectable()
export class ContactCreatedEvent {
  constructor(
    public readonly _id: string,
    public readonly name: string,
    public readonly lastname: string,
  ) {}
}