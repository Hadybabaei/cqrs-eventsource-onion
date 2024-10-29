import { Schema, Document } from 'mongoose';

export interface ContactDocument extends Document {
  _id: string;
  name: string;
  lastname: string;
}

export const ContactSchema = new Schema<ContactDocument>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  lastname: { type: String, required: true },
});

export class Contact {
  constructor(
    public readonly _id: string,
    public readonly name: string,
    public readonly lastname: string,
  ) {}
}
