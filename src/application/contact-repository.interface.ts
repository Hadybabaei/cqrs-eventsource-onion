import { Contact } from "src/infrastracture/mongodb/schemas/contact.schema";


export interface ContactRepository {
  save(contact: Contact): Promise<Contact | void>;
  findById(id: string): Promise<Contact | null>;
  update(id: string, updateData: Partial<Contact>): Promise<Contact | null>
}
