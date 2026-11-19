import { Module } from '@nestjs/common';
import { UsersController } from './api/controllers/users.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { FindUserByIdUseCase } from './application/use-cases/find-user-by-id.use-case';
import { FindUsersUseCase } from './application/use-cases/find-users.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { USER_ADMIN_REPOSITORY_PORT } from './domain/interfaces/user-admin-repository.port';
import { PrismaUserAdminRepository } from './infrastructure/repositories/prisma-user-admin.repository';

@Module({
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    FindUsersUseCase,
    FindUserByIdUseCase,
    UpdateUserUseCase,
    {
      provide: USER_ADMIN_REPOSITORY_PORT,
      useClass: PrismaUserAdminRepository,
    },
  ],
  exports: [USER_ADMIN_REPOSITORY_PORT, FindUserByIdUseCase],
})
export class UsersModule {}

