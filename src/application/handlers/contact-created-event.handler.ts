import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ContactCreatedEvent } from '../events/contact-created.event';
import { ContactRepository } from 'src/application/contact-repository.interface';
import { Inject } from '@nestjs/common';
import { Contact } from 'src/infrastracture/mongodb/schemas/contact.schema';

@EventsHandler(ContactCreatedEvent)
export class ContactCreatedEventHandler implements IEventHandler {
  constructor(
    @Inject('ContactRepository')
    private readonly contactRepository: ContactRepository,
  ) {}

  async handle(event: Contact) {
    const contact = new Contact(event._id, event.name, event.lastname);
    await this.updateReadModel(contact);
    console.log(`New Contact Created:${JSON.stringify(event)}`);
  }

  async updateReadModel(data: Contact) {
    return await this.contactRepository.save(data);
  }
}
