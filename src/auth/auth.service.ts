import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bc from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  /** find user and compare password */
  async validateUser(email: string, pass: string) {
    const user = await this.userService.findByEmail(email);
    const isMatch = await bc.compare(pass, user.password);
    if (isMatch) {
      delete user.password;
      return user;
    }

    return null;
  }

  /** get token auth */
  async login(user: User) {
    const payload = {
      sub: user.id,
      username: user.name,
      email: user.email,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /** register a new user */
  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);

    const payload = {
      sub: user.id,
      username: user.name,
      email: user.email,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
