import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'OldPassword123!',
    description: 'Текущий пароль пользователя',
  })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    example: 'NewPassword123!',
    description: 'Новый пароль пользователя',
  })
  @IsString()
  @MinLength(8)
  newPassword: string;
}
