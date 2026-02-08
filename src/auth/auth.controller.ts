import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/regestier.dto';
import { LoginUserDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() user: CreateUserDto): Promise<{
    user: Omit<CreateUserDto, 'password'> | null;
    message: string;
  }> {
    try {
      return await this.authService.registerUser(user);
    } catch (error) {
      throw new HttpException(
        { user: null, message: (error as Error).message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('login')
  async login(
    @Body() user: LoginUserDto,
  ): Promise<{ accessToken: string } | null> {
    try {
      return await this.authService.login(user.email, user.password);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
