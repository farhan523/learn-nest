import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User as userEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/regestier.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(userEntity)
    private userRepository: Repository<userEntity>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, '2');
  }

  async registerUser(
    newUser: CreateUserDto,
  ): Promise<{ user: Omit<userEntity, 'password'>; message: string }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: newUser.email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    newUser.password = await this.hashPassword(newUser.password);

    const user = await this.userRepository.save(newUser);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return {
      user: result,
      message: 'User registered successfully',
    };
  }
}
