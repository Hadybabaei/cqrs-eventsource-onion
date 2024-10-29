import { Contact } from 'src/domain/contact.entity';
import { UpdateContactCommand } from '../update-contact.command';
import { ContactEventSourcingService } from 'src/infrastracture/eventsource/contact-event-sourcing.service';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ContactUpdatedEvent } from 'src/application/events/contact-updated.event';

@CommandHandler(UpdateContactCommand)
export class UpdateContactHandler implements ICommandHandler {
  constructor(
    private readonly eventSourcingService: ContactEventSourcingService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateContactCommand): Promise<void> {
    const events = await this.eventSourcingService.getEvents(command._id);
    const contact = Contact.rehydrateContact(events);
    this.validateUpdate(contact);
    const updatedEvent = new ContactUpdatedEvent(
      command._id,
      command.name,
      command.lastname,
    );
    await this.eventSourcingService.saveEvents(command._id, [updatedEvent]);
    await this.eventBus.publish(updatedEvent);
  }

  private validateUpdate(contact: Contact): void {
    if (!contact) {
      throw new Error('Contact does not exist');
    }
  }
}
