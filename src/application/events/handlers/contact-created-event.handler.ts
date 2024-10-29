import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ContactCreatedEvent } from '../contact-created.event';
import { ContactRepository } from 'src/domain/contact.repository';
import { Inject } from '@nestjs/common';
import { Contact } from 'src/infrastracture/mongodb/schemas/contact.schema';


@EventsHandler(ContactCreatedEvent)
export class ContactCreatedEventHandler implements IEventHandler {
  constructor(
    @Inject('ContactRepository')
    private readonly contactRepository: ContactRepository,
  ) {}

  async handle(event: Contact) {
    await this.updateReadModel(event);
    console.log(`New Contact Created:${JSON.stringify(event)}`);
  }

  async updateReadModel(data: Contact) {
    return await this.contactRepository.save(data);
  }
}
