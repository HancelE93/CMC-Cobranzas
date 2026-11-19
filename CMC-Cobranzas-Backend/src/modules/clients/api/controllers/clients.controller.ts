import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateClientDto } from '../dtos/create-client.dto';
import { ClientQueryDto } from '../dtos/client-query.dto';
import { UpdateClientDto } from '../dtos/update-client.dto';
import { CreateClientUseCase } from '../../application/use-cases/create-client.use-case';
import { FindClientsUseCase } from '../../application/use-cases/find-clients.use-case';
import { FindClientByIdUseCase } from '../../application/use-cases/find-client-by-id.use-case';
import { UpdateClientUseCase } from '../../application/use-cases/update-client.use-case';

@ApiTags('Clientes')
@ApiBearerAuth()
@Controller('clients')
export class ClientsController {
  constructor(
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly findClientsUseCase: FindClientsUseCase,
    private readonly findClientByIdUseCase: FindClientByIdUseCase,
    private readonly updateClientUseCase: UpdateClientUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente creado exitosamente' })
  @ApiResponse({ status: 409, description: 'Ya existe un cliente con esta cédula' })
  create(@Body() dto: CreateClientDto) {
    return this.createClientUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar clientes con filtros y paginación' })
  @ApiResponse({ status: 200, description: 'Lista paginada de clientes' })
  findAll(@Query() query: ClientQueryDto) {
    return this.findClientsUseCase.execute(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cliente por su ID' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  findById(@Param('id') id: string) {
    return this.findClientByIdUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos o estado de un cliente' })
  @ApiResponse({ status: 200, description: 'Cliente actualizado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
    return this.updateClientUseCase.execute(id, dto);
  }
}

