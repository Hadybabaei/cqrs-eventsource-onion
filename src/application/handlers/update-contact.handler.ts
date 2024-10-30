import { Contact } from 'src/domain/contact';
import { UpdateContactCommand } from '../commands/update-contact.command';
import { ContactEventSourcingService } from 'src/infrastracture/eventsource/contact-event-sourcing.service';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ContactUpdatedEvent } from 'src/application/events/contact-updated.event';

@CommandHandler(UpdateContactCommand)
export class UpdateContactHandler
  implements ICommandHandler<UpdateContactCommand>
{
  constructor(
    private readonly eventSourcingService: ContactEventSourcingService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateContactCommand): Promise<void> {
    const events = await this.eventSourcingService.getEvents(command._id);
    const contact = Contact.rehydrate(
      events,
      this.eventSourcingService,
      this.eventBus,
    );

    this.validateUpdate(contact);

    if (command.name) {
      await contact.updateContactName(command.name);
    }
    if (command.lastname) {
      await contact.updateContactLastname(command.lastname);
    }
  }

  private validateUpdate(contact: Contact): void {
    if (!contact) {
      throw new Error('Contact does not exist');
    }
  }
}
