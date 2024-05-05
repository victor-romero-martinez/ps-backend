import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query('fields') fields: string) {
    return this.usersService.findAll(fields);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('fields') fields: string) {
    return this.usersService.findOne(+id, fields);
  }

  // @Get('me/:email')
  // findOneByEmail(
  //   @Param('username') username: string,
  //   @Query('fields') fields: string,
  // ) {
  //   return this.usersService.findByName(username, fields);
  // }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Query('fields') fields: string,
  ) {
    return this.usersService.update(+id, updateUserDto, fields);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
