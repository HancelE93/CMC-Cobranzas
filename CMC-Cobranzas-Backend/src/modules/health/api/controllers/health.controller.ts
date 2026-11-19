import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../../common/decorators/public.decorator';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Public()
  @Get()
  @ApiOperation({ summary: 'Verifica el estado del servicio' })
  @ApiResponse({ status: 200, description: 'Servicio en funcionamiento' })
  check() {
    return {
      status: 'ok',
      service: 'cmc-cobranzas-backend',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}

