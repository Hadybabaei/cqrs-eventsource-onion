import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ContactService } from './application/contact.service';
import { CreateContactHandler } from './application/commands/handlers/create-contact.handler';
// import { UpdateContactHandler } from './application/commands/handlers/update-contact.handler';
import { ContactSchema } from './infrastracture/mongodb/schemas/contact.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactController } from './interface/contact.controller';
import { ContactEventSourcingService } from './infrastracture/eventsource/contact-event-sourcing.service';
import { ContactRepositoryImpl } from './infrastracture/mongodb/repositories/contact.repository';
import { eventStoreClient } from './infrastracture/eventstore/eventstore-client';
import { EventStoreDBClient } from '@eventstore/db-client';
import { UpdateContactHandler } from './application/commands/handlers/update-contact.handler';
import { EventStorePersistentSubscriptionService } from './infrastracture/eventstore/eventstore-persistent-subscription.service';
import { ContactCreatedEventHandler } from './application/events/handlers/contact-created-event.handler';
import { ContactUpdatedEventHandler } from './application/events/handlers/contact-updated.handler';
import { GetContactQueryHandler } from './application/queries/handlers/get-contact.handler';

const CommandHandlers = [CreateContactHandler, UpdateContactHandler];
const EventHandlers = [ContactCreatedEventHandler, ContactUpdatedEventHandler];
const QueryHandlers = [GetContactQueryHandler];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forRoot(
      'mongodb+srv://mrhadyba69:AjGXTzU4LNwuF60U@cluster0.j47hi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    MongooseModule.forFeature([{ name: 'Contact', schema: ContactSchema }]),
  ],
  controllers: [ContactController],
  providers: [
    EventStorePersistentSubscriptionService,
    ContactService,
    ContactEventSourcingService,
    { provide: 'ContactRepository', useClass: ContactRepositoryImpl },
    {
      provide: EventStoreDBClient,
      useValue: eventStoreClient,
    },
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
  ],
})
export class AppModule {}
