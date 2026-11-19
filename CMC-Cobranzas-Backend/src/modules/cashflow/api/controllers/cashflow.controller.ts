import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { CashFlowQueryDto } from '../dtos/cashflow-query.dto';
import { GetCashFlowReportUseCase } from '../../application/use-cases/get-cashflow-report.use-case';

@ApiTags('CashFlow')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cashflow')
export class CashFlowController {
  constructor(
    private readonly getCashFlowReportUseCase: GetCashFlowReportUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Consultar reporte de flujo de efectivo proyectado vs ejecutado por mes',
  })
  @ApiResponse({
    status: 200,
    description: 'Reporte mensual de flujo de efectivo con desglose semanal y mora',
  })
  async getReport(@Query() query: CashFlowQueryDto) {
    return this.getCashFlowReportUseCase.execute(query);
  }
}

