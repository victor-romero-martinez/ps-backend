import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bc from 'bcrypt';
import { generateSelect } from 'src/utils/generateSelect';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

const placeholder = ['id', 'name', 'email', 'role', 'updated_at', 'created_at'];

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
    const hash = await bc.hash(createUserDto.password, 10);
    const newDto = { ...createUserDto, password: hash };
    const newUser = this.userRepo.create(newDto);
    return await this.userRepo.save(newUser);
  }

  /** find all users */
  async findAll(
    take: number,
    skip: number,
    fields?: string,
    includes?: string,
  ) {
    const [users, total] = await this.userRepo.findAndCount({
      take,
      skip,
      relations: { products: includes ? true : false },
      select: generateSelect({ placeholder, fields, includes }),
    });

    return { users, total };
  }

  /** find by id */
  async findOne(id: number, fields?: string, includes?: string) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: { products: includes ? true : false },
      select: generateSelect({ placeholder, fields, includes }),
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
