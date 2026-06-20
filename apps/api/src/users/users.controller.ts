import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

 @Post()
async create(@Body() body: CreateUserDto) {
  const passwordHash = await bcrypt.hash(body.password, 10);
  const created = await this.usersService.create({
    email: body.email,
    username: body.username,
    passwordHash,
    name: body.name,
  });

  return {
    id: created.id,
    email: created.email,
    username: created.username,
    name: created.name,
  };
}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
