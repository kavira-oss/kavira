import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BehaviorsService } from './behaviors.service';

@Controller('behaviors')
export class BehaviorsController {
  constructor(private readonly behaviorsService: BehaviorsService) {}

  @Get('user/:userId')
  findAllForUser(@Param('userId') userId: string) {
    return this.behaviorsService.findAllForUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.behaviorsService.findOne(id);
  }

  @Post()
  create(@Body() body: { userId: string; title: string; description?: string }) {
    return this.behaviorsService.create(body);
  }

  @Patch(':id/archive')
  archive(@Param('id') id: string) {
    return this.behaviorsService.archive(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.behaviorsService.softDelete(id);
  }
}
