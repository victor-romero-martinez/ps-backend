import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateSelect } from 'src/utils/generateSelect';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

const fieldsResponse = ['id', 'name', 'role', 'updated_at', 'created_at'];

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepo.create(createUserDto);
    return await this.userRepo.save(newUser);
  }

  async findAll(fields: string) {
    return this.userRepo.find({
      select: generateSelect(fields, fieldsResponse),
    });
  }

  async findOne(id: number, fields: string) {
    const user = await this.userRepo.findOne({
      where: { id },
      select: generateSelect(fields, fieldsResponse),
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto, fields: string) {
    const updated = await this.userRepo.update({ id }, updateUserDto);
    if (updated.affected === 0) {
      throw new NotFoundException(`Failed update user #${id}`);
    }
    return await this.findOne(id, fields);
  }

  async remove(id: number) {
    const removed = await this.userRepo.delete({ id });
    if (removed.affected === 0) {
      throw new NotFoundException(`Failed remove user #${id}`);
    }
    return { message: `Successfully removes a user ${id}` };
  }
}
