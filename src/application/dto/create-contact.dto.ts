import { IsString, IsNotEmpty, IsUUID, } from 'class-validator';

export class CreateContactDto {
  @IsString()  
  @IsUUID()
  readonly _id:string

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly lastname: string;
}