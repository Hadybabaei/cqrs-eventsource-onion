export class CreateContactCommand {
  constructor(
    public readonly _id: string,
    public readonly name: string,
    public readonly lastname: string,
  ) {}
}
