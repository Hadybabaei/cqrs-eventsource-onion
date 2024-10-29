import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ContactService } from 'src/application/contact.service';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async create(@Body() createContactDto: { name: string; lastname: string }) {
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
