import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateInvoiceStatusDto {
  @ApiProperty({
    description: 'Nuevo estado documental de la factura',
    example: 'emitida',
  })
  @IsString()
  @IsNotEmpty()
  estadoDocumental!: string;
}

