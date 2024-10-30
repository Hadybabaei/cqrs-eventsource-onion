import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateContactCommand } from '../commands/create-contact.command';
import { ContactEventSourcingService } from 'src/infrastracture/eventsource/contact-event-sourcing.service';
import { Contact } from 'src/domain/contact';
import { ContactCreatedEvent } from 'src/application/events/contact-created.event';

@CommandHandler(CreateContactCommand)
export class CreateContactHandler
  implements ICommandHandler<CreateContactCommand>
{
  constructor(
    private readonly eventSourcingService: ContactEventSourcingService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateContactCommand): Promise<void> {
    const { _id, name, lastname } = command;

    await Contact.createContact(
      _id,
      name,
      lastname,
      this.eventSourcingService,
      this.eventBus,
    );
  }
}
