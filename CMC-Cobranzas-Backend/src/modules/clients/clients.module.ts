import { Module } from '@nestjs/common';
import { ClientsController } from './api/controllers/clients.controller';
import { CreateClientUseCase } from './application/use-cases/create-client.use-case';
import { FindClientByIdUseCase } from './application/use-cases/find-client-by-id.use-case';
import { FindClientsUseCase } from './application/use-cases/find-clients.use-case';
import { UpdateClientUseCase } from './application/use-cases/update-client.use-case';
import { CLIENT_REPOSITORY_PORT } from './domain/interfaces/client-repository.port';
import { PrismaClientRepository } from './infrastructure/repositories/prisma-client.repository';

@Module({
  controllers: [ClientsController],
  providers: [
    CreateClientUseCase,
    FindClientsUseCase,
    FindClientByIdUseCase,
    UpdateClientUseCase,
    {
      provide: CLIENT_REPOSITORY_PORT,
      useClass: PrismaClientRepository,
    },
  ],
  exports: [CLIENT_REPOSITORY_PORT, FindClientByIdUseCase],
})
export class ClientsModule {}

