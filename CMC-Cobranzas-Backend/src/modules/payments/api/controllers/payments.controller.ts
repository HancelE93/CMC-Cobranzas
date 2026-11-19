import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { Public } from '../../../../common/decorators/public.decorator';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { PaymentQueryDto } from '../dtos/payment-query.dto';
import { FindPaymentByIdUseCase } from '../../application/use-cases/find-payment-by-id.use-case';
import { FindPaymentsUseCase } from '../../application/use-cases/find-payments.use-case';
import { RegisterPaymentUseCase } from '../../application/use-cases/register-payment.use-case';
import { STORAGE_PORT, StoragePort } from '../../domain/interfaces/storage.port';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly registerPaymentUseCase: RegisterPaymentUseCase,
    private readonly findPaymentsUseCase: FindPaymentsUseCase,
    private readonly findPaymentByIdUseCase: FindPaymentByIdUseCase,
    @Inject(STORAGE_PORT) private readonly storage: StoragePort,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo abono o pago a una deuda con comprobante' })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiResponse({ status: 201, description: 'Pago registrado exitosamente y deuda amortizada' })
  @UseInterceptors(FileInterceptor('comprobante'))
  async create(
    @Body() dto: CreatePaymentDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.registerPaymentUseCase.execute(dto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Consultar listado de pagos con filtros y paginación' })
  @ApiResponse({ status: 200, description: 'Lista de pagos recuperada exitosamente' })
  async findAll(@Query() query: PaymentQueryDto) {
    return this.findPaymentsUseCase.execute(query);
  }

  @Public()
  @Get(':id/comprobante')
  @ApiOperation({ summary: 'Obtener y visualizar la imagen o archivo del comprobante de un pago' })
  @ApiResponse({ status: 200, description: 'Archivo del comprobante transmitido exitosamente' })
  @ApiResponse({ status: 404, description: 'Comprobante no encontrado' })
  async getComprobante(@Param('id') id: string, @Res() res: Response) {
    const payment = await this.findPaymentByIdUseCase.execute(id);
    if (!payment || !payment.comprobanteUrl) {
      throw new NotFoundException('Comprobante no encontrado para este pago');
    }
    const file = await this.storage.getFile(payment.comprobanteUrl);
    if (!file) {
      throw new NotFoundException('Archivo no disponible en Cloudflare R2');
    }
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', 'inline');
    return res.send(file.buffer);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar detalle de un pago por su ID' })
  @ApiResponse({ status: 200, description: 'Pago encontrado' })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  async findOne(@Param('id') id: string) {
    return this.findPaymentByIdUseCase.execute(id);
  }
}
