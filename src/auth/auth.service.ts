import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User as userEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/regestier.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(userEntity)
    private userRepository: Repository<userEntity>,
    private jwtService: JwtService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  private async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  private async generateAccessToken(user: userEntity): Promise<string> {
    // Implement token generation logic here (e.g., JWT)
    const payload = {
      email: user.email,
      role: user.role,
      sub: user.id,
    };
    return await this.jwtService.signAsync(payload, {
      secret: 'jwt_secret',
      expiresIn: '15m',
    });
  }

  private async generateRefreshToken(user: userEntity): Promise<string> {
    // Implement token generation logic here (e.g., JWT)
    const payload = {
      sub: user.id,
    };
    return await this.jwtService.signAsync(payload, {
      secret: 'refresh_secret',
      expiresIn: '7d',
    });
  }

  private async generateTokens(user: userEntity) {
    // Implement token generation logic here (e.g., JWT)
    const token = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    return {
      accessToken: token,
      refreshToken,
    };
  }

  async refreshToken(
    user: userEntity,
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    try {
      const { sub }: { sub: number } = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: 'refresh_secret',
        },
      );
      const user = (await this.userRepository.findOne({
        where: { id: sub },
      })) as userEntity;
      const token = await this.generateAccessToken(user);
      return { accessToken: token };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
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

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      if (!(await this.verifyPassword(password, user.password)))
        throw new UnauthorizedException(
          'Invalid credentials or user does not exist',
        );
      return await this.generateTokens(user);
    }
    return null;
  }

  async findUserById(id: number): Promise<Omit<userEntity, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }
}
