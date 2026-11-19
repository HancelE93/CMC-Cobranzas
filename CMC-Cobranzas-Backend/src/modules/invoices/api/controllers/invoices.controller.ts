import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { CreateInvoiceDto } from '../dtos/create-invoice.dto';
import { InvoiceQueryDto } from '../dtos/invoice-query.dto';
import { UpdateInvoiceStatusDto } from '../dtos/update-invoice-status.dto';
import { CreateInvoiceUseCase } from '../../application/use-cases/create-invoice.use-case';
import { FindInvoicesUseCase } from '../../application/use-cases/find-invoices.use-case';
import { FindInvoiceByIdUseCase } from '../../application/use-cases/find-invoice-by-id.use-case';
import { UpdateInvoiceStatusUseCase } from '../../application/use-cases/update-invoice-status.use-case';

@ApiTags('Invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(
    private readonly createInvoiceUseCase: CreateInvoiceUseCase,
    private readonly findInvoicesUseCase: FindInvoicesUseCase,
    private readonly findInvoiceByIdUseCase: FindInvoiceByIdUseCase,
    private readonly updateInvoiceStatusUseCase: UpdateInvoiceStatusUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una factura electronica para un cliente' })
  @ApiResponse({ status: 201, description: 'Factura registrada exitosamente' })
  async create(@Body() dto: CreateInvoiceDto) {
    return this.createInvoiceUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar facturas con filtros por cliente, deuda o estado' })
  @ApiResponse({ status: 200, description: 'Listado de facturas' })
  async findAll(@Query() query: InvoiceQueryDto) {
    return this.findInvoicesUseCase.execute(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una factura por ID' })
  @ApiResponse({ status: 200, description: 'Factura encontrada' })
  async findById(@Param('id') id: string) {
    return this.findInvoiceByIdUseCase.execute(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar el estado documental de la factura' })
  @ApiResponse({ status: 200, description: 'Estado documental actualizado' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceStatusDto,
  ) {
    return this.updateInvoiceStatusUseCase.execute(id, dto.estadoDocumental);
  }
}

