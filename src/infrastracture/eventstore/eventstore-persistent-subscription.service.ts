import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { eventStoreClient } from './eventstore-client';
import { ContactService } from 'src/application/contact.service';
import {
  PersistentSubscriptionToStreamSettings,
  persistentSubscriptionToStreamSettingsFromDefaults,
} from '@eventstore/db-client';

@Injectable()
export class EventStorePersistentSubscriptionService implements OnModuleInit {
  private readonly logger = new Logger(EventStorePersistentSubscriptionService.name);

  constructor(private readonly contactService: ContactService) {}

  async onModuleInit() {
    const streamName = 'my-stream';
    const groupName = 'my-subscription';

    try {
      const settings: PersistentSubscriptionToStreamSettings =
        persistentSubscriptionToStreamSettingsFromDefaults();
      await eventStoreClient.createPersistentSubscriptionToStream(
        streamName,
        groupName,
        settings
      );
      this.logger.log(`Persistent subscription group '${groupName}' created on stream '${streamName}'.`);
    } catch (error) {
      if (error.type === 'persistent-subscription-exists') {
        console.log(`Persistent subscription group '${groupName}' already exists on stream '${streamName}', proceeding with connection.`);
      } else {
        this.logger.error(`Error creating persistent subscription group: ${error.message}`);
        return; 
      }
    }

    this.connectToPersistentSubscription(streamName, groupName);
  }

  private async connectToPersistentSubscription(streamName: string, groupName: string) {
    this.logger.log(`Connecting to subscription: ${groupName} on ${streamName}`);
    const subscription =
      eventStoreClient.subscribeToPersistentSubscriptionToStream(streamName, groupName);

    for await (const event of subscription) {
      const eventType = event.event?.type;
      const eventData = event.event?.data;

      if (eventType === 'ContactCreatedEvent') {
        await this.contactService.createContact(eventData);
      }else if (eventType === "ContactUpdatedEvent"){
        await this.contactService.updateContact(eventData)
      }
      await subscription.ack(event);
    }
  }
}
