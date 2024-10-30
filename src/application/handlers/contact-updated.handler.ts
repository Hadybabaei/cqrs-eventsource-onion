import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ContactUpdatedEvent } from '../events/contact-updated.event';
import { ContactRepository } from 'src/application/contact-repository.interface';
import { Inject } from '@nestjs/common';
import { Contact } from 'src/infrastracture/mongodb/schemas/contact.schema';

@EventsHandler(ContactUpdatedEvent)
export class ContactUpdatedEventHandler implements IEventHandler {
  constructor(
    @Inject('ContactRepository')
    private readonly contactRepository: ContactRepository,
  ) {}

  async handle(event: Contact) {
    await this.updateReadModel(event);
    console.log(`Contact Updated:${JSON.stringify(event)}`);
  }

  async updateReadModel(data: Contact) {
    return await this.contactRepository.update(data._id, data);
  }
}
