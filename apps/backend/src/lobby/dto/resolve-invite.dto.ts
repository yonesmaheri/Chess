import { IsString, Length, Matches } from 'class-validator';

export class ResolveInviteDto {
  @IsString()
  @Length(32, 64)
  @Matches(/^[a-f0-9]+$/i)
  token!: string;
}
