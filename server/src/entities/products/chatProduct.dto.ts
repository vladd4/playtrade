import { ApiProperty } from '@nestjs/swagger';

export class ChatProductDto {
  @ApiProperty({
    example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56',
    description: 'Уникальный идентификатор продукта',
  })
  id: string;

  @ApiProperty({ example: 'Gaming Mouse', description: 'Название продукта' })
  name: string;
}
