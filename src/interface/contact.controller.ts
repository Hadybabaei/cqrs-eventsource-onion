import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ContactService } from 'src/application/contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createContactDto: CreateContactDto) {
    await this.contactService.createContact({
      _id: randomUUID(),
      name: createContactDto.name,
      lastname: createContactDto.lastname,
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContactDto: { name: string; lastname: string },
  ) {
    await this.contactService.updateContact({
      _id: id,
      name: updateContactDto.name,
      lastname: updateContactDto.lastname,
    });
  }

  @Get(':id')
  async getContact(@Param('id') id: string) {
    return await this.contactService.getContactById(id);
  }
}
