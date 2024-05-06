import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
    private readonly jwtService: JwtService,
  ) {}

  /** create a user */
  async create(createUserDto: CreateUserDto) {
    const ready = await this.#isAlready(createUserDto.email);
    if (ready) {
      throw new ConflictException('Users is already exists');
    }
    const newUser = this.userRepo.create(createUserDto);
    return await this.userRepo.save(newUser);
  }

  /** find all users */
  async findAll(fields: string) {
    return this.userRepo.find({
      select: generateSelect(fields, fieldsResponse),
    });
  }

  /** find by id */
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

  /** find user by email for auth */
  async findByEmail(email: string) {
    const user = await this.userRepo.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException(`User #${email} not found`);
    }
    return user;
  }

  /** update user by id */
  async update(id: number, updateUserDto: UpdateUserDto, fields: string) {
    const updated = await this.userRepo.update({ id }, updateUserDto);
    if (updated.affected === 0) {
      throw new NotFoundException(`Failed update user #${id}`);
    }
    const user = await this.findOne(id, fields);
    const payload = {
      sub: user.id,
      username: user.name,
      email: user.email,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      ...user,
    };
  }

  /** remove a user by id */
  async remove(id: number) {
    const removed = await this.userRepo.delete({ id });
    if (removed.affected === 0) {
      throw new NotFoundException(`Failed remove user #${id}`);
    }
    return { message: `Successfully removes a user ${id}` };
  }

  async #isAlready(email: string) {
    return await this.userRepo.existsBy({ email });
  }
}
