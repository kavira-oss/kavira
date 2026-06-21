import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BehaviorsService } from './behaviors.service';
import { CreateBehaviorDto } from './dto/create-behavior.dto';

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

  // TODO(#3): switch to req.user.id once the auth guard lands; userId via
  // route param is a temporary IDOR-prone stand-in until then.
  @Post('user/:userId')
  create(@Param('userId') userId: string, @Body() body: CreateBehaviorDto) {
    return this.behaviorsService.create({ ...body, userId });
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
