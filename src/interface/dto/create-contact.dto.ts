import { IsString, IsNotEmpty } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly lastname: string;
}
