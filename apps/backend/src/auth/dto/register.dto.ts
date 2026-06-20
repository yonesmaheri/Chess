import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  lastName: string;

  @IsString()
  @Matches(/^09\d{9}$/, {
    message: 'Phone number must start with 09 and contain 11 digits.',
  })
  phone: string;

  @IsString()
  @MinLength(8)
  password: string;
}
