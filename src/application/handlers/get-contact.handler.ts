import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetContactQuery } from '../queries/get-contact.query';
import { ContactRepository } from 'src/application/contact-repository.interface';
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
    return contact;
  }
}
