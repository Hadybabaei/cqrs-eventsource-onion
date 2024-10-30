import { Injectable } from '@nestjs/common';
import { Contact, ContactDocument } from '../schemas/contact.schema';
import { ContactRepository } from 'src/application/contact-repository.interface';
import { Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ContactRepositoryImpl implements ContactRepository {
  constructor(
    @InjectModel('Contact')
    private readonly contactModel: Model<ContactDocument>,
  ) {}

  async save(contact: Contact): Promise<void> {
    const contactData = new this.contactModel({
      _id: contact._id,
      name: contact.name,
      lastname: contact.lastname,
    });
    await contactData.save();
  }

  async findById(id: string): Promise<Contact | null> {
    const contactData = await this.contactModel.findById(id).exec();
    if (!contactData) return null;

    return new Contact(contactData._id, contactData.name, contactData.lastname);
  }

  async update(id: string, updateData: Partial<Contact>): Promise<Contact | null> {
    const updatedContact = await this.contactModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, useFindAndModify: false }
    ).exec();

    if (!updatedContact) return null;

    return new Contact(updatedContact._id, updatedContact.name, updatedContact.lastname);
  }
}
