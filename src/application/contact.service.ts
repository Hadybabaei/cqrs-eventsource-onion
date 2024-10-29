import { Injectable } from '@nestjs/common';
import { CreateContactCommand } from './commands/create-contact.command'; // Adjust the import path accordingly
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateContactCommand } from './commands/update-contact.command';
import { GetContactQuery } from './queries/get-contact.query';

@Injectable()
export class ContactService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createContact(eventData: any) {
    const command = new CreateContactCommand(
      eventData._id,
      eventData.name,
      eventData.lastname,
    );
    return this.commandBus.execute(command);
  }

  async updateContact(eventData: any) {
    const command = new UpdateContactCommand(
      eventData._id,
      eventData.name,
      eventData.lastname,
    );
    return this.commandBus.execute(command);
  }

  async getContactById(id: string) {
    return this.queryBus.execute(new GetContactQuery(id));
  }
}
