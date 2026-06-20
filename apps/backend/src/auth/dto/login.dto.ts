import { IsString, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @Matches(/^09\d{9}$/, {
    message: 'Phone number must start with 09 and contain 11 digits.',
  })
  phone: string;

  @IsString()
  @MinLength(8)
  password: string;
}
