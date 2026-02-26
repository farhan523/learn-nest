import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/regestier.dto';
import { LoginUserDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginThrottlerGuard } from './guards/login-throttler.guard';

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

  @UseGuards(LoginThrottlerGuard)
  @Post('login')
  async login(
    @Body() user: LoginUserDto,
  ): Promise<{ accessToken: string } | null> {
    try {
      return await this.authService.login(user.email, user.password);
    } catch (error) {
      throw new HttpException(
        { message: (error as Error).message },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@CurrentUser() user: any) {
    return user;
  }
}
