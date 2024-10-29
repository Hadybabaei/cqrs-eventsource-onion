import { EventStoreDBClient } from '@eventstore/db-client';

export const eventStoreClient = EventStoreDBClient.connectionString(
  'esdb://admin:changeit@localhost:2113?tls=false',
)