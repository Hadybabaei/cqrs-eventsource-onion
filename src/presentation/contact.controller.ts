// src/presentation/contact.controller.ts
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
import { ContactService } from 'src/application/contact.service';
import { CreateContactDto } from '../application/dto/create-contact.dto';
import { UpdateContactDto } from '../application/dto/update-contact.dto';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createContactDto: CreateContactDto) {
    await this.contactService.createContact(createContactDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    await this.contactService.updateContact({ _id: id, ...updateContactDto });
  }

  @Get(':id')
  async getContact(@Param('id') id: string) {
    return await this.contactService.getContactById(id);
  }
}
