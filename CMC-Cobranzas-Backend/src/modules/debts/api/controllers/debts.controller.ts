import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateDebtDto } from '../dtos/create-debt.dto';
import { DebtQueryDto } from '../dtos/debt-query.dto';
import { UpdateDebtDto } from '../dtos/update-debt.dto';
import { CreateDebtUseCase } from '../../application/use-cases/create-debt.use-case';
import { FindDebtsUseCase } from '../../application/use-cases/find-debts.use-case';
import { FindDebtByIdUseCase } from '../../application/use-cases/find-debt-by-id.use-case';
import { UpdateDebtUseCase } from '../../application/use-cases/update-debt.use-case';

@ApiTags('Deudas')
@ApiBearerAuth()
@Controller('debts')
export class DebtsController {
  constructor(
    private readonly createDebtUseCase: CreateDebtUseCase,
    private readonly findDebtsUseCase: FindDebtsUseCase,
    private readonly findDebtByIdUseCase: FindDebtByIdUseCase,
    private readonly updateDebtUseCase: UpdateDebtUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una nueva deuda de cliente' })
  @ApiResponse({ status: 201, description: 'Deuda registrada exitosamente con cuotas calculadas' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o cliente/producto inactivo' })
  @ApiResponse({ status: 404, description: 'Cliente o producto no encontrado' })
  create(@Body() dto: CreateDebtDto) {
    return this.createDebtUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar deudas con filtros por cliente, producto, estado y paginación' })
  @ApiResponse({ status: 200, description: 'Lista paginada de deudas' })
  findAll(@Query() query: DebtQueryDto) {
    return this.findDebtsUseCase.execute(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener el detalle de una deuda con pagos asociados' })
  @ApiResponse({ status: 200, description: 'Deuda encontrada' })
  @ApiResponse({ status: 404, description: 'Deuda no encontrada' })
  findById(@Param('id') id: string) {
    return this.findDebtByIdUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar estado, corte u observaciones de una deuda' })
  @ApiResponse({ status: 200, description: 'Deuda actualizada' })
  @ApiResponse({ status: 404, description: 'Deuda no encontrada' })
  update(@Param('id') id: string, @Body() dto: UpdateDebtDto) {
    return this.updateDebtUseCase.execute(id, dto);
  }
}

