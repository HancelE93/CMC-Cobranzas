import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { CreateUserAdminDto } from '../dtos/create-user-admin.dto';
import { UpdateUserAdminDto } from '../dtos/update-user-admin.dto';
import { UserQueryDto } from '../dtos/user-query.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { FindUserByIdUseCase } from '../../application/use-cases/find-user-by-id.use-case';
import { FindUsersUseCase } from '../../application/use-cases/find-users.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';

@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUsersUseCase: FindUsersUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Crear un nuevo usuario del sistema (solo administradores)' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 409, description: 'El nombre de usuario o correo ya existe' })
  create(@Body() dto: CreateUserAdminDto) {
    return this.createUserUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar usuarios con filtros por rol, estado y búsqueda' })
  @ApiResponse({ status: 200, description: 'Lista paginada de usuarios' })
  findAll(@Query() query: UserQueryDto) {
    return this.findUsersUseCase.execute(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener el detalle de un usuario por su ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findById(@Param('id') id: string) {
    return this.findUserByIdUseCase.execute(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Actualizar datos, rol, estado, permisos o contraseña de un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  update(@Param('id') id: string, @Body() dto: UpdateUserAdminDto) {
    return this.updateUserUseCase.execute(id, dto);
  }
}

