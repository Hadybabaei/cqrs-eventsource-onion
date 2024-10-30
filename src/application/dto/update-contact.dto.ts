import { IsString } from 'class-validator';

export class UpdateContactDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly lastname: string;
}
