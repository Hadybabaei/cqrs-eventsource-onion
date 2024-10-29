import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetContactQuery } from '../get-contact.query';
import { ContactRepository } from 'src/domain/contact.repository';
import { Inject } from '@nestjs/common';
import { Contact } from 'src/infrastracture/mongodb/schemas/contact.schema';

@QueryHandler(GetContactQuery)
export class GetContactQueryHandler implements IQueryHandler<GetContactQuery> {
  constructor(
    @Inject('ContactRepository')
    private readonly contactRepository: ContactRepository,
  ) {}

  async execute(query: GetContactQuery): Promise<Contact | null> {
    const contact = await this.contactRepository.findById(query.id);
    if (!contact) return null;

    return { _id: contact._id, name: contact.name, lastname: contact.lastname };
  }
}
