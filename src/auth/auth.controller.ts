import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/regestier.dto';

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
}
