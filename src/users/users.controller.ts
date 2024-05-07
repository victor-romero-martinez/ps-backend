import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(
    @Query('fields') fields: string,
    @Query('includes') includes: string,
  ) {
    return this.usersService.findAll(fields, includes);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('fields') fields: string,
    @Query('includes') includes: string,
  ) {
    return this.usersService.findOne(+id, fields, includes);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
    @Query('fields') fields: string,
  ) {
    return this.usersService.update(req.user.sub, updateUserDto, fields);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  remove(@Request() req) {
    return this.usersService.remove(req.user.sub);
  }
}
