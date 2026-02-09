import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty({ message: 'title is required' })
  @IsString({ message: 'title must be a string' })
  @MinLength(3, { message: 'title must be at least 3 characters long' })
  @MaxLength(50, { message: 'title must be at most 50 characters long' })
  title!: string;

  @IsNotEmpty({ message: 'content is required' })
  @IsString({ message: 'content must be a string' })
  @MinLength(3, { message: 'content must be at least 3 characters long' })
  content!: string;
}

export class UpdatePostDto {
  @Optional()
  @IsNotEmpty({ message: 'title is required' })
  @IsString({ message: 'title must be a string' })
  @MinLength(3, { message: 'title must be at least 3 characters long' })
  @MaxLength(50, { message: 'title must be at most 50 characters long' })
  title?: string;

  @Optional()
  @IsNotEmpty({ message: 'content is required' })
  @IsString({ message: 'content must be a string' })
  @MinLength(3, { message: 'content must be at least 3 characters long' })
  content?: string;
}
