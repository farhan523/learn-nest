import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'email is not valid' })
  email!: string;

  @IsNotEmpty({ message: 'password is required' })
  @IsString({ message: 'password must be a string' })
  @MinLength(3, { message: 'password must be at least 3 characters long' })
  @MaxLength(50, { message: 'password must be at most 50 characters long' })
  password!: string;
}
