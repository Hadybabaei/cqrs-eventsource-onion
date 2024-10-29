import { ContactCreatedEvent } from '../application/events/contact-created.event';
import { ContactUpdatedEvent } from 'src/application/events/contact-updated.event';



export class Contact {
  private _id: string;
  private name: string;
  private lastname: string;
  private events: Array<ContactCreatedEvent | ContactUpdatedEvent> = [];

  constructor(id: string, name: string, lastname: string) {
    this._id = id;
    this.name = name;
    this.lastname = lastname;

    const event = new ContactCreatedEvent(id, name, lastname);
    this.applyEvent(event);
    this.events.push(event);
  }

  private applyEvent(event: ContactCreatedEvent | ContactUpdatedEvent) {
    if (event instanceof ContactCreatedEvent) {
      this._id = event._id;
      this.name = event.name;
      this.lastname = event.lastname;
    } else if (event instanceof ContactUpdatedEvent) {
      if (event.name) this.name = event.name;
      if (event.lastname) this.lastname = event.lastname;
    }
  }

  static rehydrateContact(events: Array<ContactCreatedEvent | ContactUpdatedEvent>): Contact {
    const contact = new Contact('', '', '');
    for (const event of events) {
      contact.applyEvent(event); 
      contact.events.push(event); 
    }
    return contact;
  }

  updateName(name: string) {
    const event = new ContactUpdatedEvent(this._id, name, this.lastname);
    this.applyEvent(event);
    this.events.push(event);
  }

  updateLastname(lastname: string) {
    const event = new ContactUpdatedEvent(this._id, this.name, lastname);
    this.applyEvent(event);
    this.events.push(event);
  }
  get id() {
    return this._id;
  }

  get currentState() {
    return {
      _id: this._id,
      name: this.name,
      lastname: this.lastname,
    };
  }


  get getEvents() {
    return this.events;
  }


  clearEvents() {
    this.events = [];
  }
}
