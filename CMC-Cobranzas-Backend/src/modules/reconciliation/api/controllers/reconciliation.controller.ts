import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { AuthPayload } from '../../../../common/interfaces/auth-payload.interface';
import { ImportMovementsDto } from '../dtos/import-movements.dto';
import { BankMovementQueryDto } from '../dtos/bank-movement-query.dto';
import { AutoReconciliationDto } from '../dtos/auto-reconciliation.dto';
import { ManualReconciliationDto } from '../dtos/manual-reconciliation.dto';
import { ImportBankMovementsUseCase } from '../../application/use-cases/import-bank-movements.use-case';
import { FindBankMovementsUseCase } from '../../application/use-cases/find-bank-movements.use-case';
import { AutoReconcileUseCase } from '../../application/use-cases/auto-reconcile.use-case';
import { ManualReconcileUseCase } from '../../application/use-cases/manual-reconcile.use-case';
import { FindReconciliationsUseCase } from '../../application/use-cases/find-reconciliations.use-case';

@ApiTags('Reconciliation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reconciliation')
export class ReconciliationController {
  constructor(
    private readonly importMovementsUseCase: ImportBankMovementsUseCase,
    private readonly findBankMovementsUseCase: FindBankMovementsUseCase,
    private readonly autoReconcileUseCase: AutoReconcileUseCase,
    private readonly manualReconcileUseCase: ManualReconcileUseCase,
    private readonly findReconciliationsUseCase: FindReconciliationsUseCase,
  ) {}

  @Post('import')
  @ApiOperation({ summary: 'Importar movimientos bancarios de extractos con deduplicacion' })
  @ApiResponse({ status: 201, description: 'Extracto procesado exitosamente' })
  async importMovements(@Body() dto: ImportMovementsDto) {
    return this.importMovementsUseCase.execute(dto);
  }

  @Get('movements')
  @ApiOperation({ summary: 'Listar movimientos bancarios con filtros por entidad y estado' })
  @ApiResponse({ status: 200, description: 'Listado de movimientos bancarios' })
  async findMovements(@Query() query: BankMovementQueryDto) {
    return this.findBankMovementsUseCase.execute(query);
  }

  @Post('auto')
  @ApiOperation({ summary: 'Ejecutar motor de conciliacion automatica por monto y transaccion' })
  @ApiResponse({ status: 200, description: 'Proceso de conciliacion automatica finalizado' })
  async autoReconcile(@Body() dto: AutoReconciliationDto) {
    return this.autoReconcileUseCase.execute(dto?.banco);
  }

  @Post('manual')
  @ApiOperation({ summary: 'Vincular manualmente un movimiento bancario huerfano con un pago' })
  @ApiResponse({ status: 201, description: 'Conciliacion manual registrada exitosamente' })
  async manualReconcile(
    @Body() dto: ManualReconciliationDto,
    @CurrentUser() user: AuthPayload,
  ) {
    return this.manualReconcileUseCase.execute(dto, user?.username);
  }

  @Get()
  @ApiOperation({ summary: 'Listar historial de conciliaciones realizadas' })
  @ApiResponse({ status: 200, description: 'Historial de conciliaciones' })
  async findAll() {
    return this.findReconciliationsUseCase.execute();
  }
}

