import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserSignUpDto {
  @IsNotEmpty({ message: 'Name can not be null' })
  @IsString()
  name: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  @MinLength(5)
  password: string;
}
