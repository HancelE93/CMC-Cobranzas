import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BankMovementItemDto } from './bank-movement-item.dto';

export class ImportMovementsDto {
  @ApiProperty({
    description: 'Entidad financiera origen del extracto',
    example: 'Banco Pichincha',
  })
  @IsString()
  @IsNotEmpty()
  banco!: string;

  @ApiProperty({
    description: 'Lista de movimientos extraidos del extracto bancario',
    type: [BankMovementItemDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BankMovementItemDto)
  movimientos!: BankMovementItemDto[];
}

