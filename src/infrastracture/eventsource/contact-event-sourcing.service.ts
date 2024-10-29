// ContactEventSourcingService.ts
import { Injectable } from '@nestjs/common';
import {
  EventStoreDBClient,
  jsonEvent,
  FORWARDS,
  START,
} from '@eventstore/db-client';
import { EventBus } from '@nestjs/cqrs';
import { ContactCreatedEvent } from 'src/application/events/contact-created.event';
import { ContactUpdatedEvent } from 'src/application/events/contact-updated.event';

@Injectable()
export class ContactEventSourcingService {
  private readonly STREAM_PREFIX = 'contact.';

  constructor(
    private readonly eventStoreClient: EventStoreDBClient,
    private readonly eventBus: EventBus,
  ) {}

  async saveEvents(
    contactId: string,
    events: ContactCreatedEvent[] | any,
  ): Promise<void> {
    const streamName = this.getStreamName(contactId);
    const eventData = events.map((event) => {
      return jsonEvent({
        type: event.constructor.name,
        data: event,
      });
    });

    await this.eventStoreClient.appendToStream(streamName, eventData);
  }

  async getEvents(contactId: string): Promise<ContactCreatedEvent[]> {
    const streamName = this.getStreamName(contactId);
    const events: ContactCreatedEvent[] = [];

    const readEvents = this.eventStoreClient.readStream(streamName, {
      direction: FORWARDS,
      fromRevision: START,
    });
    for await (const resolvedEvent of readEvents) {
      const { type, data } = resolvedEvent.event;
      const eventInstance = this.createEventInstance(type, data);
      if (eventInstance) {
        events.push(eventInstance);
      }
    }

    return events;
  }

  private getStreamName(contactId: string): string {
    return `${this.STREAM_PREFIX}${contactId}`;
  }

  private createEventInstance(
    type: string,
    data: any,
  ): ContactCreatedEvent | null {
    switch (type) {
      case 'ContactCreatedEvent':
        return new ContactCreatedEvent(data._id, data.name, data.lastname);
      case 'ContactUpdatedEvent':
        return new ContactUpdatedEvent(data._id, data.name, data.lastname);
      default:
        return null;
    }
  }
}
