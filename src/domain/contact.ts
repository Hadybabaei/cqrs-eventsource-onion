import { ContactCreatedEvent } from '../application/events/contact-created.event';
import { ContactUpdatedEvent } from '../application/events/contact-updated.event';
import { ContactEventSourcingService } from 'src/infrastracture/eventsource/contact-event-sourcing.service';
import { EventBus } from '@nestjs/cqrs';

export class Contact {
  private _id: string;
  private name: string;
  private lastname: string;
  private events: Array<ContactCreatedEvent | ContactUpdatedEvent> = [];

  constructor(
    private readonly eventSourcingService: ContactEventSourcingService,
    private readonly eventBus: EventBus,
  ) {}

  static async createContact(
    id: string,
    name: string,
    lastname: string,
    eventSourcingService: ContactEventSourcingService,
    eventBus: EventBus,
  ): Promise<Contact> {
    const contact = new Contact(eventSourcingService, eventBus);
    const event = new ContactCreatedEvent(id, name, lastname);
    contact.applyEvent(event);
    contact.events.push(event);
    await contact.commitEvents();
    return contact;
  }

  static rehydrate(
    events: Array<ContactCreatedEvent | ContactUpdatedEvent>,
    eventSourcingService: ContactEventSourcingService,
    eventBus: EventBus,
  ): Contact {
    const contact = new Contact(eventSourcingService, eventBus);
    events.forEach((event) => contact.applyEvent(event));
    return contact;
  }

  async updateContactName(name: string) {
    const event = new ContactUpdatedEvent(this._id, name, this.lastname);
    this.applyEvent(event);
    this.events.push(event);
    await this.commitEvents();
  }

  async updateContactLastname(lastname: string) {
    const event = new ContactUpdatedEvent(this._id, this.name, lastname);
    this.applyEvent(event);
    this.events.push(event);
    await this.commitEvents();
  }

  private applyEvent(event: ContactCreatedEvent | ContactUpdatedEvent) {
    if (event instanceof ContactCreatedEvent) {
      this.onContactCreated(event);
    } else if (event instanceof ContactUpdatedEvent) {
      this.onContactUpdated(event);
    }
  }

  private onContactCreated(event: ContactCreatedEvent) {
    this._id = event._id;
    this.name = event.name;
    this.lastname = event.lastname;
  }

  private onContactUpdated(event: ContactUpdatedEvent) {
    if (event.name) this.name = event.name;
    if (event.lastname) this.lastname = event.lastname;
  }

  private async commitEvents() {
    await this.eventSourcingService.saveEvents(this._id, this.events);
    this.events.forEach((event) => this.eventBus.publish(event));
    this.clearEvents();
  }

  private clearEvents() {
    this.events = [];
  }
}
